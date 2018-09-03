/*
 * -------CONTROLLER-------
 */
var DiceController = (function (Model, View) {

    var setupEventListeners = function () {
        var DOM = View.getDOMstrings();

        //New Game button = Enter keyboard
        document.querySelector(DOM.newBtn).addEventListener('click', startNewGame);
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                startNewGame();
            }
        });

        //Roll Dice button = UP keyboard
        document.querySelector(DOM.rollBtn).addEventListener('click', ctrlRollDice);
        document.addEventListener('keydown', function (event) {
            if (event.keyCode === 38 || event.which === 38) {
                ctrlRollDice();
            }
        });

        //Hold Button = DOWN button
        document.querySelector(DOM.holdBtn).addEventListener('click', ctrlHoldBtn);
        document.addEventListener('keydown', function (event) {
            if (event.keyCode === 40 || event.which === 40) {
                ctrlHoldBtn();
            }
        });

        //SPACE button to focus on Final Score input
        document.addEventListener('keyup', function (event) {
            if (event.keyCode === 32 || event.which === 32) {
                //1. Focus on the final Score input
                View.getFinalScoreInput().focus();
                //2. Disable the game until Start button has pressed with the new input score
                Model.disableTheGame(); 
                //3. Hide the dice
                View.hideTheDice();
            }
        });

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
            View.hideTheDice();
            //4. if Player not yet wins the game, switch to next player and active the next UI
            if (Model.isPlayerWinGame()) { //Set current player to be a winner, freeze the game
                View.displayWinner(Model.currentPlayer());
            } else { //switch to next player
                updateNextPlayer();
            }
        }
    };

    var updateNewFinalScore = function (newFinalScore) {
        Model.setNewFinalScore(newFinalScore);
        View.displayFinalScore(newFinalScore);
    };

    var checkForNewFinalScore = function () {
        var newFinalScore, event;
        newFinalScore = View.getFinalScore();
        if (newFinalScore.length !== 0 && newFinalScore !== null && newFinalScore !== " ")
            updateNewFinalScore(newFinalScore);
        else {
            updateNewFinalScore(100); //100 by default
        }
        
        //Remove focus
        View.getFinalScoreInput().blur();
    };

    var startNewGame = function () {
        //Reset all UI to beginning
        View.clearAllUI();
        //Reset all Data
        Model.clearAllData();
        //Get new final score if there is
        checkForNewFinalScore();
        //Changing the boolean of gamePlaying to true to activate all buttons
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
