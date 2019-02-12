# frozen_string_literal: true

class Admin::Api::Registry::PoliciesController < Admin::Api::BaseController
  clear_respond_to
  respond_to :json


  # TODO: ApiDocs documentation :)
  def create
    render json: {foo: 'bar'}.to_json
  end
end
