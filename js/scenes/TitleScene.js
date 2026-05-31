var TitleScene = class extends Phaser.Scene {
    constructor() {
        super({ key: CONSTANTS.SCENES.TITLE });
    }

    create() {
        var W = CONSTANTS.WIDTH, H = CONSTANTS.HEIGHT;

        // Animated gradient background
        var bg = this.add.graphics();
        bg.fillGradientStyle(0x0a0a2e, 0x0a0a2e, 0x1a1a4e, 0x1a1a4e, 1);
        bg.fillRect(0, 0, W, H);

        // Animated background elements
        this._createAnimatedBg(W, H);

        // Logo
        var logo = this.add.text(W / 2, H / 2 - 130, 'CleanQuest', {
            fontFamily: 'Nunito, sans-serif',
            fontSize: '72px', fontStyle: 'bold',
            color: '#FFB347',
            stroke: '#CC6600', strokeThickness: 6,
            shadow: { offsetX: 4, offsetY: 4, color: '#000000', blur: 8, fill: true }
        }).setOrigin(0.5);

        var subtitle = this.add.text(W / 2, H / 2 - 62, 'Workplace Hero', {
            fontFamily: 'Nunito, sans-serif',
            fontSize: '32px', fontStyle: 'bold',
            color: '#AACCFF',
            stroke: '#000033', strokeThickness: 4
        }).setOrigin(0.5);

        var tagline = this.add.text(W / 2, H / 2 - 22, 'Learn Workplace Hygiene Through Adventure!', {
            fontFamily: 'Nunito, sans-serif',
            fontSize: '15px', color: '#88AACC'
        }).setOrigin(0.5);

        // Logo bounce animation
        this.tweens.add({
            targets: logo, y: logo.y - 10, duration: 1500,
            yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
        });

        // Menu buttons
        var btnY = H / 2 + 20;
        var hasSave = SaveManager.isLevelUnlocked(2);
        var scene = this;

        this._makeMenuButton(W / 2, btnY, '🎮  Play Now', 0xFFB347, function () {
            AudioManager.initOnGesture();
            scene.cameras.main.fadeOut(400);
            scene.time.delayedCall(400, function () {
                scene.scene.start(CONSTANTS.SCENES.LEVEL_SELECT);
            });
        });

        if (hasSave) {
            this._makeMenuButton(W / 2, btnY + 60, '▶  Continue', 0x2ECC71, function () {
                AudioManager.initOnGesture();
                scene.cameras.main.fadeOut(400);
                scene.time.delayedCall(400, function () {
                    scene.scene.start(CONSTANTS.SCENES.LEVEL_SELECT);
                });
            });
        }

        this._makeMenuButton(W / 2, btnY + (hasSave ? 120 : 60), '🏆  Leaderboard', 0x4169E1, function () {
            scene.scene.start(CONSTANTS.SCENES.LEADERBOARD);
        });

        this._makeMenuButton(W / 2, btnY + (hasSave ? 180 : 120), '🎬  Credits', 0x888888, function () {
            scene.scene.start(CONSTANTS.SCENES.CREDITS);
        });

        // Version + info
        this.add.text(W - 10, H - 10, 'CleanQuest v1.0 | Amalan Kebersihan Tempat Kerja', {
            fontFamily: 'Nunito, sans-serif', fontSize: '10px', color: '#444466'
        }).setOrigin(1, 1);

        // Floating hygiene items decoration
        this._createDecoration(W, H);

        this.cameras.main.fadeIn(600);
        AudioManager.playBGM('title');
    }

    _makeMenuButton(x, y, label, color, callback) {
        var w = 240, h = 48;
        var bg = this.add.graphics();
        bg.fillStyle(color, 0.9);
        bg.fillRoundedRect(x - w / 2, y - h / 2, w, h, 10);
        bg.lineStyle(2, 0xFFFFFF, 0.2);
        bg.strokeRoundedRect(x - w / 2, y - h / 2, w, h, 10);

        // Shine
        var bg2 = this.add.graphics();
        bg2.fillStyle(0xFFFFFF, 0.1);
        bg2.fillRoundedRect(x - w / 2 + 4, y - h / 2 + 4, w - 8, h / 2 - 4, 6);

        var btn = this.add.text(x, y, label, {
            fontFamily: 'Nunito, sans-serif', fontSize: '18px', fontStyle: 'bold',
            color: '#FFFFFF', stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        btn.on('pointerover', function () {
            bg.setAlpha(0.7);
            btn.setScale(1.04);
        });
        btn.on('pointerout', function () {
            bg.setAlpha(1);
            btn.setScale(1);
        });
        btn.on('pointerdown', callback);
    }

    _createAnimatedBg(W, H) {
        // Floating particles
        for (var i = 0; i < 25; i++) {
            var x = Phaser.Math.Between(0, W);
            var y = Phaser.Math.Between(0, H);
            var size = Phaser.Math.Between(2, 5);
            var circle = this.add.circle(x, y, size, 0x4466AA, 0.4);
            this.tweens.add({
                targets: circle,
                y: y - Phaser.Math.Between(30, 80),
                alpha: 0,
                duration: 2000 + Phaser.Math.Between(0, 2000),
                delay: Phaser.Math.Between(0, 3000),
                repeat: -1,
                yoyo: false,
                onRepeat: function () {
                    circle.y = Phaser.Math.Between(H * 0.7, H);
                    circle.alpha = 0.4;
                }
            });
        }
    }

    _createDecoration(W, H) {
        var icons = ['🧼', '✨', '💧', '🧤', '⭐', '🌟'];
        for (var i = 0; i < 6; i++) {
            var dx = (i % 3) * 320 + 40;
            var dy = i < 3 ? 30 : H - 40;
            var deco = this.add.text(dx, dy, icons[i], {
                fontSize: '22px'
            }).setAlpha(0.4);
            this.tweens.add({
                targets: deco,
                y: dy + 15,
                alpha: 0.7,
                duration: 2000 + i * 300,
                yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
            });
        }
    }
};
