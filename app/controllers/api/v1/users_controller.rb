class Api::V1::UsersController < ApplicationController
  load_and_authorize_resource
  

  def index
    authorize! :index, User
    render json: {
      success: true,
      users: @users.select(:id, :email, :role, :first_name, :last_name, :created_at),
      message: "Users loaded successfully"
    }
  end

  def show
    render json: {
      success: true,
      user: @user.as_json(except: [:password_digest, :reset_password_token]),
      message: "User details loaded"
    }
  end

  def create
    if @user.save
      render json: {
        success: true,
        message: 'User created successfully',
        user: {
          id: @user.id,
          email: @user.email,
          role: @user.role,
          first_name: @user.first_name,
          last_name: @user.last_name,
          created_at: @user.created_at
        }
      }, status: :created
    else
      render json: {
        success: false,
        errors: @user.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  def update
    if @user.update(user_params)
      render json: {
        success: true,
        message: 'User updated successfully',
        user: @user.as_json(except: [:password_digest, :reset_password_token])
      }
    else
      render json: {
        success: false,
        errors: @user.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  def destroy
    if @user.destroy
      render json: {
        success: true,
        message: 'User deleted successfully'
      }
    else
      render json: {
        success: false,
        message: 'Failed to delete user'
      }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:email, :password, :password_confirmation, :role, :first_name, :last_name)
  end
end
