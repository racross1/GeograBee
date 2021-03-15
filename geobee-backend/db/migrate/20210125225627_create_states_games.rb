class CreateStatesGames < ActiveRecord::Migration[6.1]
  def change
    create_table :states_games do |t|
      t.string :difficulty

      t.timestamps
    end
  end
end
