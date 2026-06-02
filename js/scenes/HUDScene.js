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
        var pad = 10;
        var row1 = 14;  // y centre for hearts row
        var row2 = 42;  // y centre for coins/stars row

        // Health hearts — top-left, row 1
        for (var i = 0; i < CONSTANTS.PLAYER_MAX_HEALTH; i++) {
            var heart = this.add.image(pad + 14 + i * 32, row1, 'heart_full')
                .setScrollFactor(0).setDepth(10).setScale(0.85);
            this._hearts.push(heart);
        }

        // Coin icon + count — top-left, row 2
        this.add.image(pad + 12, row2, 'coin_ui')
            .setScrollFactor(0).setDepth(10).setScale(0.9);
        this._coinText = this.add.text(pad + 24, row2, '0', TextStyles.hud)
            .setOrigin(0, 0.5).setScrollFactor(0).setDepth(10);

        // Star icon + count — next to coins
        this.add.image(pad + 74, row2, 'star_ui')
            .setScrollFactor(0).setDepth(10).setScale(0.9);
        this._starText = this.add.text(pad + 86, row2, '0', TextStyles.hud)
            .setOrigin(0, 0.5).setScrollFactor(0).setDepth(10);

        // Score — right side, row 1
        this._scoreText = this.add.text(CONSTANTS.WIDTH - pad, row1, 'Score: 0', TextStyles.hud)
            .setOrigin(1, 0).setScrollFactor(0).setDepth(10);

        // Level name — centre, row 2
        this._levelText = this.add.text(CONSTANTS.WIDTH / 2, row2, '', {
            fontFamily: 'Nunito, sans-serif',
            fontSize: '14px',
            fontStyle: 'bold',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5, 0.5).setScrollFactor(0).setDepth(10);
    }

    _bindEvents() {
        var self = this;
        GameState.on('healthChanged',    this._updateHearts,    this);
        GameState.on('coinsChanged',     this._updateCoins,     this);
        GameState.on('starsChanged',     this._updateStars,     this);
        GameState.on('scoreChanged',     this._updateScore,     this);
        GameState.on('levelNameChanged', this._updateLevelName, this);

        // Remove all GameState listeners when this scene instance is stopped
        this.events.once('shutdown', function () {
            GameState.off('healthChanged',    self._updateHearts,    self);
            GameState.off('coinsChanged',     self._updateCoins,     self);
            GameState.off('starsChanged',     self._updateStars,     self);
            GameState.off('scoreChanged',     self._updateScore,     self);
            GameState.off('levelNameChanged', self._updateLevelName, self);
            self._hearts = [];
            self._coinText = null;
            self._starText = null;
            self._scoreText = null;
            self._levelText = null;
        });
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
