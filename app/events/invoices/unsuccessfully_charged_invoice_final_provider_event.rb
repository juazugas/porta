class Invoices::UnsuccessfullyChargedInvoiceFinalProviderEvent < BillingRelatedEvent
  extend Invoices::UnsuccessfullyChargedInvoiceCreatable
end