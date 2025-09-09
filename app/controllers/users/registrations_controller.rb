class Users::RegistrationsController < Devise::RegistrationsController
  protect_from_forgery with: :null_session, if: -> { request.format.json? }
  
  require_relative '../../services/jwt_service'
  
    if sign_up_params[:role] == "mini_admin"
      unless user_signed_in? && current_user.admin?
        if request.format.json?
          render json: { 
            success: false, 
            message: 'Only admins can create mini_admin users' 
          }, status: :forbidden
          return
        else
          message: 'Only admins can create mini_admin users'
          return
        end
      end
    end
    
    build_resource(sign_up_params)

    resource.save
    yield resource if block_given?
    if resource.persisted?
      if resource.active_for_authentication?
        set_flash_message! :notice, :signed_up
        sign_up(resource_name, resource)
        
        if request.format.json?
          token = JwtService.encode(user_id: resource.id)
          render json: {
            success: true,
            message: 'Signed up successfully',
            token: token,
            user: {
              id: resource.id,
              email: resource.email,
              role: resource.role,
              created_at: resource.created_at
            }
          }
        else
          respond_with resource, location: after_sign_up_path_for(resource)
        end
      else
        set_flash_message! :notice, :"signed_up_but_#{resource.inactive_message}"
        expire_data_after_sign_in!
        respond_with resource, location: after_inactive_sign_up_path_for(resource)
      end
    else
      clean_up_passwords resource
      set_minimum_password_length
      if request.format.json?
        render json: { success: false, errors: resource.errors.full_messages }, status: :unprocessable_entity
      else
        respond_with resource
      end
    end
  end

  private

  def sign_up_params
    params.require(:user).permit(:email, :password, :password_confirmation, :role, :first_name, :last_name)
  end
end
