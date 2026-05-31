// Persistent HUD overlay — runs parallel to level scenes
var HUDScene = class extends Phaser.Scene {
    constructor() {
        super({ key: CONSTANTS.SCENES.HUD });
        this._hearts = [];
        this._coinText = null;
        this._starText = null;
        this._scoreText = null;
        this._levelText = null;
    }

    create() {
        var W = CONSTANTS.WIDTH;
        BadgeDisplay.setScene(this);

        this._buildHUD();
        this._bindEvents();

        // Pause button
        var pauseBtn = this.add.text(W - 16, 10, '⏸', {
            fontFamily: 'Nunito, sans-serif',
            fontSize: '22px',
            color: '#FFFFFF'
        }).setOrigin(1, 0).setScrollFactor(0).setDepth(10).setInteractive({ useHandCursor: true });

        pauseBtn.on('pointerdown', function () {
            GameState.emit('pauseToggle');
        });

        this.input.keyboard && this.input.keyboard.on('keydown-P', function () {
            GameState.emit('pauseToggle');
        });
        this.input.keyboard && this.input.keyboard.on('keydown-ESC', function () {
            GameState.emit('pauseToggle');
        });
    }

    _buildHUD() {
        var padding = 14;

        // Health hearts
        for (var i = 0; i < CONSTANTS.PLAYER_MAX_HEALTH; i++) {
            var heart = this.add.image(padding + i * 30, 16, 'heart_full')
                .setScrollFactor(0).setDepth(10).setScale(0.85);
            this._hearts.push(heart);
        }

        // Coin icon + count
        this.add.image(padding, 44, 'coin_ui').setScrollFactor(0).setDepth(10).setScale(0.9);
        this._coinText = this.add.text(padding + 16, 44, '0', TextStyles.hud)
            .setOrigin(0, 0.5).setScrollFactor(0).setDepth(10);

        // Star icon + count
        this.add.image(padding + 80, 44, 'star_ui').setScrollFactor(0).setDepth(10).setScale(0.9);
        this._starText = this.add.text(padding + 96, 44, '0', TextStyles.hud)
            .setOrigin(0, 0.5).setScrollFactor(0).setDepth(10);

        // Score — right side
        this._scoreText = this.add.text(CONSTANTS.WIDTH - 14, 16, 'Score: 0', TextStyles.hud)
            .setOrigin(1, 0).setScrollFactor(0).setDepth(10);

        // Level name — center
        this._levelText = this.add.text(CONSTANTS.WIDTH / 2, 16, '', {
            fontFamily: 'Nunito, sans-serif',
            fontSize: '15px',
            fontStyle: 'bold',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(10);
    }

    _bindEvents() {
        GameState.on('healthChanged', this._updateHearts, this);
        GameState.on('coinsChanged', this._updateCoins, this);
        GameState.on('starsChanged', this._updateStars, this);
        GameState.on('scoreChanged', this._updateScore, this);
        GameState.on('levelNameChanged', this._updateLevelName, this);
    }

    _updateHearts(health) {
        this._hearts.forEach(function (heart, i) {
            heart.setTexture(i < health ? 'heart_full' : 'heart_empty');
        });
    }

    _updateCoins(coins) {
        this._coinText && this._coinText.setText(coins);
    }

    _updateStars(stars) {
        this._starText && this._starText.setText(stars);
    }

    _updateScore(score) {
        this._scoreText && this._scoreText.setText('Score: ' + score);
    }

    _updateLevelName(name) {
        this._levelText && this._levelText.setText(name);
    }

    setLevelName(name) {
        this._levelText && this._levelText.setText(name);
    }

    // Force refresh all values from GameState
    refresh() {
        this._updateHearts(GameState.getHealth());
        this._updateCoins(GameState.getCoins());
        this._updateStars(GameState.getHygieneStars());
        this._updateScore(GameState.getScore());
    }
};
