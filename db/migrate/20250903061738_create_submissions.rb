class CreateSubmissions < ActiveRecord::Migration[6.1]
  def change
    create_table :submissions do |t|
      t.text :content
      t.integer :assignment_id, null: false
      t.integer :user_id, null: false

      t.timestamps
    end
  end
end
