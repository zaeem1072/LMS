class Api::V1::AssignmentsController < ApplicationController
  before_action :set_course, except: [:my_assignments, :all_assignments]
  load_and_authorize_resource :course, except: [:my_assignments, :all_assignments]
  load_and_authorize_resource :assignment, through: :course, except: [:my_assignments, :all_assignments]

  def index
    # byebug
    
    @assignments = @course.assignments
    render json: @assignments, status: :ok
  end

  def show
    # byebug
    render json: @assignment, status: :ok
  end

  def create
    # byebug

    if @assignment.save
      render json: @assignment, status: :created
    else
      render json: { errors: @assignment.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    # byebug
    if @assignment.update(assignment_params)
      render json: @assignment, status: :ok
    else
      render json: @assignment.errors, status: :unprocessable_entity
    end
  end

  def destroy
    # byebug
    @assignment.destroy
    head :no_content
  end

  def my_assignments
    # byebug
    authorize! :my_assignments, Assignment
    assignments = Assignment.includes(:course)
                            .joins(course: :enrollments)
                            .where(enrollments: { user_id: current_user.id })
    
    assignments_with_course = assignments.map do |assignment|
      assignment.as_json.merge(
        course_title: assignment.course.title,
        course_id: assignment.course.id
      )
    end
    
    render json: assignments_with_course
  end

  def all_assignments
    # byebug
    authorize! :all_assignments, Assignment
    assignments = Assignment.includes(:course)
                            .joins(:course)
                            .where(courses: { user_id: current_user.id })
                            .select('assignments.*, courses.title as course_title, courses.id as course_id')

    assignments_with_course = assignments.map do |assignment|
      assignment.as_json.merge(
        course_title: assignment.course.title,
        course_id: assignment.course.id
      )
    end

    render json: assignments_with_course, status: :ok
  end


  private

  def set_course
    @course = Course.find(params[:course_id])
  end

  def assignment_params
    params.require(:assignment).permit(:title, :description, :due_date, files: [], instruction_file: nil)
  end
end
