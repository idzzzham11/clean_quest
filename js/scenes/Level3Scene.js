var Level3Scene = class extends Phaser.Scene {
    constructor() { super({ key: CONSTANTS.SCENES.LEVEL3 }); }
    create() {
        this._levelNum = 3; this._levelKey = 'level3'; this._bgmKey = 'kitchen';
        this._quizLevelKey = 'level3'; this._bossType = CONSTANTS.BOSSES.HAIR_CREATURE;
        this._bgFarKey = 'bg_kitchen_far'; this._bgMidKey = 'bg_kitchen_mid'; this._bgNearKey = 'bg_kitchen_near';
        LevelSceneCore.init(this);
    }
    update(time, delta) { LevelSceneCore.update(this, time, delta); }
    shutdown()          { LevelSceneCore.shutdown(this); }
};
