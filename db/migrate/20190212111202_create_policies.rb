class CreatePolicies < ActiveRecord::Migration
  def change
    create_table :policies do |t|
      t.string :name
      t.string :version
      t.binary :schema, limit: 16.megabytes
      t.timestamps
    end
  end
end
