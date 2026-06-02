var Level4Scene = class extends Phaser.Scene {
    constructor() { super({ key: CONSTANTS.SCENES.LEVEL4 }); }
    create() {
        this._levelNum = 4; this._levelKey = 'level4'; this._bgmKey = 'cs';
        this._quizLevelKey = 'level4'; this._bossType = CONSTANTS.BOSSES.DIRTY_ROBOT;
        this._bgFarKey = 'bg_cs_far'; this._bgMidKey = 'bg_cs_mid'; this._bgNearKey = 'bg_cs_near';
        LevelSceneCore.init(this);
    }
    update(time, delta) { LevelSceneCore.update(this, time, delta); }
    shutdown()          { LevelSceneCore.shutdown(this); }
};
