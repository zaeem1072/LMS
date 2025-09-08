class Course < ApplicationRecord
    belongs_to :user
    has_many :assignments, dependent: :destroy
    has_many :attachments, as: :attachable, dependent: :destroy
    has_many :enrollments, dependent: :destroy

    has_many_attached :files
    has_one_attached :syllabus_file

    validates :title, presence: true , uniqueness: true
    validates :user_id, presence: true

end
