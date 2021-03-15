class CreateScores < ActiveRecord::Migration[6.1]
  def change
    create_table :scores do |t|
      t.integer :total
      t.references :user, null: false, foreign_key: true
      t.references :states_game, null: false, foreign_key: true

      t.timestamps
    end
  end
end
