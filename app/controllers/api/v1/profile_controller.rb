class Api::V1::ProfileController < ApplicationController
  before_action :authenticate_user!

  def show
    authorize! :read, :profile
    user_data = {
      id: current_user.id,
      email: current_user.email,
      first_name: current_user.first_name,
      last_name: current_user.last_name,
      bio: current_user.bio,
      phone: current_user.phone,
      role: current_user.role,
      created_at: current_user.created_at,
      updated_at: current_user.updated_at
    }
    
    render json: { user: user_data }, status: :ok
  end

  def update
    # byebug
    authorize! :update, :profile
    if current_user.update(profile_params)
      user_data = {
        id: current_user.id,
        email: current_user.email,
        first_name: current_user.first_name,
        last_name: current_user.last_name,
        bio: current_user.bio,
        phone: current_user.phone,
        role: current_user.role,
        created_at: current_user.created_at,
        updated_at: current_user.updated_at
      }
      
      render json: { 
        success: true, 
        message: 'Profile updated successfully',
        user: user_data 
      }, status: :ok
    else
      render json: { 
        success: false, 
        errors: current_user.errors.full_messages 
      }, status: :unprocessable_entity
    end
  end

  def change_password
    # byebug
    authorize! :update, :profile
    if current_user.valid_password?(password_params[:current_password])
      if current_user.update(password: password_params[:new_password])
        render json: { 
          success: true, 
          message: 'Password updated successfully' 
        }, status: :ok
      else
        render json: { 
          success: false, 
          errors: current_user.errors.full_messages 
        }, status: :unprocessable_entity
      end
    else
      render json: { 
        success: false, 
        errors: ['Current password is incorrect'] 
      }, status: :unprocessable_entity
    end
  end

  private

  def profile_params
    params.require(:user).permit(:first_name, :last_name, :bio, :phone)
  end

  def password_params
    params.require(:password).permit(:current_password, :new_password)
  end
end
