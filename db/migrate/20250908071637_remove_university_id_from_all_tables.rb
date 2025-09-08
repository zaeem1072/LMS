class RemoveUniversityIdFromAllTables < ActiveRecord::Migration[6.1]
  def change
    # remove_index :assignments, :university_id if index_exists?(:assignments, :university_id)
    # remove_column :assignments, :university_id, :integer
    
    # remove_index :attachments, :university_id if index_exists?(:attachments, :university_id)
    # remove_column :attachments, :university_id, :integer
    
    # remove_index :courses, :university_id if index_exists?(:courses, :university_id)
    # remove_column :courses, :university_id, :integer
    
    # remove_index :enrollments, :university_id if index_exists?(:enrollments, :university_id)
    # remove_column :enrollments, :university_id, :integer
    
    # remove_index :submissions, :university_id if index_exists?(:submissions, :university_id)
    # remove_column :submissions, :university_id, :integer
    
    # remove_index :users, :university_id if index_exists?(:users, :university_id)
    # remove_column :users, :university_id, :integer
  end 
end
