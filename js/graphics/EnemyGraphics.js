// Generates all enemy and boss textures procedurally
var EnemyGraphics = {
    generate: function (scene) {
        EnemyGraphics._makeGerm(scene);
        EnemyGraphics._makeSmellCloud(scene);
        EnemyGraphics._makeHairMonster(scene);
        EnemyGraphics._makeDirtyRobot(scene);
        EnemyGraphics._makeBossGerm(scene);
        EnemyGraphics._makeBossFog(scene);
        EnemyGraphics._makeBossHair(scene);
        EnemyGraphics._makeBossRobot(scene);
        EnemyGraphics._makeFinalBoss(scene);
    },

    _rt: function (scene, key, w, h, drawFn) {
        var rt = scene.add.renderTexture(0, 0, w, h);
        var g = scene.add.graphics();
        drawFn(g, w, h);
        rt.draw(g, 0, 0);
        rt.saveTexture(key);
        g.destroy();
        rt.destroy();
    },

    _makeGerm: function (scene) {
        // Small bouncy green circle with spikes
        EnemyGraphics._rt(scene, 'germ', 32, 32, function (g, W, H) {
            // Germ body
            g.fillStyle(0x32CD32, 1);
            g.fillCircle(W / 2, H / 2, 12);
            // Spikes
            g.fillStyle(0x28A428, 1);
            var spikes = 8;
            for (var i = 0; i < spikes; i++) {
                var angle = (i / spikes) * Math.PI * 2;
                var x1 = W / 2 + 10 * Math.cos(angle);
                var y1 = H / 2 + 10 * Math.sin(angle);
                var x2 = W / 2 + 16 * Math.cos(angle);
                var y2 = H / 2 + 16 * Math.sin(angle);
                g.fillTriangle(
                    x1 + 3 * Math.cos(angle + Math.PI / 2),
                    y1 + 3 * Math.sin(angle + Math.PI / 2),
                    x2, y2,
                    x1 - 3 * Math.cos(angle + Math.PI / 2),
                    y1 - 3 * Math.sin(angle + Math.PI / 2)
                );
            }
            // Eyes (angry)
            g.fillStyle(0xFF0000, 1);
            g.fillCircle(W / 2 - 4, H / 2 - 2, 3);
            g.fillCircle(W / 2 + 4, H / 2 - 2, 3);
            g.fillStyle(0x000000, 1);
            g.fillCircle(W / 2 - 4, H / 2 - 2, 1.5);
            g.fillCircle(W / 2 + 4, H / 2 - 2, 1.5);
        });

        // Hurt variant
        EnemyGraphics._rt(scene, 'germ_hurt', 32, 32, function (g, W, H) {
            g.fillStyle(0xFFFFFF, 0.8);
            g.fillCircle(W / 2, H / 2, 14);
            g.fillStyle(0x32CD32, 0.5);
            g.fillCircle(W / 2, H / 2, 12);
        });
    },

    _makeSmellCloud: function (scene) {
        EnemyGraphics._rt(scene, 'smell_cloud', 48, 36, function (g, W, H) {
            // Puffy cloud shape
            g.fillStyle(0x9370DB, 0.85);
            g.fillCircle(W / 2, H / 2 + 4, 14);
            g.fillCircle(W / 2 - 10, H / 2 + 6, 10);
            g.fillCircle(W / 2 + 10, H / 2 + 6, 10);
            g.fillCircle(W / 2 - 5, H / 2 - 2, 11);
            g.fillCircle(W / 2 + 5, H / 2 - 2, 11);
            // Smell squiggles
            g.lineStyle(2, 0x664499, 1);
            g.beginPath(); g.arc(W / 2 - 6, H / 2 - 8, 4, Math.PI * 0.2, Math.PI * 0.8); g.strokePath();
            g.beginPath(); g.arc(W / 2 + 6, H / 2 - 8, 4, Math.PI * 0.2, Math.PI * 0.8); g.strokePath();
            // X eyes
            g.lineStyle(2, 0xFFFFFF, 1);
            g.strokeLineShape(new Phaser.Geom.Line(W / 2 - 8, H / 2, W / 2 - 4, H / 2 + 4));
            g.strokeLineShape(new Phaser.Geom.Line(W / 2 - 4, H / 2, W / 2 - 8, H / 2 + 4));
            g.strokeLineShape(new Phaser.Geom.Line(W / 2 + 4, H / 2, W / 2 + 8, H / 2 + 4));
            g.strokeLineShape(new Phaser.Geom.Line(W / 2 + 8, H / 2, W / 2 + 4, H / 2 + 4));
        });
    },

    _makeHairMonster: function (scene) {
        EnemyGraphics._rt(scene, 'hair_monster', 40, 44, function (g, W, H) {
            // Body
            g.fillStyle(0x5C3A1E, 1);
            g.fillRoundedRect(6, 14, W - 12, H - 18, 5);
            // Wild hair (top)
            g.fillStyle(0x8B4513, 1);
            for (var i = 0; i < 7; i++) {
                var hx = 4 + i * (W - 8) / 6;
                var hh = 8 + (i % 2) * 6;
                g.fillTriangle(hx - 4, 16, hx, 16 - hh, hx + 4, 16);
            }
            // Sideways hair
            g.fillTriangle(2, 20, -4, 28, 2, 36);
            g.fillTriangle(W - 2, 20, W + 4, 28, W - 2, 36);
            // Face
            g.fillStyle(0x7A4420, 1);
            g.fillRoundedRect(8, 18, W - 16, 16, 4);
            // Eyes (angry red)
            g.fillStyle(0xFF2222, 1);
            g.fillCircle(W / 2 - 6, 26, 4);
            g.fillCircle(W / 2 + 6, 26, 4);
            // Legs
            g.fillStyle(0x5C3A1E, 1);
            g.fillRoundedRect(8, H - 8, 8, 8, 2);
            g.fillRoundedRect(W - 16, H - 8, 8, 8, 2);
        });
    },

    _makeDirtyRobot: function (scene) {
        EnemyGraphics._rt(scene, 'dirty_robot', 36, 48, function (g, W, H) {
            // Body — grimy robot
            g.fillStyle(0x666666, 1);
            g.fillRoundedRect(4, 12, W - 8, H - 20, 4);
            // Dirty patches
            g.fillStyle(0x443322, 0.7);
            g.fillEllipse(10, 24, 10, 8);
            g.fillEllipse(W - 10, 28, 8, 6);
            // Head
            g.fillStyle(0x777777, 1);
            g.fillRoundedRect(6, 2, W - 12, 14, 3);
            // Eyes (glowing red)
            g.fillStyle(0xFF0000, 1);
            g.fillRect(9, 6, 5, 4);
            g.fillRect(W - 14, 6, 5, 4);
            // Legs
            g.fillStyle(0x555555, 1);
            g.fillRect(6, H - 10, 8, 10);
            g.fillRect(W - 14, H - 10, 8, 10);
            // Arms
            g.fillRect(0, 16, 6, 16);
            g.fillRect(W - 6, 16, 6, 16);
            // Border rust
            g.lineStyle(2, 0xAA6633, 0.5);
            g.strokeRoundedRect(4, 12, W - 8, H - 20, 4);
        });
    },

    _makeBossGerm: function (scene) {
        // Giant Germ Monster — 96×96
        EnemyGraphics._rt(scene, 'boss_germ', 96, 96, function (g, W, H) {
            // Big body
            g.fillStyle(0x228B22, 1);
            g.fillCircle(W / 2, H / 2 + 10, 38);
            // Spikes
            g.fillStyle(0x186018, 1);
            for (var i = 0; i < 12; i++) {
                var angle = (i / 12) * Math.PI * 2;
                var x1 = W / 2 + 32 * Math.cos(angle);
                var y1 = H / 2 + 10 + 32 * Math.sin(angle);
                var x2 = W / 2 + 46 * Math.cos(angle);
                var y2 = H / 2 + 10 + 46 * Math.sin(angle);
                g.fillTriangle(
                    x1 + 5 * Math.cos(angle + Math.PI / 2), y1 + 5 * Math.sin(angle + Math.PI / 2),
                    x2, y2,
                    x1 - 5 * Math.cos(angle + Math.PI / 2), y1 - 5 * Math.sin(angle + Math.PI / 2)
                );
            }
            // Eyes (large angry)
            g.fillStyle(0xFF2222, 1);
            g.fillCircle(W / 2 - 14, H / 2, 12);
            g.fillCircle(W / 2 + 14, H / 2, 12);
            g.fillStyle(0x000000, 1);
            g.fillCircle(W / 2 - 12, H / 2 + 2, 6);
            g.fillCircle(W / 2 + 16, H / 2 + 2, 6);
            // Angry mouth
            g.lineStyle(4, 0x000000, 1);
            g.beginPath(); g.arc(W / 2, H / 2 + 20, 12, Math.PI, 0, true); g.strokePath();
            // Crown/horns
            g.fillStyle(0x33DD33, 1);
            g.fillTriangle(W / 2 - 20, H / 2 - 28, W / 2 - 14, H / 2 - 42, W / 2 - 8, H / 2 - 28);
            g.fillTriangle(W / 2 - 4, H / 2 - 34, W / 2, H / 2 - 48, W / 2 + 4, H / 2 - 34);
            g.fillTriangle(W / 2 + 8, H / 2 - 28, W / 2 + 14, H / 2 - 42, W / 2 + 20, H / 2 - 28);
        });
    },

    _makeBossFog: function (scene) {
        EnemyGraphics._rt(scene, 'boss_fog', 112, 80, function (g, W, H) {
            // Large puffy fog
            g.fillStyle(0x7B4DB5, 0.9);
            g.fillCircle(W / 2, H / 2 + 8, 28);
            g.fillCircle(W / 2 - 20, H / 2 + 12, 22);
            g.fillCircle(W / 2 + 20, H / 2 + 12, 22);
            g.fillCircle(W / 2 - 10, H / 2 - 8, 24);
            g.fillCircle(W / 2 + 10, H / 2 - 8, 24);
            // Stink lines
            g.lineStyle(3, 0x552288, 0.8);
            g.beginPath(); g.arc(W / 2 - 16, H / 2 - 20, 8, Math.PI * 0.3, Math.PI * 0.7); g.strokePath();
            g.beginPath(); g.arc(W / 2, H / 2 - 22, 8, Math.PI * 0.3, Math.PI * 0.7); g.strokePath();
            g.beginPath(); g.arc(W / 2 + 16, H / 2 - 20, 8, Math.PI * 0.3, Math.PI * 0.7); g.strokePath();
            // Big face
            g.fillStyle(0xEECCFF, 1);
            g.fillEllipse(W / 2, H / 2 + 4, 50, 30);
            g.fillStyle(0xFF2222, 1);
            g.fillCircle(W / 2 - 12, H / 2, 8);
            g.fillCircle(W / 2 + 12, H / 2, 8);
            g.fillStyle(0x000000, 1);
            g.fillCircle(W / 2 - 10, H / 2 + 1, 4);
            g.fillCircle(W / 2 + 14, H / 2 + 1, 4);
        });
    },

    _makeBossHair: function (scene) {
        EnemyGraphics._rt(scene, 'boss_hair', 100, 100, function (g, W, H) {
            // Massive hair creature
            g.fillStyle(0x8B4513, 1);
            g.fillRoundedRect(10, 30, W - 20, H - 40, 8);
            // Wild hair explosion
            g.fillStyle(0xA0522D, 1);
            for (var i = 0; i < 16; i++) {
                var angle = (i / 16) * Math.PI * 2;
                var len = 28 + (i % 3) * 10;
                var bx = W / 2 + 24 * Math.cos(angle);
                var by = H / 2 - 4 + 24 * Math.sin(angle);
                g.fillTriangle(
                    bx - 5 * Math.cos(angle + Math.PI / 2), by - 5 * Math.sin(angle + Math.PI / 2),
                    bx + len * Math.cos(angle), by + len * Math.sin(angle),
                    bx + 5 * Math.cos(angle + Math.PI / 2), by + 5 * Math.sin(angle + Math.PI / 2)
                );
            }
            // Face
            g.fillStyle(0x7A4420, 1);
            g.fillRoundedRect(18, 34, W - 36, 28, 5);
            g.fillStyle(0xFF4444, 1);
            g.fillCircle(W / 2 - 12, H / 2 - 4, 8);
            g.fillCircle(W / 2 + 12, H / 2 - 4, 8);
            g.fillStyle(0x000000, 1);
            g.fillCircle(W / 2 - 10, H / 2 - 2, 4);
            g.fillCircle(W / 2 + 14, H / 2 - 2, 4);
            // Legs
            g.fillStyle(0x8B4513, 1);
            g.fillRoundedRect(14, H - 14, 16, 14, 3);
            g.fillRoundedRect(W - 30, H - 14, 16, 14, 3);
        });
    },

    _makeBossRobot: function (scene) {
        EnemyGraphics._rt(scene, 'boss_robot', 96, 112, function (g, W, H) {
            // Body
            g.fillStyle(0x555555, 1);
            g.fillRoundedRect(8, 24, W - 16, H - 36, 6);
            // Grimy panels
            g.fillStyle(0x443322, 0.6);
            g.fillRect(14, 32, 18, 12);
            g.fillRect(W - 32, 40, 18, 12);
            g.fillRect(14, 54, 14, 10);
            // Head
            g.fillStyle(0x666666, 1);
            g.fillRoundedRect(12, 4, W - 24, 24, 5);
            // Glowing eyes
            g.fillStyle(0xFF0000, 1);
            g.fillRect(18, 10, 12, 8);
            g.fillRect(W - 30, 10, 12, 8);
            g.fillStyle(0xFF8888, 0.5);
            g.fillRect(19, 11, 10, 6);
            g.fillRect(W - 29, 11, 10, 6);
            // Arms
            g.fillStyle(0x555555, 1);
            g.fillRoundedRect(0, 28, 10, 28, 3);
            g.fillRoundedRect(W - 10, 28, 10, 28, 3);
            // Legs
            g.fillRoundedRect(14, H - 16, 20, 16, 3);
            g.fillRoundedRect(W - 34, H - 16, 20, 16, 3);
            // Dirty chest badge
            g.fillStyle(0x884422, 0.8);
            g.fillRoundedRect(W / 2 - 14, 36, 28, 20, 3);
            g.lineStyle(2, 0xFF4400, 1);
            g.strokeRoundedRect(W / 2 - 14, 36, 28, 20, 3);
        });
    },

    _makeFinalBoss: function (scene) {
        EnemyGraphics._rt(scene, 'boss_final', 110, 110, function (g, W, H) {
            // Composite final boss — combines all elements
            // Body — dark core
            g.fillStyle(0x220033, 1);
            g.fillCircle(W / 2, H / 2 + 10, 40);
            // Germ aura
            g.fillStyle(0x228B22, 0.4);
            g.fillCircle(W / 2, H / 2 + 10, 48);
            // Hair spikes
            g.fillStyle(0x8B4513, 0.7);
            for (var i = 0; i < 18; i++) {
                var angle = (i / 18) * Math.PI * 2;
                var r1 = 34, r2 = 52 + (i % 3) * 6;
                g.fillTriangle(
                    W / 2 + r1 * Math.cos(angle - 0.15), H / 2 + 10 + r1 * Math.sin(angle - 0.15),
                    W / 2 + r2 * Math.cos(angle), H / 2 + 10 + r2 * Math.sin(angle),
                    W / 2 + r1 * Math.cos(angle + 0.15), H / 2 + 10 + r1 * Math.sin(angle + 0.15)
                );
            }
            // Eyes (3 eyes)
            g.fillStyle(0xFF0000, 1);
            g.fillCircle(W / 2, H / 2 - 4, 10);
            g.fillCircle(W / 2 - 16, H / 2 + 4, 8);
            g.fillCircle(W / 2 + 16, H / 2 + 4, 8);
            g.fillStyle(0xFFFF00, 1);
            g.fillCircle(W / 2, H / 2 - 4, 5);
            g.fillCircle(W / 2 - 14, H / 2 + 5, 4);
            g.fillCircle(W / 2 + 18, H / 2 + 5, 4);
            // Mouth — jagged
            g.lineStyle(4, 0xFF4400, 1);
            g.beginPath(); g.arc(W / 2, H / 2 + 22, 16, Math.PI, 0, true); g.strokePath();
        });
    }
};
