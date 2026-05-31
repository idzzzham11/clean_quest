// Reusable boss arena scene
var BossScene = class extends Phaser.Scene {
    constructor() {
        super({ key: CONSTANTS.SCENES.BOSS });
    }

    init(data) {
        this._bossType = data.bossType || CONSTANTS.BOSSES.GERM_MONSTER;
        this._fromLevel = data.fromLevel || 1;
        this._levelStars = data.stars || 0;
    }

    create() {
        var W = CONSTANTS.WIDTH;
        var H = CONSTANTS.HEIGHT;

        AudioManager.playBGM('boss');

        // Arena background
        this._buildArena(W, H);

        // Player
        this._player = new Player(this, 120, H - 120, null);
        this.add.existing(this._player);
        this.physics.world.setBounds(0, 0, W, H);

        // Floor
        this._floor = this.physics.add.staticGroup();
        var floorTile = this.physics.add.staticImage(W / 2, H - 30, 'tile_office_floor')
            .setDisplaySize(W, 60).refreshBody();
        this._floor.add(floorTile);

        // Platforms
        this._platforms = this.physics.add.staticGroup();
        this._buildArenaPlatforms(W, H);

        // Create boss
        this._boss = this._createBoss(W, H);
        this.add.existing(this._boss);

        // Colliders
        this.physics.add.collider(this._player, this._floor);
        this.physics.add.collider(this._player, this._platforms);
        this.physics.add.collider(this._boss, this._floor);
        this.physics.add.collider(this._boss, this._platforms);

        this.physics.add.overlap(this._player, this._boss, function (player, boss) {
            if (!boss.alive) return;
            if (boss.isBeingStomped(player)) {
                var killed = boss.takehit(this);
                player.body.setVelocityY(CONSTANTS.STOMP_BOUNCE);
                if (killed) {
                    this._onBossDefeated();
                }
            } else if (!player._invincible) {
                player.takeDamage(1, boss.x);
            }
        }, null, this);

        this._cursors = this.input.keyboard.createCursorKeys();
        this.input.keyboard.addKey('SPACE');

        // HUD
        this.scene.launch(CONSTANTS.SCENES.HUD);
        GameState.emit('levelNameChanged', 'BOSS FIGHT!');

        // GameState events
        GameState.on('playerDied', this._onPlayerDied, this);
        GameState.on('gameOver', this._onGameOver, this);

        // Intro text
        this._showBossIntro();

        MobileControls.init();
    }

    _buildArena(W, H) {
        // Themed background per boss
        var bgColors = {
            germ_monster: [0x1A3A1A, 0x2D5A2D],
            smelly_fog: [0x1A1A3A, 0x2D2D5A],
            hair_creature: [0x3A1A0A, 0x5A2A10],
            dirty_robot: [0x1A1A1A, 0x333333],
            final_boss: [0x1A001A, 0x330033]
        };
        var colors = bgColors[this._bossType] || bgColors.germ_monster;

        var bg = this.add.graphics();
        bg.fillGradientStyle(colors[0], colors[0], colors[1], colors[1], 1);
        bg.fillRect(0, 0, W, H);

        // Warning stripes on floor
        bg.fillStyle(0xFF4400, 0.3);
        for (var i = 0; i < W; i += 60) {
            bg.fillRect(i, H - 50, 30, 50);
        }

        // Arena walls
        bg.fillStyle(0x888888, 0.4);
        bg.fillRect(0, 0, 20, H);
        bg.fillRect(W - 20, 0, 20, H);
    }

    _buildArenaPlatforms(W, H) {
        var platPositions = [
            { x: W * 0.2, y: H * 0.6, w: 120 },
            { x: W * 0.5, y: H * 0.45, w: 140 },
            { x: W * 0.8, y: H * 0.6, w: 120 }
        ];

        platPositions.forEach(function (p) {
            var plat = this.physics.add.staticImage(p.x, p.y, 'tile_platform_wood')
                .setDisplaySize(p.w, CONSTANTS.TILE_SIZE).refreshBody();
            this._platforms.add(plat);
        }, this);
    }

    _createBoss(W, H) {
        var bossTextures = {
            germ_monster: 'boss_germ',
            smelly_fog: 'boss_fog',
            hair_creature: 'boss_hair',
            dirty_robot: 'boss_robot',
            final_boss: 'boss_final'
        };
        var maxHits = {
            germ_monster: 5,
            smelly_fog: 5,
            hair_creature: 7,
            dirty_robot: 5,
            final_boss: 7
        };

        var texKey = bossTextures[this._bossType] || 'boss_germ';
        var hits = maxHits[this._bossType] || 5;
        var boss = new Boss(this, W * 0.75, H - 150, texKey, this._bossType, hits);
        return boss;
    }

    _showBossIntro() {
        var W = CONSTANTS.WIDTH, H = CONSTANTS.HEIGHT;
        var bossNames = {
            germ_monster: 'GIANT GERM MONSTER',
            smelly_fog: 'SMELLY FOG BOSS',
            hair_creature: 'MESSY HAIR CREATURE',
            dirty_robot: 'DIRTY UNIFORM ROBOT',
            final_boss: 'FINAL HYGIENE MASTER'
        };

        var overlay = this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.7)
            .setScrollFactor(0).setDepth(30);

        var warning = this.add.text(W / 2, H / 2 - 40, '⚠ BOSS APPROACHING!', {
            fontFamily: 'Nunito, sans-serif', fontSize: '32px', fontStyle: 'bold',
            color: '#FF4444', stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5).setScrollFactor(0).setDepth(31).setAlpha(0);

        var bossName = this.add.text(W / 2, H / 2 + 20, bossNames[this._bossType] || 'BOSS', {
            fontFamily: 'Nunito, sans-serif', fontSize: '24px', fontStyle: 'bold',
            color: '#FFFFFF', stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5).setScrollFactor(0).setDepth(31).setAlpha(0);

        var hint = this.add.text(W / 2, H / 2 + 65, 'Jump on the boss head to deal damage!', {
            fontFamily: 'Nunito, sans-serif', fontSize: '16px', color: '#FFB347'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(31).setAlpha(0);

        var scene = this;
        this.tweens.add({
            targets: [warning, bossName, hint], alpha: 1, duration: 400,
            onComplete: function () {
                scene.time.delayedCall(2500, function () {
                    scene.tweens.add({
                        targets: [overlay, warning, bossName, hint], alpha: 0, duration: 500,
                        onComplete: function () {
                            overlay.destroy(); warning.destroy(); bossName.destroy(); hint.destroy();
                            // Start boss movement
                            if (scene._boss && scene._boss.alive) {
                                scene._boss.body.setVelocityX(-120);
                                scene._startBossPatrol();
                            }
                        }
                    });
                });
            }
        });
    }

    _startBossPatrol() {
        var W = CONSTANTS.WIDTH;
        var boss = this._boss;

        this.time.addEvent({
            delay: 50,
            loop: true,
            callback: function () {
                if (!boss || !boss.alive || !boss.body) return;
                if (boss.x < 80) {
                    boss.body.setVelocityX(80 + boss.phase * 30);
                    boss.setFlipX(false);
                } else if (boss.x > W - 80) {
                    boss.body.setVelocityX(-(80 + boss.phase * 30));
                    boss.setFlipX(true);
                }

                // Phase-based attacks
                if (boss.phase === 2 && Math.random() < 0.01) {
                    boss.body.setVelocityY(-380);
                }
                if (boss.phase === 3 && Math.random() < 0.015) {
                    boss.body.setVelocityY(-420);
                }
            }
        });
    }

    _onBossDefeated() {
        AudioManager.stopBGM();
        AudioManager.playLevelComplete && AudioManager.playLevelComplete();

        var W = CONSTANTS.WIDTH, H = CONSTANTS.HEIGHT;
        var scene = this;

        var celebration = this.add.text(W / 2, H / 2, '🏆 BOSS DEFEATED! 🏆', {
            fontFamily: 'Nunito, sans-serif', fontSize: '34px', fontStyle: 'bold',
            color: '#FFD700', stroke: '#000000', strokeThickness: 5
        }).setOrigin(0.5).setScrollFactor(0).setDepth(50).setAlpha(0);

        this.tweens.add({
            targets: celebration, alpha: 1, scaleX: 1.2, scaleY: 1.2,
            duration: 400, yoyo: true, repeat: 1,
            onComplete: function () {
                scene.time.delayedCall(1000, function () {
                    scene.scene.stop(CONSTANTS.SCENES.HUD);
                    scene.scene.start(CONSTANTS.SCENES.RESULTS, {
                        levelNum: scene._fromLevel,
                        stars: scene._levelStars,
                        score: GameState.getScore(),
                        coins: GameState.getCoins()
                    });
                });
            }
        });
    }

    _onPlayerDied() {
        var scene = this;
        this.time.delayedCall(1500, function () {
            GameState.loseLife();
            if (GameState.getLives() <= 0) {
                LevelSceneCore._onGameOver(scene);
            } else {
                scene.scene.restart({ bossType: scene._bossType, fromLevel: scene._fromLevel, stars: scene._levelStars });
            }
        });
    }

    _onGameOver() {
        AudioManager.stopBGM();
        var scene = this;
        this.time.delayedCall(800, function () {
            scene.scene.stop(CONSTANTS.SCENES.HUD);
            scene.scene.start(CONSTANTS.SCENES.TITLE);
        });
    }

    update(time, delta) {
        if (!this._player || this._player.isDead) return;

        var mobileInput = {
            left: MobileControls.left, right: MobileControls.right,
            jumpJustPressed: MobileControls.jumpJustPressed
        };
        MobileControls.jumpJustPressed = false;
        this._player.update(this._cursors, mobileInput, delta);
    }

    shutdown() {
        GameState.off('playerDied', this._onPlayerDied, this);
        GameState.off('gameOver', this._onGameOver, this);
        MobileControls.hide();
    }
};
