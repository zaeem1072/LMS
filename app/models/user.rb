class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_many :courses, dependent: :destroy
  has_many :enrollments, dependent: :destroy
  has_many :assignments, through: :courses
  has_many :submissions, dependent: :destroy

  enum role: { student: 0, teacher: 1 , admin: 2, mini_admin: 3 }
  
  validates :role, presence: true

end
