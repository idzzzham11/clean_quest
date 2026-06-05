// CleanQuest: Workplace Hero — Entry Point

// Resize the game container to the largest 16:9 box that fits the screen
function resizeGameContainer() {
    var controlsBar = document.getElementById('controls-bar');
    var container = document.getElementById('game-container');
    // Use actual rendered height; fallback to 120 when mobile controls are active
    var barH = (controlsBar && controlsBar.offsetHeight > 0)
        ? controlsBar.offsetHeight
        : (document.body.classList.contains('mobile-active') ? 120 : 0);
    var availW = window.innerWidth;
    var availH = window.innerHeight - barH;

    // Fit 16:9 within available space
    var w = availW;
    var h = Math.round(w * 9 / 16);
    if (h > availH) {
        h = availH;
        w = Math.round(h * 16 / 9);
    }

    container.style.width  = w + 'px';
    container.style.height = h + 'px';
    container.style.flex   = 'none';
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
            expandParent: true,
            parent: 'game-container'
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
