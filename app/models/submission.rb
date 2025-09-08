class Submission < ApplicationRecord
    belongs_to :assignment
    belongs_to :user
    has_many :attachments, as: :attachable, dependent: :destroy

    has_many_attached :files

    validates :assignment_id, presence: true
    validates :user_id, presence: true
    validates :user_id, uniqueness: { scope: :assignment_id, message: "You have already submitted this assignment" }
    
    validate :files_must_be_present

    private

    def files_must_be_present
        unless files.attached?
            errors.add(:base, "At least one file must be uploaded")
        end
    end

end

