require 'test_helper'

class DeveloperPortal::Admin::AccountsControllerTest < DeveloperPortal::ActionController::TestCase

  test "update without account params should respond with 400" do
    provider = FactoryGirl.create(:simple_provider)
    buyer = FactoryGirl.create(:buyer_account, :provider_account => provider)

    host! provider.domain
    login_as buyer.first_admin
    put :update
    assert_response 400
  end
end