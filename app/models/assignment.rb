class Assignment < ApplicationRecord
    belongs_to :course
    has_many :submissions, dependent: :destroy
    has_many :attachments, as: :attachable, dependent: :destroy

    has_many_attached :files
    has_one_attached :instruction_file

    validates :title, presence: true
    validates :course_id, presence: true
end
