var Level5Scene = class extends Phaser.Scene {
    constructor() { super({ key: CONSTANTS.SCENES.LEVEL5 }); }
    create() {
        this._levelNum = 5; this._levelKey = 'level5'; this._bgmKey = 'hotel';
        this._quizLevelKey = 'level5'; this._bossType = CONSTANTS.BOSSES.FINAL_BOSS;
        this._bgFarKey = 'bg_hotel_far'; this._bgMidKey = 'bg_hotel_mid'; this._bgNearKey = 'bg_hotel_near';
        this._doorsRequired = 2;
        LevelSceneCore.init(this);
    }
    update(time, delta) { LevelSceneCore.update(this, time, delta); }
    shutdown()          { LevelSceneCore.shutdown(this); }
};
