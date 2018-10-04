# WARNING: this file ensures that doc DSL methods
# are included before our shared contexts
# so we can include them by metadata
#
# maybe load the environment first?
require 'rspec_api_documentation'
require 'rspec_api_documentation/dsl'

module NamingHelper
  def model_name
    metadata[:resource_name].constantize.model_name
  end

  def model
    if model = metadata[:model_name]
      model.constantize.model_name.human
    else
      model_name.human
    end
  end

  def models
    model_name.human(count: 2)
  end
end

module ApiHelper

  module Resource
    def resource(alias_name = nil, &block)
      let(:resource, &block)
      let(alias_name) { resource } if alias_name
    end
  end

  module Request
    def self.relative_path(line)
      line = line.sub(File.expand_path("."), ".")
      line = line.sub(/\A([^:]+:\d+)$/, '\\1')
      return nil if line == '-e:1'
      line
    end

    def request(description, params = {}, &block)
      # nasty way - find first file called something_spec.rb and use it as example definition
      source = caller.find{|caller| caller =~ /\_spec\.rb:\d+\:in/ }
      file_path = source[0, source =~ /:/]
      location = source[0, source =~ /(:in|$)/]
      location = ApiHelper::Request.relative_path(location)

      example(description, location: location, file_path: file_path) do
        contexts = params.extract!(:status, :body)

        do_request(params)
        instance_eval &block if block_given?

        case contexts[:body]
        when nil, true
            response_body.should == serialized
        when false
            response_body.presence.should == nil
        end

        code = contexts[:status] || 200
        status.should == code

      end
    end
  end

  def api(name, options = {}, &block)
    api_name = "#{name} API"
    shared_examples(api_name, &block)

    formats = options.fetch(:format){ [:json, :xml] }
    metadata = options.except(:format).merge(api: true)

    context name, metadata do
      # for each format create context and include api examples
      formats.each do |format|
        context "#{format} format", format: format do
          let(:format) { format }
          include_examples(api_name)
        end
      end
    end
  end

  def format_context(format, context, &block)
    context("#{format} #{context}", :api, context.to_sym, format.to_sym, serialize: :resource, &block)
  end

  def json(context, &block)
    format_context(:json, context, &block)
  end

  def xml(context, &block)
    format_context(:xml, context, &block)
  end
end

RSpec.configure do |config|
  # rspec 3 default
  config.treat_symbols_as_metadata_keys_with_true_values = true

  config.expose_current_running_example_as :example

  config.extend NamingHelper, api_doc_dsl: :endpoint
  config.extend NamingHelper, :api
  config.extend ApiHelper, api_doc_dsl: :resource
  config.extend ApiHelper, api_doc_dsl: :resource
  config.extend ApiHelper::Request, api_doc_dsl: :endpoint
  config.extend ApiHelper::Resource, serialize: :resource
end

require 'spec_helper'
require 'equivalent-xml/rspec_matchers'
require 'rspec-html-matchers'