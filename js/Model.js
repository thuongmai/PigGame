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

    var GameMode = {
        "Normal": 0,
        "TwoDicePig": 1,
        "BigPig": 2,
        "Skunk": 3,
    };
    Object.freeze(GameMode);

    var data = {
        currentScore: [0, 0],
        totalScore: [0, 0],
        currentPlayer: Player["Player 1"],
        gamePlaying: true,
        finalScore: 100,
        gameMode: GameMode.Normal,
        displayHoldBtn: true,
    };

    return {
        randomizeDice: function () {
            var dice = Math.floor(Math.random() * 6) + 1;
            return dice;
        },

        randomizeDices: function () {
            var dice_1, dice_2;
            dice_1 = this.randomizeDice();
            dice_2 = this.randomizeDice();
            return [dice_1, dice_2];
        },

        //Add roll dice (or dices) to current score
        addScoreToCurrent: function (dice) {
            if (dice instanceof Array) //if dice is an array, it contains two dices
                data.currentScore[data.currentPlayer] += dice[0] + dice[1];
            else
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

        getCurrentGameMode: function () {
            return data.gameMode;
        },

        isGameMode: function () {
            return GameMode;
        },

        setNewGameMode: function (newGameMode) {
            data.gameMode = newGameMode;
        },

        clearCurrentScoreData: function () {
            data.currentScore[Player["Player 1"]] = 0;
            data.currentScore[Player["Player 2"]] = 0;
        },

        clearTotalScoreOfCurrentPlayer: function () {
            data.totalScore[data.currentPlayer] = 0;
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

        setDisplayHoldBtnStatus: function (newStatus) {
            data.displayHoldBtn = newStatus;
        },

        getDisplayHoldBtnStatus: function () {
            return data.displayHoldBtn;
        },
    };

})();
