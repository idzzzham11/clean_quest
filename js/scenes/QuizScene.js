// QuizScene is a lightweight stub — actual quiz logic is in QuizManager + QuizOverlay
// This scene is NOT used in normal gameplay (QuizManager operates on the level scene directly)
// It exists for standalone quiz access from the menu if needed
var QuizScene = class extends Phaser.Scene {
    constructor() {
        super({ key: CONSTANTS.SCENES.QUIZ });
    }

    init(data) {
        this._fromScene = data.fromScene;
        this._levelKey = data.levelKey;
    }

    create() {
        // This scene is a pass-through — just resume the calling scene
        this.scene.resume(this._fromScene);
        this.scene.stop(CONSTANTS.SCENES.QUIZ);
    }
};
