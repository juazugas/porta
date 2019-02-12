# frozen_string_literal: true

require 'test_helper'

class Admin::Api::Registry::PoliciesControllerTest < ActionDispatch::IntegrationTest
  def setup
    @provider = FactoryBot.create(:provider_account)
    login! @provider
  end

  test 'TODO - WIP' do
    post admin_api_registry_policies_path({name: 'name', version: 'version', schema: '{"foo": "bar"}'})
    pp response.status
    pp response.body
  end
end
