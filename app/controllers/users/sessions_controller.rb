class Users::SessionsController < Devise::SessionsController
  protect_from_forgery with: :null_session, if: -> { request.format.json? }
  
  require_relative '../../services/jwt_service'
  

  def destroy
    if request.format.json?
      header = request.headers['Authorization']
      token = header.split(' ').last if header
      JwtService.blacklist_token(token) if token
      
      render json: {
        success: true,
        message: 'Signed out successfully'
      }
    else
      super
    end
  end

  def create
    self.resource = warden.authenticate!(auth_options)
    set_flash_message!(:notice, :signed_in)
    sign_in(resource_name, resource)
    
    if request.format.json?
      token = JwtService.encode(user_id: resource.id)
      render json: {
        success: true,
        message: 'Signed in successfully',
        token: token,
        user: {
          id: resource.id,
          email: resource.email,
          role: resource.role,
          created_at: resource.created_at
        }
      }
    else
      yield resource if block_given?
      respond_with resource, location: after_sign_in_path_for(resource)
    end
  end
end
