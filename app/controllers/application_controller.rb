class ApplicationController < ActionController::Base
  # before_action do
  #   Rails.logger.info "Session: #{session.to_hash}"
  # end

  
  protect_from_forgery with: :null_session
  respond_to :json
  
  require_relative '../services/jwt_service'
  
  # before_action :set_cors_headers
  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :authenticate_request, if: -> { request.path.start_with?('/api/') }
  # before_action :set_current_user_for_cancan, if: -> { request.path.start_with?('/api/') }
  
  def respond_with(resource, _opts = {})
    if request.format.json? || request.content_type == 'application/json'
      if resource.persisted?
        render json: { 
          success: true, 
          message: 'Success',
          user: {
            id: resource.id,
            email: resource.email,
            role: resource.role,
            created_at: resource.created_at
          }
        }
      else
        render json: { success: false, errors: resource.errors.full_messages }, status: :unprocessable_entity
      end
    else
      super
    end
  end

  private

  # def set_cors_headers
  #   # Allow any localhost port for development
  #   if request.headers['Origin'] && request.headers['Origin'].match?(/^http:\/\/localhost:\d+$/)
  #     response.headers['Access-Control-Allow-Origin'] = request.headers['Origin']
  #   end
  #   response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  #   response.headers['Access-Control-Allow-Headers'] = 'Origin, Content-Type, Accept, Authorization, X-Requested-With, X-CSRF-Token'
  #   response.headers['Access-Control-Allow-Credentials'] = 'true'
  # end

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:email, :password, :password_confirmation, :role])
    devise_parameter_sanitizer.permit(:sign_in, keys: [:email, :password])
  end

  def authenticate_request
    header = request.headers['Authorization']
    header = header.split(' ').last if header
    begin
      @decoded = JwtService.decode(header)
      if @decoded
        @current_user = User.find(@decoded[:user_id])
        Rails.logger.info "JWT Authentication successful: User #{@current_user.id} (#{@current_user.email}, #{@current_user.role})"
      else
        Rails.logger.info "JWT Authentication failed: No token decoded"
        render json: { errors: 'Unauthorized' }, status: :unauthorized
      end
    rescue ActiveRecord::RecordNotFound => e
      Rails.logger.info "JWT Authentication failed: User not found"
      render json: { errors: 'Unauthorized' }, status: :unauthorized
    rescue JWT::DecodeError => e
      Rails.logger.info "JWT Authentication failed: Invalid token"
      render json: { errors: 'Unauthorized' }, status: :unauthorized
    end
  end

  def current_user
    Rails.logger.info "current_user method called, returning: #{@current_user.inspect}"
    if request.path.start_with?('/api/')
      @current_user
    else
      super rescue @current_user
    end
  end

  # def set_current_user_for_cancan
  #   Rails.logger.info "Setting current user for CanCanCan: #{@current_user.inspect}"
  # end

  def authenticate_user!
    if request.path.start_with?('/api/')
      Rails.logger.info "authenticate_user! called for API route - JWT user: #{@current_user.inspect}"
      unless @current_user
        render json: { errors: 'Unauthorized' }, status: :unauthorized
      end
    else
      super
    end
  end

  def current_ability
    user = current_user
    Rails.logger.info "CanCanCan current_ability called with user: #{user.inspect}"
    @current_ability ||= ::Ability.new(user)
  end
end
