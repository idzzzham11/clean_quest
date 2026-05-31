// Singleton game state — shared across all scenes
var GameState = (function () {
    var _emitter = null;

    var _state = {
        score: 0,
        coins: 0,
        hygieneStars: 0,
        lives: 3,
        health: 3,
        currentLevel: 1,
        checkpointX: 0,
        checkpointY: 0,
        hasCheckpoint: false,

        // Session tracking for missions
        germsStopped: 0,
        quizCorrectStreak: 0,
        hazardsTouched: 0,
        uniformsCollected: 0,
        soapCollected: 0,
        nailClipperCount: 0,
        hairnetCollected: false,
        combCollected: false,
        smellCloudsDefeated: 0,
        levelHealthAtStart: 3,

        // Collected items this level
        itemsCollected: [],

        // Mission progress (persisted separately in SaveManager)
        missions: {}
    };

    return {
        init: function (scene) {
            _emitter = new Phaser.Events.EventEmitter();
        },

        reset: function () {
            _state.score = 0;
            _state.coins = 0;
            _state.hygieneStars = 0;
            _state.lives = 3;
            _state.health = 3;
            _state.germsStopped = 0;
            _state.quizCorrectStreak = 0;
            _state.hazardsTouched = 0;
            _state.uniformsCollected = 0;
            _state.soapCollected = 0;
            _state.nailClipperCount = 0;
            _state.hairnetCollected = false;
            _state.combCollected = false;
            _state.smellCloudsDefeated = 0;
            _state.itemsCollected = [];
            _state.hasCheckpoint = false;
        },

        resetLevel: function () {
            _state.health = CONSTANTS.PLAYER_MAX_HEALTH;
            _state.germsStopped = 0;
            _state.quizCorrectStreak = 0;
            _state.hazardsTouched = 0;
            _state.uniformsCollected = 0;
            _state.soapCollected = 0;
            _state.nailClipperCount = 0;
            _state.hairnetCollected = false;
            _state.combCollected = false;
            _state.smellCloudsDefeated = 0;
            _state.itemsCollected = [];
            _state.hasCheckpoint = false;
            _state.levelHealthAtStart = CONSTANTS.PLAYER_MAX_HEALTH;
        },

        // Getters
        get: function (key) { return _state[key]; },
        getScore: function () { return _state.score; },
        getCoins: function () { return _state.coins; },
        getHealth: function () { return _state.health; },
        getLives: function () { return _state.lives; },
        getHygieneStars: function () { return _state.hygieneStars; },

        // Score
        addScore: function (amount) {
            _state.score += amount;
            _emitter && _emitter.emit('scoreChanged', _state.score);
        },

        addCoins: function (amount) {
            _state.coins += amount;
            _state.score += amount * CONSTANTS.COIN_VALUE;
            _emitter && _emitter.emit('coinsChanged', _state.coins);
            _emitter && _emitter.emit('scoreChanged', _state.score);
        },

        addHygieneStar: function () {
            _state.hygieneStars++;
            _state.score += CONSTANTS.STAR_VALUE;
            _emitter && _emitter.emit('starsChanged', _state.hygieneStars);
            _emitter && _emitter.emit('scoreChanged', _state.score);
        },

        // Health
        takeDamage: function (amount) {
            _state.health = Math.max(0, _state.health - (amount || 1));
            _state.hazardsTouched++;
            _emitter && _emitter.emit('healthChanged', _state.health);
        },

        heal: function (amount) {
            _state.health = Math.min(CONSTANTS.PLAYER_MAX_HEALTH, _state.health + (amount || 1));
            _emitter && _emitter.emit('healthChanged', _state.health);
        },

        loseLife: function () {
            _state.lives = Math.max(0, _state.lives - 1);
            _emitter && _emitter.emit('livesChanged', _state.lives);
            if (_state.lives <= 0) {
                _emitter && _emitter.emit('gameOver');
            }
        },

        // Collectibles
        collectItem: function (itemType) {
            _state.itemsCollected.push(itemType);
            if (itemType === CONSTANTS.ITEMS.UNIFORM) {
                _state.uniformsCollected++;
                _emitter && _emitter.emit('missionProgress', { type: 'uniform', count: _state.uniformsCollected });
            }
            if (itemType === CONSTANTS.ITEMS.SOAP) {
                _state.soapCollected++;
                _emitter && _emitter.emit('missionProgress', { type: 'soap', count: _state.soapCollected });
            }
            if (itemType === CONSTANTS.ITEMS.NAIL_CLIPPER) {
                _state.nailClipperCount++;
                _emitter && _emitter.emit('missionProgress', { type: 'nail_clipper', count: _state.nailClipperCount });
            }
            if (itemType === CONSTANTS.ITEMS.HAIRNET) {
                _state.hairnetCollected = true;
                _emitter && _emitter.emit('missionProgress', { type: 'hairnet' });
            }
            if (itemType === CONSTANTS.ITEMS.COMB) {
                _state.combCollected = true;
                _emitter && _emitter.emit('missionProgress', { type: 'comb' });
            }
        },

        // Enemy defeats
        enemyDefeated: function (enemyType) {
            if (enemyType === CONSTANTS.ENEMIES.GERM || enemyType === 'germ_monster') {
                _state.germsStopped++;
                _emitter && _emitter.emit('missionProgress', { type: 'germ_stomp', count: _state.germsStopped });
            }
            if (enemyType === CONSTANTS.ENEMIES.SMELL_CLOUD) {
                _state.smellCloudsDefeated++;
                _emitter && _emitter.emit('missionProgress', { type: 'smell_cloud', count: _state.smellCloudsDefeated });
            }
        },

        // Quiz
        quizCorrect: function () {
            _state.quizCorrectStreak++;
            _state.score += CONSTANTS.QUIZ_CORRECT_BONUS;
            _emitter && _emitter.emit('quizCorrect', _state.quizCorrectStreak);
            _emitter && _emitter.emit('scoreChanged', _state.score);
        },

        quizWrong: function () {
            _state.quizCorrectStreak = 0;
            _emitter && _emitter.emit('quizWrong');
        },

        // Checkpoint
        setCheckpoint: function (x, y) {
            _state.checkpointX = x;
            _state.checkpointY = y;
            _state.hasCheckpoint = true;
            _emitter && _emitter.emit('checkpointReached', { x, y });
        },

        // Events
        on: function (event, callback, context) {
            _emitter && _emitter.on(event, callback, context);
        },

        off: function (event, callback, context) {
            _emitter && _emitter.off(event, callback, context);
        },

        emit: function (event, data) {
            _emitter && _emitter.emit(event, data);
        }
    };
})();
