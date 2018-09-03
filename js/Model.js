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
        gamePlaying: true,
        finalScore: 100
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

        //Check if the score is a final score
        isPlayerWinGame: function () {
            if (data.totalScore[data.currentPlayer] >= data.finalScore) {
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
        },

        setNewFinalScore: function (newFinalScore) {
            data.finalScore = newFinalScore;
        },
    };

})();