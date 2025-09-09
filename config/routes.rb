Rails.application.routes.draw do
  devise_for :users,
  controllers: { sessions: 'users/sessions', registrations: 'users/registrations' }

  root 'pages#index'
  # namespace :api do
  #   namespace :v1 do
  #     resources :courses do
  #       resources :enrollments, only: [:index, :create, :destroy]
  #       resources :attachments, only: [:create, :destroy]
  #       resources :assignments do
  #         resources :attachments, only: [:create, :destroy]
  #         resources :submissions do
  #           resources :attachments, only: [:create, :destroy]
  #         end
  #       end
  #     end
  #     resources :enrollments, only: [:index, :create, :destroy]
  #   end
  # end


  namespace :api do
  namespace :v1 do
    resources :courses do
      resources :enrollments, only: [:index, :create, :destroy]
      resources :attachments, only: [:create, :destroy]
      resources :assignments do
        resources :attachments, only: [:create, :destroy]
        resources :submissions do
          resources :attachments, only: [:create, :destroy]
        end
      end
    end
    resources :enrollments, only: [:index, :create, :destroy]
    resources :submissions, only: [] do
      collection do
        get :my_submissions
      end
    end
    resources :assignments, only: [] do
      collection do
        get :my_assignments
        get :all_assignments
      end
    end
    
    
    get 'dashboard/teacher_stats', to: 'dashboard#teacher_stats'
    get 'dashboard/teacher_students', to: 'dashboard#teacher_students'
    get 'dashboard/student_stats', to: 'dashboard#student_stats'
    
    get 'profile', to: 'profile#show'
    patch 'profile', to: 'profile#update'
    put 'profile', to: 'profile#update'
    patch 'profile/change_password', to: 'profile#change_password'
    
    resources :users, only: [:index, :show, :create, :update, :destroy]
  end
end
end