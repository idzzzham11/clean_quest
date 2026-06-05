// CleanQuest: Workplace Hero — Entry Point

var CONTROLS_HEIGHT = 110; // px reserved for mobile controls bar

function resizeGameContainer() {
    var container = document.getElementById('game-container');
    if (!container) return;

    var availW = window.innerWidth;
    var availH = window.innerHeight;

    var w, h;
    var isPortrait = availH > availW;

    if (isPortrait) {
        // Portrait: use full width, height = width * 9/16
        // But ensure it's at least half the screen height
        w = availW;
        h = Math.round(w * 9 / 16);
        var minH = Math.round(availH * 0.55);
        if (h < minH) {
            h = minH;
            w = Math.round(h * 16 / 9);
        }
    } else {
        // Landscape: largest 16:9 box that fits
        w = availW;
        h = Math.round(w * 9 / 16);
        if (h > availH) {
            h = availH;
            w = Math.round(h * 16 / 9);
        }
    }

    container.style.width      = w + 'px';
    container.style.height     = h + 'px';
    container.style.marginLeft = Math.round((availW - w) / 2) + 'px';
    container.style.marginTop  = '0px';

    if (window._game && window._game.scale) {
        window._game.scale.refresh();
    }
}

window.addEventListener('resize', resizeGameContainer);
window.addEventListener('orientationchange', function () {
    setTimeout(resizeGameContainer, 150);
});

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
            arcade: { gravity: { y: CONSTANTS.GRAVITY }, debug: false }
        },
        scene: [
            BootScene, TitleScene, CharSelectScene, LevelSelectScene,
            HUDScene, Level1Scene, Level2Scene, Level3Scene, Level4Scene,
            BossScene, QuizScene, ResultsScene, LeaderboardScene, CreditsScene
        ]
    };

    var game = new Phaser.Game(config);
    window._game = game;

    // Initial resize after Phaser sets up
    setTimeout(resizeGameContainer, 100);
});
