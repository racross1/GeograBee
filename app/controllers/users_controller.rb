class UsersController < ApplicationController

    def index
        users = User.all 
        render json: users, only: :username
    end

    def show
        user = User.find(params['id'])
        user_games = user.states_games
        result = user_games.map {|i| {i.difficulty => i.scores[0]}}
        render json: result.reverse
    end

    def create
        user = User.find_or_create_by(username: user_params["username"])
        render json: user    
    end

    private 

    def user_params
        params.require(:user).permit(:username)
    end
    

    

end
