# frozen_string_literal: true

class Finance::PostpaidBillingStrategy < Finance::BillingStrategy

  def daily(options = {})
    now = options[:now].presence || Time.now.utc
    bill_and_charge_each(options) do |buyer|
      Rails.logger.info("Started to bill and charge of #{buyer.name} at #{now}")
      bill_expired_trials(buyer, now)

      only_on_days(now, 1) do
        bill_variable_costs(buyer, now - 1.month)
        finalize_invoices_of(buyer, now)
        bill_fixed_costs(buyer, now)
      end

      issue_invoices_of(buyer, now)

      charge_invoices(buyer, now)

      info("Successfully finished billing and charging of #{buyer.name}")
    end

    notify_billing_finished(now) unless options[:skip_notifications] # In Sidekiq, notifications are triggered by the callback of the jobs batch
  end

  def name
    'postpaid'
  end

  def description
    %q{ In postpaid mode, all fixed fees as well as variable fees
        are billed at the end of the month.
    }
  end

  def bill_plan_change(contract, period)
    paid_until = contract.paid_until.utc
    period_begin = period.begin.utc
    period_end = period.end.utc

    unless paid_until.to_date < period_begin.to_date
      old_plan = contract.old_plan
      entire_period = TimeRange.new(paid_until, period_end) # This can possibly cross several months
      bill_possibly_long_period(contract, old_plan, entire_period)
      add_plan_cost(:refund, contract, old_plan, period)
    end

    add_plan_cost(:bill, contract, contract.plan, period)
  end

  # Differs from Postpaid #bill_variable_costs just by the invoice
  # that is used to bill on: here it is the current month.
  #
  def bill_variable_costs(buyer, now = Time.now.utc)
    info("Billing variable cost of #{buyer.org_name} at #{now}", buyer)
    buyer.billable_contracts.find_each(batch_size: 100) do |contract|
      contract.bill_for_variable(Month.new(now), invoice_for(buyer, now))
    end
  end

  protected

  def invoices_to_finalize_of(buyer, now)
    account.buyer_invoices.by_buyer(buyer).before(now).opened
  end

  def bill_possibly_long_period(contract, plan, period)
    for_every_month_within(period) do |month|
      add_plan_cost(:bill, contract, plan, month)
    end
  end

  def for_every_month_within(period)
    dates = (period.begin.to_date..period.end.to_date).to_a
    dates.uniq { |date| [date.year, date.month] }.each do |first_date_of_month|
      beginning_of_month = first_date_of_month.to_time(:utc)
      beginning_of_period = [beginning_of_month, period.begin].max
      end_of_period = [beginning_of_month.end_of_month, period.end].min

      yield TimeRange.new(beginning_of_period, end_of_period)
    end
  end
end
