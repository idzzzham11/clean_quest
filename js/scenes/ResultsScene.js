var ResultsScene = class extends Phaser.Scene {
    constructor() {
        super({ key: CONSTANTS.SCENES.RESULTS });
    }

    init(data) {
        this._levelNum = data.levelNum || 1;
        this._stars = data.stars || 0;
        this._score = data.score || GameState.getScore();
        this._coins = data.coins || GameState.getCoins();
        this._fromLevelKey = data.fromLevelKey || null;
    }

    create() {
        var W = CONSTANTS.WIDTH, H = CONSTANTS.HEIGHT;
        var scene = this;

        // Background
        var bg = this.add.graphics();
        bg.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x2d2d5a, 0x2d2d5a, 1);
        bg.fillRect(0, 0, W, H);

        // Confetti effect
        this._launchConfetti();

        // Title
        this.add.text(W / 2, 50, '🎉 Level Complete! 🎉', {
            fontFamily: 'Nunito, sans-serif', fontSize: '36px', fontStyle: 'bold',
            color: '#FFD700', stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5);

        // Level name
        this.add.text(W / 2, 95, CONSTANTS.LEVEL_NAMES[this._levelNum], {
            fontFamily: 'Nunito, sans-serif', fontSize: '20px', color: '#AACCFF',
            stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5);

        // Stars display
        var starY = 155;
        var starSpacing = 60;
        for (var i = 0; i < 3; i++) {
            var starKey = i < this._stars ? 'star_rating_gold' : 'star_rating_empty';
            var starX = W / 2 - starSpacing + i * starSpacing;
            var star = this.add.image(starX, starY, starKey).setScale(1.8).setAlpha(0);
            this.tweens.add({
                targets: star, alpha: 1, scaleX: 2, scaleY: 2,
                delay: 300 + i * 200, duration: 400, ease: 'Back.easeOut'
            });
        }

        // Score panel
        var panelX = W / 2 - 160;
        var panelY = 210;
        var panelW = 320;
        var panelBg = this.add.graphics();
        panelBg.fillStyle(0x000000, 0.4);
        panelBg.fillRoundedRect(panelX, panelY, panelW, 120, 12);
        panelBg.lineStyle(2, 0xFFB347, 0.6);
        panelBg.strokeRoundedRect(panelX, panelY, panelW, 120, 12);

        this.add.text(W / 2, panelY + 20, 'Score: ' + this._score, {
            fontFamily: 'Nunito, sans-serif', fontSize: '24px', fontStyle: 'bold',
            color: '#FFD700'
        }).setOrigin(0.5);
        this.add.text(W / 2, panelY + 52, '🪙 Coins: ' + this._coins, {
            fontFamily: 'Nunito, sans-serif', fontSize: '18px', color: '#FFD700'
        }).setOrigin(0.5);
        this.add.text(W / 2, panelY + 80, '⭐ Stars: ' + this._stars + ' / 3', {
            fontFamily: 'Nunito, sans-serif', fontSize: '18px', color: '#FFFFFF'
        }).setOrigin(0.5);

        // Educational tip box
        var tipIndex = (this._levelNum - 1) * 2;
        var tip = LoadingTips[tipIndex % LoadingTips.length];
        var tipBg = this.add.graphics();
        tipBg.fillStyle(0xFFB347, 0.15);
        tipBg.fillRoundedRect(80, 348, W - 160, 60, 8);
        tipBg.lineStyle(2, 0xFFB347, 0.5);
        tipBg.strokeRoundedRect(80, 348, W - 160, 60, 8);
        this.add.text(W / 2, 378, '💡 ' + tip, {
            fontFamily: 'Nunito, sans-serif', fontSize: '12px', color: '#FFE8C0',
            wordWrap: { width: W - 200 }, align: 'center'
        }).setOrigin(0.5);

        // Badges earned notification
        var badges = SaveManager.get('progress.collectedBadges') || [];
        if (badges.length > 0) {
            this.add.text(W / 2, 425, '🏅 Badges Earned: ' + badges.length, {
                fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: '#FFD700'
            }).setOrigin(0.5);
        }

        // Buttons — row 1
        var btnY1 = 430;
        this._makeButton(W / 2 - 170, btnY1, this._levelNum < 4 ? 'Level Seterusnya' : 'Tamat!', function () {
            scene._stopOldLevel();
            if (scene._levelNum < 4) {
                var nextLevel = scene._levelNum + 1;
                SaveManager.unlockLevel(nextLevel);
                scene.scene.start(CONSTANTS.SCENES['LEVEL' + nextLevel]);
            } else {
                scene.scene.start(CONSTANTS.SCENES.CREDITS);
            }
        }, this._levelNum < 4 ? 0x2ECC71 : 0xFFD700);

        this._makeButton(W / 2 + 10, btnY1, 'Main Semula', function () {
            scene._stopOldLevel();
            scene.scene.start(CONSTANTS.SCENES['LEVEL' + scene._levelNum]);
        }, 0x4169E1);

        // Buttons — row 2
        var btnY2 = 490;
        this._makeButton(W / 2 - 170, btnY2, 'Pilih Peringkat', function () {
            scene.scene.start(CONSTANTS.SCENES.LEVEL_SELECT);
        }, 0xFFB347);

        this._makeButton(W / 2 + 10, btnY2, 'Sijil', function () {
            scene._showCertificate();
        }, 0xC8A020);

        // Leaderboard entry
        this._promptLeaderboard();

        AudioManager.stopBGM();
    }

    _makeButton(x, y, label, callback, color, w) {
        var bw = w || 160;
        var bg = this.add.graphics().setDepth(10);
        bg.fillStyle(color || 0xFFB347, 1);
        bg.fillRoundedRect(x - bw / 2, y - 20, bw, 40, 8);
        bg.lineStyle(2, 0x000000, 0.3);
        bg.strokeRoundedRect(x - bw / 2, y - 20, bw, 40, 8);

        var btn = this.add.text(x, y, label, {
            fontFamily: 'Nunito, sans-serif', fontSize: '15px', fontStyle: 'bold', color: '#FFFFFF'
        }).setOrigin(0.5).setDepth(11).setInteractive({ useHandCursor: true, pixelPerfect: false });

        btn.on('pointerover', function () { bg.setAlpha(0.8); btn.setScale(1.05); });
        btn.on('pointerout',  function () { bg.setAlpha(1);   btn.setScale(1); });
        btn.on('pointerdown', callback);
    }

    _launchConfetti() {
        var scene = this;
        var colors = [0xFF4444, 0x44FF44, 0x4444FF, 0xFFFF44, 0xFF44FF, 0x44FFFF, 0xFFD700];
        for (var i = 0; i < 20; i++) {
            var x = Phaser.Math.Between(0, CONSTANTS.WIDTH);
            var conf = scene.add.rectangle(x, -10, 8, 8, colors[i % colors.length]).setDepth(1);
            scene.tweens.add({
                targets: conf,
                x: x + Phaser.Math.Between(-60, 60),
                y: CONSTANTS.HEIGHT + 20,
                angle: Phaser.Math.Between(0, 360),
                duration: 1500 + Phaser.Math.Between(0, 1000),
                delay: Phaser.Math.Between(0, 800),
                onComplete: function () { conf.destroy(); }
            });
        }
    }

    _stopOldLevel() {
        // Stop the level scene that sent us here (it may still be in stopped-but-alive state)
        if (this._fromLevelKey && this.scene.get(this._fromLevelKey)) {
            this.scene.stop(this._fromLevelKey);
        }
        // Also stop any level scenes that are sleeping/stopped
        var levelKeys = ['Level1Scene','Level2Scene','Level3Scene','Level4Scene'];
        var s = this.scene;
        levelKeys.forEach(function (k) { try { s.stop(k); } catch(e) {} });
    }

    _showCertificate() {
        var char = SaveManager.getCharacter();
        RewardSystem.showCertificate(this, this._levelNum, char.name || 'Workplace Hero', this._stars);
    }

    _promptLeaderboard() {
        var playerName = SaveManager.getCharacter().name || 'Hero';
        SaveManager.addLeaderboardEntry(playerName, this._score);
    }
};
