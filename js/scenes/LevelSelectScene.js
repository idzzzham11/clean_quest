var LevelSelectScene = class extends Phaser.Scene {
    constructor() {
        super({ key: CONSTANTS.SCENES.LEVEL_SELECT });
    }

    create() {
        var W = CONSTANTS.WIDTH, H = CONSTANTS.HEIGHT;
        var scene = this;

        var bg = this.add.graphics();
        bg.fillGradientStyle(0x0a1a2a, 0x0a1a2a, 0x1a2a3a, 0x1a2a3a, 1);
        bg.fillRect(0, 0, W, H);

        this.add.text(W / 2, 28, '🗺  Select Level', {
            fontFamily: 'Nunito, sans-serif', fontSize: '30px', fontStyle: 'bold',
            color: '#FFB347', stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5);

        // World map path
        var pathPoints = [
            { x: 150, y: 260 }, { x: 360, y: 160 }, { x: 580, y: 230 },
            { x: 800, y: 150 }
        ];
        var path = this.add.graphics();
        path.lineStyle(6, 0x666666, 0.6);
        for (var i = 0; i < pathPoints.length - 1; i++) {
            var from = pathPoints[i], to = pathPoints[i + 1];
            // Dotted path
            var steps = 8;
            for (var s = 0; s < steps; s++) {
                var t1 = s / steps, t2 = (s + 0.5) / steps;
                path.beginPath();
                path.moveTo(from.x + (to.x - from.x) * t1, from.y + (to.y - from.y) * t1);
                path.lineTo(from.x + (to.x - from.x) * t2, from.y + (to.y - from.y) * t2);
                path.strokePath();
            }
        }

        var levelColors = [0x4169E1, 0xCC44AA, 0xFF6600, 0x20B2AA];
        var levelIcons = ['🏢', '✂️', '👨‍🍳', '🤝'];

        pathPoints.forEach(function (pt, i) {
            var levelNum = i + 1;
            var unlocked = SaveManager.isLevelUnlocked(levelNum);
            var stars = SaveManager.getLevelStars(levelNum);
            var color = unlocked ? levelColors[i] : 0x444444;

            // Level node circle
            var circle = scene.add.circle(pt.x, pt.y, 44, color, unlocked ? 0.9 : 0.4);
            circle.setStrokeStyle(3, unlocked ? 0xFFFFFF : 0x666666, unlocked ? 0.8 : 0.4);

            // Lock/icon
            var iconText = unlocked ? levelIcons[i] : '🔒';
            scene.add.text(pt.x, pt.y - 8, iconText, { fontSize: '28px' }).setOrigin(0.5);

            // Level number
            scene.add.text(pt.x, pt.y + 20, 'Lv.' + levelNum, {
                fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontStyle: 'bold',
                color: unlocked ? '#FFFFFF' : '#666666'
            }).setOrigin(0.5);

            // Stars below node
            for (var s = 0; s < 3; s++) {
                var starColor = s < stars ? '#FFD700' : '#333333';
                scene.add.text(pt.x - 12 + s * 13, pt.y + 52, '★', {
                    fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: starColor
                }).setOrigin(0.5);
            }

            // Level name
            scene.add.text(pt.x, pt.y + 70, CONSTANTS.LEVEL_NAMES[levelNum], {
                fontFamily: 'Nunito, sans-serif', fontSize: '10px', color: '#AAAAAA',
                align: 'center', wordWrap: { width: 90 }
            }).setOrigin(0.5);

            // Clickable — use IIFE to capture levelNum and pt correctly
            if (unlocked) {
                (function (lvl, node, circ) {
                    circ.setInteractive({ useHandCursor: true });
                    circ.on('pointerdown', function () {
                        scene._startLevel(lvl);
                    });
                    circ.on('pointerover', function () {
                        scene.tweens.add({ targets: circ, scaleX: 1.1, scaleY: 1.1, duration: 120 });
                        scene._showLevelPreview(lvl, node.x, node.y);
                    });
                    circ.on('pointerout', function () {
                        scene.tweens.add({ targets: circ, scaleX: 1, scaleY: 1, duration: 120 });
                        if (scene._previewCard) { scene._previewCard.destroy(); scene._previewCard = null; }
                    });
                })(levelNum, pt, circle);
            }
        });

        // Total progress
        var totalStars = 0;
        for (var lv = 1; lv <= 4; lv++) { totalStars += SaveManager.getLevelStars(lv); }
        this.add.text(W / 2, H - 80, '⭐ Total Stars: ' + totalStars + ' / 12', {
            fontFamily: 'Nunito, sans-serif', fontSize: '16px', color: '#FFD700'
        }).setOrigin(0.5);

        // Badges count
        var badges = (SaveManager.get('progress.collectedBadges') || []).length;
        this.add.text(W / 2, H - 52, '🏅 Badges: ' + badges, {
            fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: '#FFB347'
        }).setOrigin(0.5);

        // Back
        this.add.text(30, H - 25, '← Back', {
            fontFamily: 'Nunito, sans-serif', fontSize: '15px', color: '#888888'
        }).setInteractive({ useHandCursor: true }).on('pointerdown', function () {
            scene.scene.start(CONSTANTS.SCENES.TITLE);
        });

        // Reset progress button
        var resetBtn = this.add.text(W - 20, H - 25, '🔄 Reset', {
            fontFamily: 'Nunito, sans-serif', fontSize: '15px', color: '#FF6666'
        }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });

        resetBtn.on('pointerover', function () { resetBtn.setAlpha(0.7); });
        resetBtn.on('pointerout',  function () { resetBtn.setAlpha(1); });
        resetBtn.on('pointerdown', function () {
            scene._confirmReset();
        });

        this.cameras.main.fadeIn(400);
    }

    _startLevel(levelNum) {
        this.cameras.main.fadeOut(400);
        var scene = this;
        this.time.delayedCall(400, function () {
            scene.scene.start(CONSTANTS.SCENES['LEVEL' + levelNum]);
        });
    }

    _confirmReset() {
        var scene = this;
        var W = CONSTANTS.WIDTH, H = CONSTANTS.HEIGHT;

        // Dim overlay
        var overlay = this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.75).setDepth(50);

        // Dialog box
        var box = this.add.graphics().setDepth(51);
        box.fillStyle(0x1a1a2e, 1);
        box.fillRoundedRect(W / 2 - 200, H / 2 - 90, 400, 180, 16);
        box.lineStyle(3, 0xFF6666, 1);
        box.strokeRoundedRect(W / 2 - 200, H / 2 - 90, 400, 180, 16);

        var msg = this.add.text(W / 2, H / 2 - 45, 'Reset semua kemajuan?', {
            fontFamily: 'Nunito, sans-serif', fontSize: '20px', fontStyle: 'bold',
            color: '#FFFFFF'
        }).setOrigin(0.5).setDepth(52);

        var sub = this.add.text(W / 2, H / 2 - 10, 'Semua peringkat akan dikunci semula.', {
            fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#AAAAAA'
        }).setOrigin(0.5).setDepth(52);

        // Confirm button
        var confirmBg = this.add.graphics().setDepth(52);
        confirmBg.fillStyle(0xFF4444, 1);
        confirmBg.fillRoundedRect(W / 2 - 190, H / 2 + 30, 170, 44, 10);
        var confirmBtn = this.add.text(W / 2 - 105, H / 2 + 52, '✔  Ya, Reset', {
            fontFamily: 'Nunito, sans-serif', fontSize: '16px', fontStyle: 'bold', color: '#FFFFFF'
        }).setOrigin(0.5).setDepth(53).setInteractive({ useHandCursor: true });
        confirmBtn.on('pointerdown', function () {
            SaveManager.clearSave();
            scene.scene.start(CONSTANTS.SCENES.LEVEL_SELECT);
        });

        // Cancel button
        var cancelBg = this.add.graphics().setDepth(52);
        cancelBg.fillStyle(0x555555, 1);
        cancelBg.fillRoundedRect(W / 2 + 20, H / 2 + 30, 170, 44, 10);
        var cancelBtn = this.add.text(W / 2 + 105, H / 2 + 52, '✖  Batal', {
            fontFamily: 'Nunito, sans-serif', fontSize: '16px', fontStyle: 'bold', color: '#FFFFFF'
        }).setOrigin(0.5).setDepth(53).setInteractive({ useHandCursor: true });
        cancelBtn.on('pointerdown', function () {
            overlay.destroy(); box.destroy(); msg.destroy();
            sub.destroy(); confirmBg.destroy(); confirmBtn.destroy();
            cancelBg.destroy(); cancelBtn.destroy();
        });
    }

    _showLevelPreview(levelNum, nodeX, nodeY) {
        if (this._previewCard) this._previewCard.destroy();
        var px = nodeX > CONSTANTS.WIDTH / 2 ? nodeX - 180 : nodeX + 60;
        var py = Math.max(10, nodeY - 60);

        var card = this.add.graphics();
        card.fillStyle(0x000000, 0.85);
        card.fillRoundedRect(px, py, 160, 70, 8);
        card.lineStyle(2, 0xFFB347, 0.8);
        card.strokeRoundedRect(px, py, 160, 70, 8);

        var t1 = this.add.text(px + 80, py + 18, CONSTANTS.LEVEL_NAMES[levelNum], {
            fontFamily: 'Nunito, sans-serif', fontSize: '11px', fontStyle: 'bold',
            color: '#FFB347', wordWrap: { width: 140 }, align: 'center'
        }).setOrigin(0.5);

        var t2 = this.add.text(px + 80, py + 50, 'Tap to play!', {
            fontFamily: 'Nunito, sans-serif', fontSize: '12px', color: '#FFFFFF'
        }).setOrigin(0.5);

        this._previewCard = this.add.container(0, 0, [card, t1, t2]);
    }
};
