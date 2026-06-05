// CleanQuest: Workplace Hero — Entry Point
window.addEventListener('load', function () {
    GameState.init();
    MissionManager.init();

    var config = {
        type: Phaser.AUTO,
        width: CONSTANTS.WIDTH,
        height: CONSTANTS.HEIGHT,
        parent: 'game-container',
        backgroundColor: '#1a1a2e',
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            expandParent: false
        },
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: CONSTANTS.GRAVITY },
                debug: false
            }
        },
        scene: [
            BootScene,
            TitleScene,
            CharSelectScene,
            LevelSelectScene,
            HUDScene,
            Level1Scene,
            Level2Scene,
            Level3Scene,
            Level4Scene,
            BossScene,
            QuizScene,
            ResultsScene,
            LeaderboardScene,
            CreditsScene
        ]
    };

    var game = new Phaser.Game(config);

    // Expose for debugging
    window._game = game;
});
