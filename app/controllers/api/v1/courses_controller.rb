class Api::V1::CoursesController < ApplicationController
  load_and_authorize_resource
  
  # def index
  #   byebug
  #   @courses = current_user.courses.includes(:assignments)
  #   render json: @courses.as_json(
  #     include: { assignments: { only: [:id, :title, :description, :due_date] } },
  #     only: [:id, :title, :description]
  #   ), status: :ok
  # end
  
  def index
    # byebug
    render json: @courses, status: :ok
  end


  def show
    # byebug
    render json: @course, status: :ok
  end

  def create
    # byebug
    @course.user = current_user
    if @course.save
      render json: @course, status: :created
    else
      render json: { errors: @course.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    # byebug
    if @course.update(course_params)
      render json: @course, status: :ok
    else
      render json: { errors: @course.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    #  byebug
    @course.destroy
    head :no_content
  end

  private

  def course_params
    params.require(:course).permit(:title, :description, :syllabus, files: [], syllabus_file: nil)
  end
end
