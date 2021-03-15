const BASE_URL = "http://localhost:3000"
const STATESGAME_URL = `${BASE_URL}/states_games`
const SCORE_URL = `${BASE_URL}/scores`
const USER_URL = `${BASE_URL}/users`
let userLoggedIn = false
let playing = false
let currentUser
let currentGame
let countdown
login()

let score = 0

function handleLoginSubmit(e, username){
    e.preventDefault()
    fetch(USER_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'
    }, 
        body: JSON.stringify({'username': username}),
    })
    .then(resp => resp.json())
    .then(user => {
        currentUser = user 
        userLoggedIn = true
        document.getElementById("login-form").remove()
        document.getElementById('login').innerHTML = ''
        theGame = document.getElementsByClassName('gametime')
        newGame()
        getUserScores()
    })
}

function postGame(difficulty) {
    fetch(STATESGAME_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'
    }, 
        body: JSON.stringify({'difficulty': difficulty}),
    })
    .then(resp => resp.json())
    .then(statesGame => {
        startNewGame(statesGame)
        currentGame = statesGame
    })
}

function postScore(gameFinalScore) {
    fetch(SCORE_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'
    }, 
        body: JSON.stringify(gameFinalScore),
    })
    .then(resp => resp.json())
    .then(newScore => {
        console.log(newScore)
        playing = false
        currentGame = undefined 
        let scoreKeeper = document.getElementById('score-keeper')
        scoreKeeper.innerText = ''
        score = 0
        newGame()
        getUserScores()
    })
}

function getUserScores() {
    fetch(USER_URL + `/${currentUser.id}`)
    .then(resp => resp.json())    
    .then(userResultsObj => renderUserResults(userResultsObj))
}

const states = [
    {symbol: "AL", name: "Alabama"},
    {symbol: "AK", name:  "Alaska"},
    {symbol: "AZ" , name: "Arizona"},
    {symbol: "AR" , name: "Arkansas"},
    {symbol: "CA" , name: "California"},
    {symbol: "CO" , name: "Colorado"},
    {symbol: "CT" , name: "Connecticut"},
    {symbol: "DE" , name: "Delaware"},
    {symbol: "FL" , name: "Florida"},
    {symbol: "GA" , name: "Georgia"},
    {symbol: "HI" , name: "Hawaii"}, 
    {symbol: "ID" , name: "Idaho"},
    {symbol: "IL" , name: "Illinois"},
    {symbol: "IN" , name: "Indiana"},
    {symbol: "IA" , name: "Iowa"},
    {symbol: "KS" , name: "Kansas"},
    {symbol: "KY" , name: "Kentucky"},
    {symbol: "LA" , name: "Louisiana"},
    {symbol: "ME" , name: "Maine"},
    {symbol: "MD" , name: "Maryland"}, 
    {symbol: "MA" , name: "Massachusetts"}, 
    {symbol: "MI" , name: "Michigan"},
    {symbol: "MN" , name: "Minnesota"},
    {symbol: "MS" , name: "Mississippi"},
    {symbol: "MO" , name: "Missouri"},
    {symbol: "MT" , name: "Montana"},
    {symbol: "NE" , name: "Nebraska"},
    {symbol: "NV" , name: "Nevada"},
    {symbol: "NH" , name: "New Hampshire"},
    {symbol: "NJ" , name: "New Jersey"},
    {symbol: "NM" , name: "New Mexico"},
    {symbol: "NY" , name: "New York"},
    {symbol: "NC" , name: "North Carolina"},
    {symbol: "ND" , name: "North Dakota"},
    {symbol: "OH" , name: "Ohio"},
    {symbol: "OK" , name: "Oklahoma"},
    {symbol: "OR" , name: "Oregon"},
    {symbol: "PA" , name: "Pennsylvania"},
    {symbol: "RI" , name: "Rhode Island"}, 
    {symbol: "SC" , name: "South Carolina"},
    {symbol: "SD" , name: "South Dakota"}, 
    {symbol: "TN" , name: "Tennessee"},
    {symbol: "TX" , name: "Texas"},
    {symbol: "UT" , name: "Utah"},
    {symbol: "VT" , name: "Vermont"},
    {symbol: "VA" , name: "Virginia"},
    {symbol: "WA" , name: "Washington"},
    {symbol: "WV" , name: "West Virginia"},
    {symbol: "WI" , name: "Wisconsin"},
    {symbol: "WY" , name: "Wyoming"},
]

selectedArray = []
//JS hit by JQuery event 
function convertStateName(symbol) {
    //global variable 
    selectedState = symbol
    let currentState = states.find(state => state.symbol == symbol.name)
    let state = currentState.name
    handleClick(state)
}

function handleClick(state) {
    if (playing) {console.log(state)
    let div = document.getElementById('state-form-block')
    div.innerHTML = ''
    let form = document.createElement('form')
    let input = document.createElement('input')
    let submit = document.createElement('input')
    form.innerHTML = ''
    input.type = "text"
    input.name = "state"
    input.autocomplete = "off"
    input.placeholder = "Name that state!"
    submit.type = "submit"
    submit.value = "Submit" 
    form.addEventListener('submit', (e) => handleSubmit(e, state))

    div.appendChild(form)
    form.appendChild(input).focus()
    form.appendChild(submit)
    }
}

function handleSubmit(e, state) {
    e.preventDefault()
    let scoreKeeper = document.getElementById('score-keeper')
    let existingState = selectedArray.find(ticker => ticker === state)
    if (!existingState) {
        if (e.target.state.value.toLowerCase() == state.toLowerCase()) {
            selectedArray.push(state)
            score++
            scoreKeeper.innerText = `Current Score: ${score}`
            checkGameOver()
            correctAnswer()
        }
    }
}

function correctAnswer() {
    let d = paths[selectedState.name]
    mark = paper.path(d)
    mark.attr({fill: "#5cdb95"})
    mark.animate({fill: "#379683", stroke: "#05386B"}, 2500)
}


function login() {  
    if (!userLoggedIn) {
        let loginDiv = document.getElementById('login')   
        let loginForm = document.createElement('form')        
        
        loginForm.id = "login-form"
        input = document.createElement('input')
        input.type = "text"
        input.name = "username"
        input.placeholder = "Enter your name to play!"
        input.autocomplete = "off"
        submit = document.createElement('input')
        submit.type = "submit"
        submit.value = "Submit" 

        loginForm.addEventListener('submit', (e) => handleLoginSubmit(e, input.value))
        
        loginForm.appendChild(input)
        loginForm.appendChild(submit)
        loginDiv.appendChild(loginForm)
    }
}

function newGame() {
    paper = Raphael("map2")
    if (userLoggedIn && !playing) { 
        let div = document.getElementById('state-form-block')
        div.innerHTML = ''
        let newGameDiv = document.getElementById("new-game")
        let newGameBtn = document.createElement('button')
        newGameBtn.innerText = 'Start New Game'
        newGameBtn.classList.add('pushy__btn', 'pushy__btn--sm', 'pushy__btn--green')
        newGameBtn.addEventListener('click', handleNewGameClick)
        
        newGameDiv.appendChild(newGameBtn)
    } 
}


function handleNewGameClick() {
    let timer = document.getElementById('timer')
    timer.innerText = '00:00'
    
    let newGameDiv = document.getElementById("new-game")
    newGameDiv.innerHTML = ''
    newGameDiv.innerText = 'Choose Difficulty Level!'
    let easyBtn = document.createElement('button')
    let medBtn = document.createElement('button')
    let hardBtn = document.createElement('button')

    easyBtn.innerText = 'Easy'
    medBtn.innerText = 'Medium'
    hardBtn.innerText = 'Hard'

    easyBtn.classList.add('pushy__btn', 'pushy__btn--sm', 'pushy__btn--green') 
    medBtn.classList.add('pushy__btn', 'pushy__btn--sm', 'pushy__btn--green')
    hardBtn.classList.add('pushy__btn', 'pushy__btn--sm', 'pushy__btn--green')

    easyBtn.id = "easy-button"
    medBtn.id = "med-button"
    hardBtn.id = "hard-button"

    easyBtn.addEventListener('click', () => postGame('Easy'))
    medBtn.addEventListener('click', () => postGame('Medium'))
    hardBtn.addEventListener('click', () => postGame('Hard'))

    newGameDiv.append(easyBtn, medBtn, hardBtn)
}


function startNewGame(statesGame) {
    let timeLimit = 0
    let newGameDiv = document.getElementById('new-game')
    newGameDiv.innerHTML = ''
    let timer = document.getElementById('timer')
    let startBtn = document.createElement('button')
    startBtn.innerText = 'Start!'
    startBtn.id = "start-btn"
    startBtn.classList.add('pushy__btn', 'pushy__btn--sm', 'pushy__btn--green')
    newGameDiv.append(startBtn)

    if (statesGame.difficulty === "Easy") {
        //5 min for easy game
        timeLimit = 60 * 5 
    } else if (statesGame.difficulty === "Medium") {
        //3:30 min for med game
        timeLimit = 60 * 3.5
    } else {
        // 2 min for hard game
        timeLimit = 60 * 2
    }

    minutes = parseInt(timeLimit / 60, 10);
    seconds = parseInt(timeLimit % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes
    seconds = seconds < 10 ? "0" + seconds : seconds

    timer.innerText = minutes + ":" + seconds

    startBtn.addEventListener('click', () => startTimer(timeLimit))
}

function startTimer(duration) {
    playing = true
    
    display = document.getElementById('timer')
    let newGameDiv = document.getElementById('new-game')
    newGameDiv.innerHTML = '' 
    let timer = duration, minutes, seconds;
    countdown = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes
        seconds = seconds < 10 ? "0" + seconds : seconds

        display.textContent = minutes + ":" + seconds

        if (--timer < 0) {
            clearInterval(countdown)
            endGame()
        }
    }, 1000);
}

function checkGameOver() {
    //a call to this function is included in state handleSubmit
    //currently line 134
    let newMap = document.getElementById('map2')
    let svgMap = newMap.querySelector('svg')
    if (score === 50) {
        endGame()
        selectedArray = []
        svgMap.remove()
    }
}

function endGame(){
    clearInterval(countdown)

    let div = document.getElementById('state-form-block')
    div.innerHTML = ''
    if (score === 50) {
        alert(`Perfect score! ${score} points!!`)
    } else {
    alert(`Final Score: ${score}`)
    }

    let gameFinalScore = {
        total: score,
        user_id: currentUser.id,
        states_game_id: currentGame.id
    }
    //add toggle for form no longer being avail when game ends
    //also determine where playing should be set to false
    //and current user + game set to undefined
    selectedArray = []
    let newMap = document.getElementById('map2')
    let svgMap = newMap.querySelector('svg')
    svgMap.remove()
    postScore(gameFinalScore)
    
}

function renderUserResults(userResultsObj) {
    //grab tables and clear contents
    let resultsTable = document.getElementById('results-table')
    resultsTable.innerHTML = ''

    let gameStatsTable = document.getElementById('totals-table')
    gameStatsTable.innerHTML = ''


    if ((Object.keys(userResultsObj)).length > 0){
        let userResultsDiv = document.getElementsByClassName('sidenav')
        userResultsDiv.innerHTML = ''

        //grab results table
        let resultsTable = document.getElementById('results-table')

        //show h3 titles
        document.getElementById('games-table-title').hidden = false
        document.getElementById('games-stats-title').hidden = false

        //create Elements for game display table
        let headerRow = document.createElement('tr')
        let headerColDiff = document.createElement('th')
        let headerColScore = document.createElement('th')
        
        //set display table headings
        headerColDiff.innerText = "Difficulty"
        headerColDiff.style.textAlign = "left"
        headerColScore.innerText = "Score"
        headerColScore.style.textAlign = "center"

        //append header cols to header row
        headerRow.append(headerColDiff, headerColScore)
        //append header row to results table
        resultsTable.appendChild(headerRow)
        
        //Slice determining how many results displayed
        let showSlice = userResultsObj.slice(0,5)
        //function rendering each game row
        renderEachGame(showSlice, resultsTable)
        
        renderUserStats(userResultsObj)

    function renderEachGame(showSlice, resultsTable){
        showSlice.forEach(object => {
            for (key in object) {
                let row = document.createElement('tr')
                let tdDiff = document.createElement('td')
                let tdScore = document.createElement('td')
                tdDiff.innerText = key
                tdScore.innerText = object[key].total
                tdScore.style.textAlign = "center"
                row.append(tdDiff, tdScore)
                resultsTable.appendChild(row)
                }
            })
        }
    }
}


function userAggScore(userResultsObj) {
    aggScore = 0
    userResultsObj.forEach(object =>
        Object.values(object).forEach(obj => {
            aggScore += obj.total
        })
    )
    return aggScore
}

function renderUserStats(userResultsObj) {
    let gameStatsTable = document.getElementById('totals-table')
    //get aggregate score, average score, and games played
    let aggScore = userAggScore(userResultsObj)
    let avgScore = Math.round(((aggScore / (Object.keys(userResultsObj)).length) * 10)) / 10
    let gamesPlayed = (Object.keys(userResultsObj)).length
 
//create table elements
    //rows
    let aggRow = document.createElement('tr')
    let avgRow = document.createElement('tr')
    let totGameRow = document.createElement('tr')
    
    //label cells
    let aggLabel = document.createElement('th')
    let avgLabel = document.createElement('th')
    let totGameLabel = document.createElement('th')

    //align label cells
    aggLabel.style.textAlign = "left"
    avgLabel.style.textAlign = "left"
    totGameLabel.style.textAlign = "left"


    //amount cells
    let aggAmt = document.createElement('td')
    let avgAmt = document.createElement('td')
    let totGameAmt = document.createElement('td')

    //left align amount cells 
    aggAmt.style.textAlign = "right"
    avgAmt.style.textAlign = "right"
    totGameAmt.style.textAlign = "right"

    //set label text
    aggLabel.innerText = 'Total Score:'
    avgLabel.innerText = 'Avg. Score:'
    totGameLabel.innerText = 'Games Played:'  
    
    //style label text strong
    aggLabel.style.fontWeight = "900"
    avgLabel.style.fontWeight = "900"
    totGameLabel.style.fontWeight = "900"
    

    //set amount text
    aggAmt.innerText = aggScore 
    avgAmt.innerText = avgScore
    totGameAmt.innerText = gamesPlayed

    //append cells, rows, table
    aggRow.append(aggLabel, aggAmt)
    avgRow.append(avgLabel, avgAmt)
    totGameRow.append(totGameLabel, totGameAmt)

    gameStatsTable.append(aggRow, avgRow, totGameRow)

}





// Go Mariners 
//lol