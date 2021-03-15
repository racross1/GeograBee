class Score < ApplicationRecord
  belongs_to :user
  belongs_to :states_game
end
