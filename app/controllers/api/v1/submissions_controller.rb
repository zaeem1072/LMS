class Api::V1::SubmissionsController < ApplicationController
  before_action :set_course_and_assignment, except: [:my_submissions]
  load_and_authorize_resource :assignment, except: [:my_submissions]
  load_and_authorize_resource :submission, through: :assignment, except: [:my_submissions]

  def index
    # byebug
    @submissions = @assignment.submissions
    render json: @submissions, status: :ok
  end

  def show
    # byebug
    render json: @submission, status: :ok
  end

  def create
    # byebug
    @submission.user = current_user
    if @submission.save
      render json: @submission, status: :created
    else
      render json: { errors: @submission.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    # byebug
    if @submission.update(submission_params)
      render json: @submission, status: :ok
    else
      render json: @submission.errors, status: :unprocessable_entity
    end
  end

  def destroy
    # byebug
    @submission.destroy
    head :no_content
  end

  def my_submissions
    # byebug
    authorize! :read, Submission
    @submissions = current_user.submissions.includes(assignment: :course)

    submissions_with_files = @submissions.map do |submission|
      submission_json = submission.as_json(include: { assignment: { include: :course } })
      submission_json['files'] = submission.files.attached? ? submission.files.map do |file|
        {
          id: file.id,
          filename: file.filename.to_s,
          content_type: file.content_type,
          byte_size: file.byte_size,
          url: url_for(file)
        }
      end : []
      submission_json
    end
    
    render json: submissions_with_files, status: :ok
  end

  private

  def set_course_and_assignment
    @course = Course.find(params[:course_id])
    @assignment = @course.assignments.find(params[:assignment_id])
  end

  def submission_params
    params.require(:submission).permit(:content, files: [])
  end

end
