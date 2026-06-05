// CleanQuest: Workplace Hero — Entry Point

// Size the container to the largest 16:9 box that fits the screen,
// then let Phaser's FIT mode scale its 960x540 canvas to fill it.
function resizeGameContainer() {
    var container = document.getElementById('game-container');
    if (!container) return;

    var availW = window.innerWidth;
    var availH = window.innerHeight;

    var w = availW;
    var h = Math.round(w * 9 / 16);
    if (h > availH) {
        h = availH;
        w = Math.round(h * 16 / 9);
    }

    container.style.width  = w + 'px';
    container.style.height = h + 'px';

    // Center horizontally if narrower than screen
    container.style.marginLeft = Math.round((availW - w) / 2) + 'px';

    if (window._game && window._game.scale) {
        window._game.scale.refresh();
    }
}

window.addEventListener('resize', resizeGameContainer);
window.addEventListener('orientationchange', function () {
    setTimeout(resizeGameContainer, 150);
});

window.addEventListener('load', function () {
    resizeGameContainer(); // size container before Phaser reads it
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
            expandParent: false,
            width: CONSTANTS.WIDTH,
            height: CONSTANTS.HEIGHT
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
