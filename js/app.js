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

        //Setting button
        document.querySelector(DOM.settingBtn).addEventListener('click', function () {
            document.getElementById(DOM.settingDialog).showModal();
        });

        //Confirm Dialog button
        document.querySelector(DOM.confirm_dialog_button).addEventListener('click', function () {
            //Get into the children of the dialog form to get selection tag => naive way
            //var a = document.getElementById(DOM.settingDialog);
            //a = a.children[0].children[0].children[0].children[0];
            //var userOption = a.options[a.selectedIndex].value;
            //console.log(userOption);

            //Get the selection dialog
            var selectionForm = document.querySelector(DOM.select_dialog);
            //Get the selected options, starts from 0
            var userOption = selectionForm.options[selectionForm.selectedIndex].value;
            //Close the dialog
            //document.getElementById(DOM.settingDialog).close();
            //Return the options to change the game
            Model.setNewGameMode(userOption);
            //Then start a complete new game
            startNewGame();
        });

    };

    var updateDice = function () {
        var dice;
        //1. Randomize the dice
        dice = Model.randomizeDice();
        //2. Update the UI to display the dice
        View.displayDice(dice);
        return dice;
    };

    var updateDices = function () {
        var dices;
        //1. Randomize the dices  
        dices = Model.randomizeDices();
        //2. Update the UI to display the dices
        View.displayDices(dices);
        return dices;
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

    var clearTotalScore = function () {
        Model.clearTotalScoreOfCurrentPlayer();
        View.displayClearTotalScore(Model.currentPlayer());
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
        var dice, dices, currentScore;
        console.log("Before checking game play");
        if (Model.isGamePlaying()) {
            console.log("The game is playing");
            if (Model.getCurrentGameMode() == Model.isGameMode().Normal) {
                console.log("The Mode game is Normal");
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
            } else if (Model.getCurrentGameMode() == Model.isGameMode().TwoDicePig) {
                console.log('The Mode game is Two-dice Pig');
                //1. Update the dice
                dices = updateDices();
                //2. if a single 1 is rolled, the player scores nothing and turns end
                if (dices[0] === 1 || dices[1] === 1) {
                    //Disable the Roll and Hold button for 1 second to let player see the dice number 1
                    Model.disableTheGame();
                    setTimeout(function () {
                        clearCurrentScore();
                        Model.activateTheGame();
                        ctrlHoldBtn();
                    }, 1000);
                }
                //3. if two 1s are rolled, the player's entire score is lost, and turn ends
                else if (dices[0] === 1 && dices[1] === 1) {
                    Model.disableTheGame();
                    setTimeout(function () {
                        clearCurrentScore();
                        clearTotalScore();
                        Model.activateTheGame();
                        ctrlHoldBtn();
                    }, 1000);
                }
                //4. If two dices are the same, score is added to total, the player has to roll again (can't hold)
                else if (dices[0] === dices[1]) {
                    //Disable the HOLD (DOWN) button
                }
                //2. Update currentScore
                updateCurrentScore(dices);
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
        else
            updateNewFinalScore(100); //100 by default

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
