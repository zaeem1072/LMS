class Api::V1::AttachmentsController < ApplicationController
  before_action :set_attachable
  before_action :authorize_attachable

  def create
    # byebug
    attachment = @attachable.attachments.build(attachment_params)
    if attachment.save
      render json: attachment, status: :created
    else
      render json: { errors: attachment.errors.full_messages }, status: :unprocessable_entity
    end
  end
    
  def destroy
    # byebug
    attachment = @attachable.attachments.find(params[:id])
    authorize! :destroy, attachment
    attachment.destroy
    head :no_content
  end

  private

  def set_attachable
    # byebug
    if params[:submission_id]
      @attachable = Submission.find(params[:submission_id])
    elsif params[:assignment_id]
      @attachable = Assignment.find(params[:assignment_id]) 
    elsif params[:course_id] 
      @attachable = Course.find(params[:course_id])
    else
      render json: { error: "Attachable not found" }, status: :unprocessable_entity
    end
  end

  def authorize_attachable
    authorize! :read, @attachable
  end

  def attachment_params
    params.require(:attachment).permit(:file_path, :file_type)
  end
end
