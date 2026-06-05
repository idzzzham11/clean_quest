// CleanQuest: Workplace Hero — Entry Point

// Resize the game container to fill the full screen (controls float on top)
function resizeGameContainer() {
    var container = document.getElementById('game-container');
    if (!container) return;
    container.style.width  = window.innerWidth + 'px';
    container.style.height = window.innerHeight + 'px';

    if (window._game && window._game.scale) {
        window._game.scale.refresh();
    }
}

window.addEventListener('resize', resizeGameContainer);
window.addEventListener('orientationchange', function () {
    setTimeout(resizeGameContainer, 150);
});

window.addEventListener('load', function () {
    resizeGameContainer();
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
