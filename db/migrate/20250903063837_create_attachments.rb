class CreateAttachments < ActiveRecord::Migration[6.1]
  def change
    create_table :attachments do |t|
      t.string :file_path
      t.string :file_type
      t.references :attachable, polymorphic: true, null: false

      t.timestamps
    end
  end
end
