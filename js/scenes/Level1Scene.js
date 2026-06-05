// Shared level logic module (used by all 5 level scenes)
var LevelSceneCore = {
    init: function (scene) {
        var W = CONSTANTS.WIDTH;
        var H = CONSTANTS.HEIGHT;
        var levelWidth = CONSTANTS.LEVEL_WIDTHS[scene._levelNum];

        scene._doorsOpened = 0;
        scene._doorsRequired = LevelData[scene._levelKey].doorsRequired || 1;
        scene._fallingRespawn = false;
        scene._quizPassed = false;
        scene._noDamageTaken = true;
        scene._noHazardsTouched = true;
        scene._enemies = [];
        scene._items = [];
        scene._hazards = [];
        scene._doors = [];
        scene._doorSprites = [];
        scene._paused = false;
        scene._levelComplete = false;

        GameState.resetLevel();
        QuizManager.initLevel(scene._quizLevelKey);
        CheckpointSystem.init();
        MobileControls.init();
        AudioManager.initOnGesture();

        var levelHeight = CONSTANTS.LEVEL_HEIGHT;
        // No bottom bound — player can fall through holes (detected in update)
        scene.physics.world.setBounds(0, 0, levelWidth, levelHeight * 4, true, true, true, false);
        scene.cameras.main.setBounds(0, 0, levelWidth, levelHeight);

        LevelSceneCore._buildBackground(scene, levelWidth, H);

        var data = LevelData[scene._levelKey];
        scene._platforms = TilemapBuilder.buildMap(scene, data.map, CONSTANTS.TILE_SIZE);
        LevelSceneCore._identifySpecialTiles(scene, data.map);

        LevelSceneCore._spawnEnemies(scene, data.enemies);
        LevelSceneCore._spawnItems(scene, data.items);
        LevelSceneCore._spawnHazards(scene, data.hazards);

        // Spawn just above the ground (row 9 * 48 = 432; player height ~44px)
        scene._player = new Player(scene, 80, 380, null);
        scene._player.body.setCollideWorldBounds(true);
        scene.add.existing(scene._player);

        LevelSceneCore._setupColliders(scene);
        LevelSceneCore._buildHUD(scene);

        scene._cursors = scene.input.keyboard.createCursorKeys();
        scene.input.keyboard.addKey('SPACE');

        GameState.on('playerDied', function () { LevelSceneCore._onPlayerDied(scene); }, scene);
        GameState.on('gameOver', function () { LevelSceneCore._onGameOver(scene); }, scene);
        GameState.on('pauseToggle', function () { LevelSceneCore._togglePause(scene); }, scene);

        scene.cameras.main.startFollow(scene._player, true, 0.1, 0.1);
        AudioManager.playBGM(scene._bgmKey);
        LevelSceneCore._showLevelBanner(scene);
    },

    update: function (scene, time, delta) {
        if (scene._paused || QuizOverlay.isVisible()) return;

        if (scene._player && !scene._player.isDead) {
            var mobileInput = {
                left: MobileControls.left,
                right: MobileControls.right,
                jumpJustPressed: MobileControls.jumpJustPressed
            };
            MobileControls.jumpJustPressed = false;
            scene._player.update(scene._cursors, mobileInput, delta);

            // Fell into a hole — respawn at last passed door
            if (scene._player.y > CONSTANTS.LEVEL_HEIGHT + 20 && !scene._fallingRespawn) {
                scene._fallingRespawn = true;
                LevelSceneCore._respawnAtLastDoor(scene);
            }
        }

        scene._enemies.forEach(function (e) {
            if (e.alive) {
                if (e instanceof SmellCloudEnemy) e.update(time);
                else e.update(delta);
            }
        });

        scene._items.forEach(function (item) {
            if (!item.collected) item.update(time);
        });
    },

    shutdown: function (scene) {
        MobileControls.hide();
        AudioManager.stopBGM();
    },

    _buildHUD: function (scene) {
        var W = CONSTANTS.WIDTH;
        var pad = 10;
        var row1 = 16;
        var row2 = 44;

        // Dark bar background
        scene.add.rectangle(0, 0, W, 62, 0x000000, 0.5)
            .setOrigin(0, 0).setScrollFactor(0).setDepth(20);

        // Hearts
        scene._hudHearts = [];
        for (var i = 0; i < CONSTANTS.PLAYER_MAX_HEALTH; i++) {
            var heart = scene.add.image(pad + 14 + i * 32, row1, 'heart_full')
                .setScrollFactor(0).setDepth(21).setScale(0.85);
            scene._hudHearts.push(heart);
        }

        // Coin icon + count
        scene.add.image(pad + 12, row2, 'coin_ui').setScrollFactor(0).setDepth(21).setScale(0.9);
        scene._hudCoins = scene.add.text(pad + 26, row2, '0', TextStyles.hud)
            .setOrigin(0, 0.5).setScrollFactor(0).setDepth(21);

        // Star icon + count
        scene.add.image(pad + 78, row2, 'star_ui').setScrollFactor(0).setDepth(21).setScale(0.9);
        scene._hudStars = scene.add.text(pad + 92, row2, '0', TextStyles.hud)
            .setOrigin(0, 0.5).setScrollFactor(0).setDepth(21);

        // Score
        scene._hudScore = scene.add.text(W - pad, row1, 'Score: 0', TextStyles.hud)
            .setOrigin(1, 0.5).setScrollFactor(0).setDepth(21);

        // Level name
        scene._hudLevel = scene.add.text(W / 2, row2, CONSTANTS.LEVEL_NAMES[scene._levelNum], {
            fontFamily: 'Nunito, sans-serif', fontSize: '13px', fontStyle: 'bold',
            color: '#FFFFFF', stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5, 0.5).setScrollFactor(0).setDepth(21);

        // Pause button
        scene._pauseBtn = scene.add.text(W - pad, row2, '⏸', {
            fontFamily: 'Nunito, sans-serif', fontSize: '20px', color: '#FFFFFF'
        }).setOrigin(1, 0.5).setScrollFactor(0).setDepth(21)
            .setInteractive({ useHandCursor: true });
        scene._pauseBtn.on('pointerdown', function () { GameState.emit('pauseToggle'); });

        // Wire GameState events — store references so we can remove them on shutdown
        scene._onHealthChanged = function (h) {
            if (!scene._hudHearts) return;
            scene._hudHearts.forEach(function (hrt, i) {
                hrt.setTexture(i < h ? 'heart_full' : 'heart_empty');
            });
        };
        scene._onCoinsChanged  = function (c) { scene._hudCoins  && scene._hudCoins.setText(c); };
        scene._onStarsChanged  = function (s) { scene._hudStars  && scene._hudStars.setText(s); };
        scene._onScoreChanged  = function (s) { scene._hudScore  && scene._hudScore.setText('Score: ' + s); };

        GameState.on('healthChanged', scene._onHealthChanged, scene);
        GameState.on('coinsChanged',  scene._onCoinsChanged,  scene);
        GameState.on('starsChanged',  scene._onStarsChanged,  scene);
        GameState.on('scoreChanged',  scene._onScoreChanged,  scene);

        // Remove listeners when scene shuts down
        scene.events.once('shutdown', function () {
            GameState.off('healthChanged', scene._onHealthChanged, scene);
            GameState.off('coinsChanged',  scene._onCoinsChanged,  scene);
            GameState.off('starsChanged',  scene._onStarsChanged,  scene);
            GameState.off('scoreChanged',  scene._onScoreChanged,  scene);
            GameState.off('playerDied',    null, scene);
            GameState.off('gameOver',      null, scene);
            GameState.off('pauseToggle',   null, scene);
            scene._hudHearts = null;
            scene._hudCoins  = null;
            scene._hudStars  = null;
            scene._hudScore  = null;
        });

        // Initial values
        scene._hudHearts.forEach(function (hrt, i) {
            hrt.setTexture(i < GameState.getHealth() ? 'heart_full' : 'heart_empty');
        });
        scene._hudCoins.setText(GameState.getCoins());
        scene._hudStars.setText(GameState.getHygieneStars());
        scene._hudScore.setText('Score: ' + GameState.getScore());
    },

    _respawnAtLastDoor: function (scene) {
        // Find the last opened door's x position as respawn point
        var respawnX = 80;  // default: level start
        var respawnY = 380;
        if (scene._doors && scene._doors.length > 0) {
            for (var i = scene._doors.length - 1; i >= 0; i--) {
                if (scene._doors[i].opened) {
                    respawnX = scene._doors[i].x - 100;  // just before the door
                    break;
                }
            }
        }

        // Lose 1 health
        GameState.takeDamage(1);

        if (GameState.getHealth() <= 0) {
            // Out of health — trigger normal death
            scene._fallingRespawn = false;
            GameState.emit('playerDied');
            return;
        }

        // Flash and reposition player
        scene._player._invincible = true;
        scene._player.body.setVelocity(0, 0);
        scene._player.setPosition(respawnX, respawnY);

        // Brief camera flash
        scene.cameras.main.flash(300, 255, 100, 0, false);

        // Show "Jatuh!" hint
        LevelSceneCore._showHint(scene, 'Jatuh! Kembali ke pintu terakhir.');

        // Reset fall flag after a short delay
        scene.time.delayedCall(600, function () {
            scene._player._invincible = false;
            scene._fallingRespawn = false;
        });
    },

    _buildBackground: function (scene, levelWidth, H) {
        // Use plain images with scroll factor for parallax — tileSprite needs canvas textures
        var W = CONSTANTS.WIDTH;
        scene.add.image(W / 2, H / 2, scene._bgFarKey)
            .setScrollFactor(0.05).setDepth(-3).setDisplaySize(levelWidth, H);
        scene.add.image(W / 2, H / 2, scene._bgMidKey)
            .setScrollFactor(0.2).setDepth(-2).setDisplaySize(levelWidth, H);
        scene.add.image(W / 2, H / 2, scene._bgNearKey)
            .setScrollFactor(0.5).setDepth(-1).setDisplaySize(levelWidth, H);
    },

    _identifySpecialTiles: function (scene, map) {
        var T = CONSTANTS.TILES;
        var tileSize = CONSTANTS.TILE_SIZE;

        for (var row = 0; row < map.length; row++) {
            for (var col = 0; col < map[row].length; col++) {
                var tileId = map[row][col];
                if (!tileId) continue;
                var x = col * tileSize + tileSize / 2;
                var y = row * tileSize + tileSize / 2;

                if (tileId === T.DOOR_LOCKED) {
                    scene._doors.push({ x: x, y: y, opened: false });
                    // Zone tall enough to catch player standing on ground below
                    var zone = scene.add.zone(x, y + 16, 56, 120);
                    scene.physics.add.existing(zone, true);
                    zone.doorIndex = scene._doors.length - 1;
                    scene._doorSprites.push(zone);
                }
                if (tileId === T.CHECKPOINT) {
                    var cz = scene.add.zone(x, y + 16, 56, 120);
                    scene.physics.add.existing(cz, true);
                    cz._cpX = x; cz._cpY = y - tileSize;
                    scene._checkpointZones = scene._checkpointZones || [];
                    scene._checkpointZones.push(cz);
                }
                if (tileId === T.LEVEL_END) {
                    scene._levelEndZone = scene.add.zone(x, y + 16, 56, 120);
                    scene.physics.add.existing(scene._levelEndZone, true);
                }
            }
        }
    },

    _spawnEnemies: function (scene, enemyData) {
        scene._enemyGroup = scene.physics.add.group();
        enemyData.forEach(function (d) {
            var enemy;
            switch (d.type) {
                case 'germ':         enemy = new GermEnemy(scene, d.x, d.y); break;
                case 'smell_cloud':  enemy = new SmellCloudEnemy(scene, d.x, d.y); break;
                case 'hair_monster': enemy = new HairMonsterEnemy(scene, d.x, d.y); break;
                case 'dirty_robot':  enemy = new DirtyRobotEnemy(scene, d.x, d.y); break;
                default: return;
            }
            scene.add.existing(enemy);
            scene._enemyGroup.add(enemy);
            scene._enemies.push(enemy);
        });
    },

    _spawnItems: function (scene, itemData) {
        itemData.forEach(function (d) {
            var item = new CollectibleItem(scene, d.x, d.y, d.type);
            scene._items.push(item);
        });
    },

    _spawnHazards: function (scene, hazardData) {
        hazardData.forEach(function (d) {
            var hazard = new HazardItem(scene, d.x, d.y, d.type);
            scene._hazards.push(hazard);
        });
    },

    _setupColliders: function (scene) {
        var player = scene._player;
        var platforms = scene._platforms;

        scene.physics.add.collider(player, platforms);
        scene.physics.add.collider(scene._enemyGroup, platforms);

        scene.physics.add.overlap(player, scene._enemyGroup, function (p, enemy) {
            if (!enemy.alive) return;
            if (enemy.isBeingStomped(player)) {
                player.stomp(enemy);
                enemy.die(scene);
            } else if (!p._invincible) {
                p.takeDamage(1, enemy.x);
                scene._noDamageTaken = false;
            }
        });

        scene._hazards.forEach(function (hazard) {
            scene.physics.add.overlap(player, hazard, function (p) {
                if (!p._invincible) {
                    p.takeDamage(1, hazard.x);
                    scene._noDamageTaken = false;
                    scene._noHazardsTouched = false;
                }
            });
        });

        // Per-item overlap registered individually
        scene._items.forEach(function (item) {
            scene.physics.add.overlap(player, item, function (p, itm) {
                if (!itm.collected) {
                    itm.collect(scene);
                    p.collect(itm);
                }
            });
        });

        scene._doorSprites.forEach(function (zone) {
            scene.physics.add.overlap(player, zone, function () {
                var d = scene._doors[zone.doorIndex];
                if (!d.opened && !QuizOverlay.isVisible() && player.body.blocked.down) {
                    d.opened = true;
                    QuizManager.show(scene, scene._quizLevelKey, function (passed) {
                        if (passed) {
                            scene._quizPassed = true;
                            scene._doorsOpened++;
                        } else {
                            d.opened = false;
                        }
                    });
                }
            });
        });

        if (scene._checkpointZones) {
            scene._checkpointZones.forEach(function (zone) {
                scene.physics.add.overlap(player, zone, function () {
                    CheckpointSystem.reach(zone._cpX, zone._cpY);
                });
            });
        }

        if (scene._levelEndZone) {
            scene.physics.add.overlap(player, scene._levelEndZone, function () {
                if (scene._doorsOpened >= scene._doorsRequired) {
                    LevelSceneCore._completeLevel(scene);
                } else {
                    var remaining = scene._doorsRequired - scene._doorsOpened;
                    LevelSceneCore._showHint(scene, 'Jawab ' + remaining + ' soalan kuiz lagi untuk membuka pintu!');
                }
            });
        }
    },

    _showLevelBanner: function (scene) {
        var W = CONSTANTS.WIDTH;
        var banner = scene.add.text(W / 2, 70, 'Level ' + scene._levelNum + '\n' + CONSTANTS.LEVEL_NAMES[scene._levelNum], {
            fontFamily: 'Nunito, sans-serif', fontSize: '28px', fontStyle: 'bold',
            color: '#FFFFFF', stroke: '#000000', strokeThickness: 4, align: 'center'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(20).setAlpha(0);

        scene.tweens.add({
            targets: banner, alpha: 1, y: 90, duration: 500,
            onComplete: function () {
                scene.time.delayedCall(2200, function () {
                    if (!scene.tweens) return;
                    scene.tweens.add({
                        targets: banner, alpha: 0, duration: 400,
                        onComplete: function () { banner.destroy(); }
                    });
                });
            }
        });
    },

    _showHint: function (scene, text) {
        if (scene._hintDialog) scene._hintDialog.destroy();
        scene._hintDialog = new DialogBox(scene, CONSTANTS.WIDTH / 2 - 150, 60, text, {
            bgColor: 0xFFEEBB, borderColor: 0xFFAA00, duration: 2500
        });
    },

    _togglePause: function (scene) {
        if (scene._paused) {
            scene.scene.resume(scene.scene.key);
            scene._paused = false;
            if (scene._pauseContainer) { scene._pauseContainer.destroy(); scene._pauseContainer = null; }
        } else {
            scene.scene.pause(scene.scene.key);
            scene._paused = true;
            LevelSceneCore._showPauseScreen(scene);
        }
    },

    _showPauseScreen: function (scene) {
        var W = CONSTANTS.WIDTH, H = CONSTANTS.HEIGHT;
        var bg = scene.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.65).setScrollFactor(0).setDepth(100);
        var title = scene.add.text(W / 2, H / 2 - 50, 'PAUSED', {
            fontFamily: 'Nunito, sans-serif', fontSize: '44px', fontStyle: 'bold',
            color: '#FFFFFF', stroke: '#000000', strokeThickness: 5
        }).setOrigin(0.5).setScrollFactor(0).setDepth(101);

        var resumeBtn = scene.add.text(W / 2, H / 2 + 20, 'Resume (P / ESC)', {
            fontFamily: 'Nunito, sans-serif', fontSize: '22px', color: '#FFB347'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(101).setInteractive({ useHandCursor: true });
        resumeBtn.on('pointerdown', function () { GameState.emit('pauseToggle'); });

        var quitBtn = scene.add.text(W / 2, H / 2 + 70, 'Quit to Menu', {
            fontFamily: 'Nunito, sans-serif', fontSize: '18px', color: '#CCCCCC'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(101).setInteractive({ useHandCursor: true });
        quitBtn.on('pointerdown', function () {
            AudioManager.stopBGM();
            scene.scene.start(CONSTANTS.SCENES.TITLE);
        });

        scene.input.keyboard.on('keydown-P', function () { GameState.emit('pauseToggle'); });
        scene.input.keyboard.on('keydown-ESC', function () { GameState.emit('pauseToggle'); });

        scene._pauseContainer = scene.add.container(0, 0, [bg, title, resumeBtn, quitBtn]);
        scene._pauseContainer.setScrollFactor(0).setDepth(100);
    },

    _completeLevel: function (scene) {
        if (scene._levelComplete) return;
        scene._levelComplete = true;

        AudioManager.playLevelComplete();
        AudioManager.stopBGM();

        scene._player.body.setVelocity(0, 0);

        var stars = RewardSystem.calculateStars(
            GameState.getScore(), GameState.getCoins(), GameState.getHygieneStars(),
            scene._quizPassed, scene._noDamageTaken
        );

        SaveManager.saveLevelResult(scene._levelNum, stars, GameState.getScore());
        MissionManager.checkLevelComplete(scene._levelNum, scene._noHazardsTouched, scene._noDamageTaken);

        var celebration = scene.add.text(CONSTANTS.WIDTH / 2, CONSTANTS.HEIGHT / 2, '✨ Level Complete! ✨', {
            fontFamily: 'Nunito, sans-serif', fontSize: '36px', fontStyle: 'bold',
            color: '#FFD700', stroke: '#000000', strokeThickness: 5
        }).setOrigin(0.5).setScrollFactor(0).setDepth(50).setAlpha(0);

        scene.tweens.add({
            targets: celebration, alpha: 1, scaleX: 1.15, scaleY: 1.15,
            duration: 400, yoyo: true, repeat: 1,
            onComplete: function () {
                scene.time.delayedCall(700, function () {
                    var levelKey = scene.scene.key;
                    scene.scene.start(CONSTANTS.SCENES.RESULTS, {
                        levelNum: scene._levelNum,
                        fromLevelKey: levelKey,
                        stars: stars,
                        score: GameState.getScore(),
                        coins: GameState.getCoins()
                    });
                });
            }
        });
    },

    _onPlayerDied: function (scene) {
        if (scene._dyingHandled) return;
        scene._dyingHandled = true;

        AudioManager.stopBGM();

        // Dim overlay
        var W = CONSTANTS.WIDTH, H = CONSTANTS.HEIGHT;
        var overlay = scene.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0)
            .setScrollFactor(0).setDepth(90);
        scene.tweens.add({ targets: overlay, fillAlpha: 0.6, duration: 800 });

        scene.time.delayedCall(900, function () {
            scene.add.text(W / 2, H / 2 - 40, 'Cuba Lagi!', {
                fontFamily: 'Nunito, sans-serif', fontSize: '42px', fontStyle: 'bold',
                color: '#FF4444', stroke: '#000000', strokeThickness: 5
            }).setOrigin(0.5).setScrollFactor(0).setDepth(91);

            var restartBtn = scene.add.text(W / 2, H / 2 + 30, '▶  Mula Semula', {
                fontFamily: 'Nunito, sans-serif', fontSize: '24px', fontStyle: 'bold',
                color: '#FFFFFF', backgroundColor: '#FF8800', padding: { x: 20, y: 10 }
            }).setOrigin(0.5).setScrollFactor(0).setDepth(91).setInteractive({ useHandCursor: true });

            restartBtn.on('pointerdown', function () {
                scene.scene.restart();
            });

            var menuBtn = scene.add.text(W / 2, H / 2 + 90, 'Menu Utama', {
                fontFamily: 'Nunito, sans-serif', fontSize: '16px',
                color: '#AAAAAA'
            }).setOrigin(0.5).setScrollFactor(0).setDepth(91).setInteractive({ useHandCursor: true });

            menuBtn.on('pointerdown', function () {
                scene.scene.start(CONSTANTS.SCENES.TITLE);
            });
        });
    },

    _onGameOver: function (scene) {
        LevelSceneCore._onPlayerDied(scene);
    }
};

// ==========================================
// Level 1 — Office Hygiene Adventure
// ==========================================
var Level1Scene = class extends Phaser.Scene {
    constructor() {
        super({ key: CONSTANTS.SCENES.LEVEL1 });
    }

    create() {
        this._levelNum = 1;
        this._levelKey = 'level1';
        this._bgmKey = 'office';
        this._quizLevelKey = 'level1';
        this._bossType = CONSTANTS.BOSSES.GERM_MONSTER;
        this._bgFarKey = 'bg_office_far';
        this._bgMidKey = 'bg_office_mid';
        this._bgNearKey = 'bg_office_near';
        LevelSceneCore.init(this);
    }

    update(time, delta) { LevelSceneCore.update(this, time, delta); }
    shutdown()          { LevelSceneCore.shutdown(this); }
};
