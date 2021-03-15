class ScoresController < ApplicationController
    def index
        scores = Score.all
        render json: scores, only: [:user_id, :states_game_id, :total]
    end

    def create
        render json: Score.create(score_params)
    end

    private 

    def score_params
        params.require(:score).permit(:total, :user_id, :states_game_id)
    end
end

