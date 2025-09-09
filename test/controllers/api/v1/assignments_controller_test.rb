require "test_helper"

class Api::V1::AssignmentsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get api_v1_assignments_index_url
    assert_response :success
  end

  test "should get show" do
    get api_v1_assignments_show_url
    assert_response :success
  end

  test "should get create" do
    get api_v1_assignments_create_url
    assert_response :success
  end

  test "should get update" do
    get api_v1_assignments_update_url
    assert_response :success
  end

  test "should get destroy" do
    get api_v1_assignments_destroy_url
    assert_response :success
  end
end
