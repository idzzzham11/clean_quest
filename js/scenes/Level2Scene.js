var Level2Scene = class extends Phaser.Scene {
    constructor() { super({ key: CONSTANTS.SCENES.LEVEL2 }); }
    create() {
        this._levelNum = 2; this._levelKey = 'level2'; this._bgmKey = 'salon';
        this._quizLevelKey = 'level2'; this._bossType = CONSTANTS.BOSSES.SMELLY_FOG;
        this._bgFarKey = 'bg_salon_far'; this._bgMidKey = 'bg_salon_mid'; this._bgNearKey = 'bg_salon_near';
        this._doorsRequired = 1;
        LevelSceneCore.init(this);
    }
    update(time, delta) { LevelSceneCore.update(this, time, delta); }
    shutdown()          { LevelSceneCore.shutdown(this); }
};
