// CharSelectScene is bypassed — character is fixed to default.
// This stub exists so scene key references don't break; it immediately redirects.
var CharSelectScene = class extends Phaser.Scene {
    constructor() {
        super({ key: CONSTANTS.SCENES.CHAR_SELECT });
    }

    create() {
        this.scene.start(CONSTANTS.SCENES.LEVEL_SELECT);
    }
};
