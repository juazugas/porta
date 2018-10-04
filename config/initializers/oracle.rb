# frozen_string_literal: true

if System::Database.oracle?
  require 'arel/visitors/oracle12'
  ENV['SCHEMA'] = 'db/oracle_schema.rb'
  Rails.configuration.active_record.schema_format = ActiveRecord::Base.schema_format = :ruby

  ActiveRecord::ConnectionAdapters::TableDefinition.prepend(Module.new do
    def column(name, type, options = {})
      # length parameter is not compatible with rails mysql/pg adapters:
      # rails expects it is limit in bytes, but oracle adapter expects it in number of characters
      # TODO: probably would be better to convert the byte limit to character limit
      if type == :integer
        super(name, type, options.except(:limit))
      else
        super
      end
    end
  end)

  ENV['NLS_LANG'] ||= 'AMERICAN_AMERICA.UTF8'

  ActiveRecord::ConnectionAdapters::OracleEnhancedAdapter.class_eval do
    remove_const(:IDENTIFIER_MAX_LENGTH)
    const_set(:IDENTIFIER_MAX_LENGTH, 128)

    prepend(Module.new do
      # We need to patch Oracle Adapter quoting to actually serialize CLOB columns.
      # https://github.com/rsim/oracle-enhanced/issues/1588#issue-272289146
      # The default behaviour is to serialize them to 'empty_clob()' basically wiping out the data.
      # The team behind it believes `Table.update_all(column: 'text')`
      # should wipe all your data in that column: https://github.com/rsim/oracle-enhanced/issues/1588#issuecomment-343353756
      # So we try to convert the text to using `to_clob` function.
      def quote(value, column = nil)
        type = column&.type

        case value && type
        when :text, :binary
          # I know this looks ugly, but that just modified copy paste of what the adapter does (minus the rescue).
          # It is a bit improved in next version due to ActiveRecord Attributes API.
          %{to_#{(type_to_sql(type) || 'blob').downcase}(#{quote(value)})}
        else
          super
        end
      end
    end)
  end

  BabySqueel::Nodes::Attribute.prepend(Module.new do
    # those relations are used in subqueries and oracle does not support ORDER in subqueries
    private def sanitize_relation(rel)
      super rel.unscope(:order)
    end
  end)

  ThinkingSphinx::ActiveRecord::SQLSource.prepend(Module.new do
    # If the Adapter is Oracle then we forcibly use ODBC client
    def type
      @type ||= case adapter
                when ThinkingSphinx::ActiveRecord::DatabaseAdapters::OracleAdapter
                  'odbc'
                else
                  super
                end
    end
  end)

  ThinkingSphinx::ActiveRecord::DatabaseAdapters.module_eval do
    class << self
      prepend(Module.new do
        # https://github.com/pat/thinking-sphinx/blob/v3.2.0/lib/thinking_sphinx/active_record/database_adapters.rb#L35-L45
        # Adding a new DatabaseAdapters for ThinkingSphinx
        # This adds support for Oracle. OracleAdapter is responsible of query generation for Sphinx
        def adapter_for(model)
          return default.new(model) if default

          adapter = adapter_type_for(model)
          klass   = case adapter
                    when :oracle
                      ThinkingSphinx::ActiveRecord::DatabaseAdapters::OracleAdapter
                    else
                      super
                    end
          klass.new model
        end

        # https://github.com/pat/thinking-sphinx/blob/v3.2.0/lib/thinking_sphinx/active_record/database_adapters.rb#L21-L33
        # This method is only needed for `adapter_for`
        # Part of freedom patch for ThinkingSphinx handling with Oracle
        def adapter_type_for(model)
          class_name = model.connection.class.name
          case class_name.split('::').last
          when /oracle/i
            :oracle
          else
            super
          end
        end
      end
      )
    end
  end

  ThinkingSphinx::Deltas::DatetimeDelta.prepend(Module.new do
    # https://github.com/pat/ts-datetime-delta/blob/v2.0.2/lib/thinking_sphinx/deltas/datetime_delta.rb#L167
    # A SQL condition (as part of the WHERE clause) that limits the result set to
    # just the delta data, or all data, depending on whether the toggled argument
    # is true or not. For datetime deltas, the former value is a check on the
    # delta column being within the threshold. In the latter's case, no condition
    # is needed, so nil is returned.
    def clause(*args)
      model    = (args.length >= 2 ? args[0] : nil)
      is_delta = (args.length >= 2 ? args[1] : args[0]) || false

      table_name  = (model.nil? ? adapter.quoted_table_name   : model.quoted_table_name)
      column_name = (model.nil? ? adapter.quote(@column.to_s) : model.connection.quote_column_name(@column.to_s))

      if is_delta
        if adapter.class.name.downcase[/oracle/]
          "((#{table_name}.#{column_name} - SYSDATE) * 60 * 60 * 24) + #{@threshold} > 0"
        else
          super
        end
      else
        nil
      end
    end
  end)

  ThinkingSphinx::ActiveRecord::SQLSource.prepend(Module.new do
    # This autogenerate the odbc_dsn string based on database.yml
    # For now it is only particular to our project, later we could extract it and make a PR to the upstream project
    def set_database_settings(settings)
      super
      conf = System::Database.configuration_specification.config
      if type == 'odbc'
        @odbc_dsn ||= "DSN=oracle;Driver={Oracle-Driver};Dbq=#{conf[:host]}:#{conf[:port] || 1521}/#{conf[:database]};Uid=#{conf[:username]};Pwd=#{conf[:password]}"
      end
    end
  end)

end