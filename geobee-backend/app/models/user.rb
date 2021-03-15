class User < ApplicationRecord
    has_many :scores 
    has_many :states_games, through: :scores

  
end
