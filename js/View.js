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
        final_score: '.final-score',
        final_score_label: '.final-score-label',
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
