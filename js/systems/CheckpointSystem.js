// Manages checkpoint placement and respawn
var CheckpointSystem = {
    _checkpoints: [],

    init: function () {
        this._checkpoints = [];
    },

    register: function (x, y, id) {
        this._checkpoints.push({ x: x, y: y, id: id, reached: false });
    },

    reach: function (x, y) {
        GameState.setCheckpoint(x, y);
        AudioManager && AudioManager.playCheckpoint && AudioManager.playCheckpoint();
    },

    getLastCheckpoint: function () {
        if (!GameState.get('hasCheckpoint')) return null;
        return { x: GameState.get('checkpointX'), y: GameState.get('checkpointY') };
    }
};
