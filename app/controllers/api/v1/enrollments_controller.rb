class Api::V1::EnrollmentsController < ApplicationController
  before_action :authenticate_user!

  load_and_authorize_resource

  def index
    # byebug
    enrollments = current_user.enrollments.includes(:course)
    render json: enrollments.as_json(include: :course)
  end

  def create
    # byebug
    course = Course.find(params[:course_id])
    enrollment = current_user.enrollments.build(course: course)

    if enrollment.save
      render json: { success: true, message: "Enrolled successfully", enrollment: enrollment }, status: :created
    else
      render json: { success: false, errors: enrollment.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    # byebug
    enrollment = current_user.enrollments.find_by(course_id: params[:course_id])
    if enrollment
      enrollment.destroy
      render json: { success: true, message: "Unenrolled successfully" }
    else
      render json: { success: false, message: "Not enrolled in this course" }, status: :not_found
    end
  end
end
