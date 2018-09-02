/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

/*
 * ------- MODEL -------
 */
var DiceModel = (function () {
    //Enum for Player
    var Player = {
        "Player 1": 0,
        "Player 2": 1
    };
    Object.freeze(Player);

    var data = {
        currentScore: [0, 0],
        totalScore: [0, 0],
        currentPlayer: Player["Player 1"],
        gamePlaying: true
    };

    return {
        randomizeDice: function () {
            var dice = Math.floor(Math.random() * 6) + 1;
            return dice;
        },

        //Add roll dice to current score
        addScoreToCurrent: function (dice) {
            data.currentScore[data.currentPlayer] += dice;
            return data.currentScore[data.currentPlayer];
        },

        //Add current Score to Total score, then reset current score
        addCurrentScoreToTotal: function () {
            data.totalScore[data.currentPlayer] += data.currentScore[data.currentPlayer];
            this.clearCurrentScoreData();
            return data.totalScore[data.currentPlayer];
        },

        //Check current player and then switch to other player
        nextPlayer: function () {
            if (data.currentPlayer === Player["Player 1"])
                data.currentPlayer = Player["Player 2"];
            else
                data.currentPlayer = Player["Player 1"];
        },

        //Check if the score is 100
        isPlayerWinGame: function () {
            if (data.totalScore[data.currentPlayer] >= 10) {
                data.gamePlaying = false;
                return true;
            } else
                return false;
        },

        isGamePlaying: function () {
            return data.gamePlaying;
        },

        activateTheGame: function () {
            data.gamePlaying = true;
        },

        disableTheGame: function () {
            data.gamePlaying = false;
        },

        currentPlayer: function () {
            return data.currentPlayer;
        },

        clearCurrentScoreData: function () {
            data.currentScore[Player["Player 1"]] = 0;
            data.currentScore[Player["Player 2"]] = 0;
        },

        clearAllData: function () {
            this.clearCurrentScoreData();
            data.currentPlayer = Player["Player 1"];
            data.totalScore[Player["Player 1"]] = 0;
            data.totalScore[Player["Player 2"]] = 0;
        }
    };

})();

/*
 * -------VIEW-------
 */
var DiceView = (function () {

    var DOMstrings = {
        //Class
        newBtn: '.btn-new',
        rollBtn: '.btn-roll',
        holdBtn: '.btn-hold',
        dice: '.dice',
        //ID
        player: 'name-',
        score: 'score-',
        current: 'current-',

        player1: '#name-0',
        score1: '#score-0',
        current1: '#current-0',
        player2: '#name-1',
        score2: '#score-1',
        current2: '#current-1',
        //Properties
        active: 'active',
        winner: 'winner',
        //Panel
        player1Panel: '.player-0-panel',
        player2Panel: '.player-1-panel'
    };

    return {
        getDOMstrings: function () {
            return DOMstrings;
        },

        //Update dice UI
        displayDice: function (dice) {
            var diceDOM = document.querySelector(DOMstrings.dice);
            diceDOM.style.display = 'block';
            diceDOM.src = './img/dice-' + dice + '.png';
        },

        //Update the current score UI to the right player
        displayCurrentScore: function (currentScore, playerIndex) {
            document.getElementById(DOMstrings.current + playerIndex).textContent = currentScore;
        },

        displayClearCurrentScore: function (playerIndex) {
            document.getElementById(DOMstrings.current + playerIndex).textContent = 0;
        },

        //Update the Total score UI to the right player, then clear the current score UI
        displayTotalScore: function (totalScore, playerIndex) {
            document.getElementById(DOMstrings.score + playerIndex).textContent = totalScore;
            document.getElementById(DOMstrings.current + playerIndex).textContent = 0;
        },

        displayNextActivePlayer: function (activePlayer) {
            document.querySelector(DOMstrings.player1Panel).classList.remove(DOMstrings.active);
            document.querySelector(DOMstrings.player2Panel).classList.remove(DOMstrings.active);

            document.querySelector('.player-' + activePlayer + '-panel').classList.add(DOMstrings.active);
        },

        displayWinner: function (activePlayer) {
            document.querySelector('.player-' + activePlayer + '-panel').classList.add(DOMstrings.winner);
            document.getElementById(DOMstrings.player + activePlayer).textContent = "Winner";
        },

        //Clear all visiable UI
        clearAllUI: function () {
            var listOfUI, fields, fieldsArr;

            listOfUI = DOMstrings.current1 + ", " + DOMstrings.current2 + ", " + DOMstrings.score1 + ", " + DOMstrings.score2;

            fields = document.querySelectorAll(listOfUI);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach((current) => {
                current.textContent = 0;
            });

            document.querySelector(DOMstrings.player1).textContent = "Player 1";
            document.querySelector(DOMstrings.player2).textContent = "Player 2";
            document.querySelector(DOMstrings.dice).style.display = "none";

            document.querySelector(DOMstrings.player1Panel).classList.remove(DOMstrings.winner);
            document.querySelector(DOMstrings.player2Panel).classList.remove(DOMstrings.winner);
            document.querySelector(DOMstrings.player1Panel).classList.remove(DOMstrings.active);
            document.querySelector(DOMstrings.player2Panel).classList.remove(DOMstrings.active);
            document.querySelector(DOMstrings.player1Panel).classList.add(DOMstrings.active);
        },

    };

})();

/*
 * -------CONTROLLER-------
 */
var DiceController = (function (Model, View) {

    var setupEventListeners = function () {
        var DOM = View.getDOMstrings();

        document.querySelector(DOM.newBtn).addEventListener('click', startNewGame);

        document.querySelector(DOM.rollBtn).addEventListener('click', ctrlRollDice);

        document.querySelector(DOM.holdBtn).addEventListener('click', ctrlHoldBtn);
    };

    var updateDice = function () {
        //1. Randomize the dice
        dice = Model.randomizeDice();
        //2. Update the UI to display the dice
        View.displayDice(dice);
        return dice;
    };

    var updateCurrentScore = function (dice) {
        //Add dice number to current score
        currentScore = Model.addScoreToCurrent(dice);
        //Update the UI current
        View.displayCurrentScore(currentScore, Model.currentPlayer());
    };

    var clearCurrentScore = function () {
        Model.clearCurrentScoreData();
        View.displayClearCurrentScore(Model.currentPlayer());
    };

    var updateTotalScore = function () {
        var totalScore;
        //1. Add the current score to Total Score
        totalScore = Model.addCurrentScoreToTotal();
        //2. Update the total Score UI
        View.displayTotalScore(totalScore, Model.currentPlayer());
    };

    var updateNextPlayer = function () {
        //Switch to next player
        Model.nextPlayer();
        //Active the player UI
        View.displayNextActivePlayer(Model.currentPlayer());
    };

    var ctrlRollDice = function () {
        var dice, currentScore;

        if (Model.isGamePlaying()) {
            //1. Update the dice
            dice = updateDice();

            //2. If dice is not 1, add to currentScore and update
            if (dice !== 1) {
                updateCurrentScore(dice);
            } else { //clear currentScore and switch to next player
                //Disable the Roll and Hold button for 1 second to let player see the dice number 1
                Model.disableTheGame();
                setTimeout(function () {
                    Model.activateTheGame();
                    clearCurrentScore();
                    ctrlHoldBtn();
                }, 1000);
            }
        }
    };

    var ctrlHoldBtn = function () {
        if (Model.isGamePlaying()) {
            //1. Update Total Score
            updateTotalScore();
            //3. Hide the dice
            document.querySelector(View.getDOMstrings().dice).style.display = "none";
            //4. if Player not yet wins the game, switch to next player and active the next UI
            if (Model.isPlayerWinGame()) { //Set current player to be a winner, freeze the game
                View.displayWinner(Model.currentPlayer());
            } else { //switch to next player
                updateNextPlayer();
            }
        }
    };

    var startNewGame = function () {
        //Reset all UI to beginning
        View.clearAllUI();
        //Reset all Data
        Model.clearAllData();

        Model.activateTheGame();
    };

    return {
        init: function () {
            console.log("Game has started. Happy play");
            startNewGame();
            //Start Event Listener
            setupEventListeners();
        }
    };
})(DiceModel, DiceView);

DiceController.init();
