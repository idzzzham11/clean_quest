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

        var scene = this;
        var hasSave = SaveManager.isLevelUnlocked(2);

        // ── Fixed positions from top ──────────────────────────────
        // Logo area: top quarter
        var logo = this.add.text(W / 2, 60, 'CleanQuest', {
            fontFamily: 'Nunito, sans-serif',
            fontSize: '58px', fontStyle: 'bold',
            color: '#FFB347',
            stroke: '#CC6600', strokeThickness: 6,
            shadow: { offsetX: 3, offsetY: 3, color: '#000000', blur: 6, fill: true }
        }).setOrigin(0.5);

        this.add.text(W / 2, 120, 'Workplace Hero', {
            fontFamily: 'Nunito, sans-serif',
            fontSize: '24px', fontStyle: 'bold',
            color: '#AACCFF', stroke: '#000033', strokeThickness: 3
        }).setOrigin(0.5);

        this.add.text(W / 2, 152, 'Amalan Kebersihan dan Penampilan Diri', {
            fontFamily: 'Nunito, sans-serif',
            fontSize: '13px', color: '#88AACC'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: logo, y: logo.y - 8, duration: 1500,
            yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
        });

        // Player name display
        var currentName = SaveManager.getCharacter().name || '';
        var nameDisplay = this.add.text(W / 2, 192, currentName ? '👤 ' + currentName : '👤 Tetapkan nama anda', {
            fontFamily: 'Nunito, sans-serif', fontSize: '15px',
            color: currentName ? '#AAFFAA' : '#FFAAAA'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        nameDisplay.on('pointerdown', function () {
            scene._showNameInput(function (name) {
                nameDisplay.setText('👤 ' + name);
                nameDisplay.setColor('#AAFFAA');
            });
        });

        // ── Buttons — evenly spaced from y=220 ───────────────────
        var GAP = 52;
        var startY = 228;
        var row = 0;

        var doPlay = function () {
            AudioManager.initOnGesture();
            var name = SaveManager.getCharacter().name || '';
            if (!name || name === 'Player 1') {
                scene._showNameInput(function () {
                    scene.cameras.main.fadeOut(400);
                    scene.time.delayedCall(400, function () { scene.scene.start(CONSTANTS.SCENES.LEVEL_SELECT); });
                });
            } else {
                scene.cameras.main.fadeOut(400);
                scene.time.delayedCall(400, function () { scene.scene.start(CONSTANTS.SCENES.LEVEL_SELECT); });
            }
        };

        this._makeMenuButton(W / 2, startY + GAP * row++, '🎮  Main', 0xFFB347, doPlay);

        if (hasSave) {
            this._makeMenuButton(W / 2, startY + GAP * row++, '▶  Teruskan', 0x2ECC71, function () {
                AudioManager.initOnGesture();
                scene.cameras.main.fadeOut(400);
                scene.time.delayedCall(400, function () { scene.scene.start(CONSTANTS.SCENES.LEVEL_SELECT); });
            });
        }

        this._makeMenuButton(W / 2, startY + GAP * row++, '🏆  Papan Kedudukan', 0x4169E1, function () {
            scene.scene.start(CONSTANTS.SCENES.LEADERBOARD);
        });

        this._makeMenuButton(W / 2, startY + GAP * row++, '🎬  Kredit', 0x888888, function () {
            scene.scene.start(CONSTANTS.SCENES.CREDITS);
        });

        if (hasSave) {
            this._makeMenuButton(W / 2, startY + GAP * row++, '🔄  Reset', 0xFF4444, function () {
                scene._confirmReset();
            });
        }

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

    _showNameInput(onSave) {
        var scene = this;
        var W = CONSTANTS.WIDTH, H = CONSTANTS.HEIGHT;

        // Overlay
        var overlay = this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.8).setDepth(60);

        // Box
        var box = this.add.graphics().setDepth(61);
        box.fillStyle(0x1a1a2e, 1);
        box.fillRoundedRect(W / 2 - 220, H / 2 - 110, 440, 220, 16);
        box.lineStyle(3, 0xFFB347, 1);
        box.strokeRoundedRect(W / 2 - 220, H / 2 - 110, 440, 220, 16);

        var title = this.add.text(W / 2, H / 2 - 75, '👤 Masukkan Nama Anda', {
            fontFamily: 'Nunito, sans-serif', fontSize: '20px', fontStyle: 'bold', color: '#FFB347'
        }).setOrigin(0.5).setDepth(62);

        var sub = this.add.text(W / 2, H / 2 - 45, 'Nama akan dipaparkan di papan kedudukan', {
            fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#AAAAAA'
        }).setOrigin(0.5).setDepth(62);

        // HTML input field
        var input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 20;
        input.placeholder = 'Nama pelajar...';
        input.value = SaveManager.getCharacter().name !== 'Player 1' ? SaveManager.getCharacter().name : '';
        input.style.cssText = [
            'position:fixed',
            'left:50%', 'top:50%',
            'transform:translate(-50%,-50%) translateY(-10px)',
            'width:280px', 'padding:12px 16px',
            'font-size:18px', 'font-family:Nunito,sans-serif',
            'border:3px solid #FFB347', 'border-radius:10px',
            'background:#0a0a2e', 'color:#FFFFFF',
            'text-align:center', 'outline:none',
            'z-index:9000'
        ].join(';');
        document.body.appendChild(input);
        input.focus();

        // Save button
        var saveBg = this.add.graphics().setDepth(62);
        saveBg.fillStyle(0xFFB347, 1);
        saveBg.fillRoundedRect(W / 2 - 100, H / 2 + 50, 200, 44, 10);
        var saveBtn = this.add.text(W / 2, H / 2 + 72, '✔  Simpan', {
            fontFamily: 'Nunito, sans-serif', fontSize: '18px', fontStyle: 'bold', color: '#FFFFFF'
        }).setOrigin(0.5).setDepth(63).setInteractive({ useHandCursor: true });

        var oldName = SaveManager.getCharacter().name || '';

        var doSave = function () {
            var name = input.value.trim();
            if (!name) { input.style.borderColor = '#FF4444'; return; }
            document.body.removeChild(input);

            var nameChanged = name !== oldName && oldName !== '' && oldName !== 'Player 1';
            SaveManager.saveCharacter(name,
                SaveManager.getCharacter().skinTone,
                SaveManager.getCharacter().hairColor,
                SaveManager.getCharacter().uniformColor
            );

            // Generate a new session ID when the name changes
            if (nameChanged) {
                var newSession = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8);
                localStorage.setItem('cq_session', newSession);
                SaveManager.clearSave();
                // Re-save the new name after clearing
                SaveManager.saveCharacter(name,
                    SaveManager.getCharacter().skinTone,
                    SaveManager.getCharacter().hairColor,
                    SaveManager.getCharacter().uniformColor
                );
            }

            [overlay, box, title, sub, saveBg, saveBtn].forEach(function (o) { o.destroy(); });
            if (onSave) onSave(name);

            // Restart title scene to reflect reset state
            if (nameChanged) {
                scene.scene.restart();
            }
        };

        saveBtn.on('pointerdown', doSave);
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') doSave();
        });
    }

    _confirmReset() {
        var scene = this;
        var W = CONSTANTS.WIDTH, H = CONSTANTS.HEIGHT;

        var overlay = this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.8).setDepth(50);

        var box = this.add.graphics().setDepth(51);
        box.fillStyle(0x1a1a2e, 1);
        box.fillRoundedRect(W / 2 - 200, H / 2 - 90, 400, 180, 16);
        box.lineStyle(3, 0xFF4444, 1);
        box.strokeRoundedRect(W / 2 - 200, H / 2 - 90, 400, 180, 16);

        var msg = this.add.text(W / 2, H / 2 - 45, 'Reset semua kemajuan?', {
            fontFamily: 'Nunito, sans-serif', fontSize: '20px', fontStyle: 'bold', color: '#FFFFFF'
        }).setOrigin(0.5).setDepth(52);

        var sub = this.add.text(W / 2, H / 2 - 10, 'Semua peringkat akan dikunci semula.', {
            fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#AAAAAA'
        }).setOrigin(0.5).setDepth(52);

        var confirmBg = this.add.graphics().setDepth(52);
        confirmBg.fillStyle(0xFF4444, 1);
        confirmBg.fillRoundedRect(W / 2 - 190, H / 2 + 30, 170, 44, 10);
        var confirmBtn = this.add.text(W / 2 - 105, H / 2 + 52, '✔  Ya, Reset', {
            fontFamily: 'Nunito, sans-serif', fontSize: '16px', fontStyle: 'bold', color: '#FFFFFF'
        }).setOrigin(0.5).setDepth(53).setInteractive({ useHandCursor: true });
        confirmBtn.on('pointerdown', function () {
            SaveManager.clearSave();
            scene.scene.restart();
        });

        var cancelBg = this.add.graphics().setDepth(52);
        cancelBg.fillStyle(0x555555, 1);
        cancelBg.fillRoundedRect(W / 2 + 20, H / 2 + 30, 170, 44, 10);
        var cancelBtn = this.add.text(W / 2 + 105, H / 2 + 52, '✖  Batal', {
            fontFamily: 'Nunito, sans-serif', fontSize: '16px', fontStyle: 'bold', color: '#FFFFFF'
        }).setOrigin(0.5).setDepth(53).setInteractive({ useHandCursor: true });
        cancelBtn.on('pointerdown', function () {
            [overlay, box, msg, sub, confirmBg, confirmBtn, cancelBg, cancelBtn]
                .forEach(function (o) { o.destroy(); });
        });
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
