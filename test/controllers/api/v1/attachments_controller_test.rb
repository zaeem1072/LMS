require "test_helper"

class Api::V1::AttachmentsControllerTest < ActionDispatch::IntegrationTest
  test "should get create" do
    get api_v1_attachments_create_url
    assert_response :success
  end

  test "should get destroy" do
    get api_v1_attachments_destroy_url
    assert_response :success
  end
end
