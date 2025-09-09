class CreateAssignments < ActiveRecord::Migration[6.1]
  def change
    create_table :assignments do |t|
      t.string :title
      t.text :description
      t.datetime :due_date
      t.integer :course_id, null: false

      t.timestamps
    end
  end
end
