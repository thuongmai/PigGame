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
        dice_1: '.dice-1',
        dice_2: '.dice-2',
        final_score: '.final-score',
        final_score_label: '.final-score-label',
        settingBtn: '.btn-setting',
        infoBtn: '.btn-info',
        confirm_dialog_button: '.confirm_dialog_button',
        select_dialog: '.select_dialog',
        //ID
        player: 'name-',
        score: 'score-',
        current: 'current-',
        settingDialog: 'settingDialog',

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

        //Update two dice UI
        displayDices: function (dices) {
            var diceDOM_1, diceDOM_2;
            diceDOM_1 = document.querySelector(DOMstrings.dice_1);
            diceDOM_1.style.display = 'block';
            diceDOM_1.src = './img/dice-' + dices[0] + '.png';

            diceDOM_2 = document.querySelector(DOMstrings.dice_2);
            diceDOM_2.style.display = 'block';
            diceDOM_2.src = './img/dice-' + dices[1] + '.png';
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

        displayClearTotalScore: function (playerIndex) {
            document.getElementById(DOMstrings.score + playerIndex).textContent = 0;
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

        getFinalScore: function () {
            return document.querySelector(DOMstrings.final_score).value;
        },

        getFinalScoreInput: function () {
            return document.querySelector(DOMstrings.final_score);
        },

        displayFinalScore: function (newFinalScore) {
            document.querySelector(DOMstrings.final_score_label).textContent = newFinalScore;
        },

        hideTheDice: function () {
            document.querySelector(DOMstrings.dice).style.display = "none";
            document.querySelector(DOMstrings.dice_1).style.display = "none";
            document.querySelector(DOMstrings.dice_2).style.display = "none";
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
            this.hideTheDice();

            document.querySelector(DOMstrings.player1Panel).classList.remove(DOMstrings.winner);
            document.querySelector(DOMstrings.player2Panel).classList.remove(DOMstrings.winner);
            document.querySelector(DOMstrings.player1Panel).classList.remove(DOMstrings.active);
            document.querySelector(DOMstrings.player2Panel).classList.remove(DOMstrings.active);
            document.querySelector(DOMstrings.player1Panel).classList.add(DOMstrings.active);
        },

    };

})();
