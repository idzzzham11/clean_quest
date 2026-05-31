// Generates all collectible item, coin, and hazard textures
var ItemGraphics = {
    generate: function (scene) {
        ItemGraphics._makeCoin(scene);
        ItemGraphics._makeHygieneStar(scene);
        ItemGraphics._makeSoap(scene);
        ItemGraphics._makeUniform(scene);
        ItemGraphics._makeDeodorant(scene);
        ItemGraphics._makeComb(scene);
        ItemGraphics._makeHairnet(scene);
        ItemGraphics._makeNailClipper(scene);
        ItemGraphics._makeGloves(scene);
        // Hazards
        ItemGraphics._makeOilSpill(scene);
        ItemGraphics._makeDirtyCloud(scene);
        ItemGraphics._makeMessyHair(scene);
        ItemGraphics._makeGermPatch(scene);
    },

    _rt: function (scene, key, w, h, fn) {
        var rt = scene.add.renderTexture(0, 0, w, h);
        var g = scene.add.graphics();
        fn(g, w, h);
        rt.draw(g, 0, 0);
        rt.saveTexture(key);
        g.destroy();
        rt.destroy();
    },

    _makeCoin: function (scene) {
        ItemGraphics._rt(scene, 'coin', 24, 24, function (g, W, H) {
            g.fillStyle(0xFFD700, 1);
            g.fillCircle(W / 2, H / 2, 10);
            g.lineStyle(2, 0xCC9900, 1);
            g.strokeCircle(W / 2, H / 2, 10);
            g.fillStyle(0xFFEE88, 1);
            g.fillCircle(W / 2 - 2, H / 2 - 2, 4);
            g.fillStyle(0xCC9900, 1);
        });
    },

    _makeHygieneStar: function (scene) {
        ItemGraphics._rt(scene, 'hygiene_star', 28, 28, function (g, W, H) {
            // 5-pointed star
            g.fillStyle(0xFFFF00, 1);
            ItemGraphics._drawStar(g, W / 2, H / 2, 12, 5, 6);
            g.lineStyle(2, 0xCC9900, 1);
            ItemGraphics._strokeStar(g, W / 2, H / 2, 12, 5, 6);
            // Sparkle center
            g.fillStyle(0xFFFFFF, 0.7);
            g.fillCircle(W / 2, H / 2, 3);
        });
    },

    _makeSoap: function (scene) {
        ItemGraphics._rt(scene, 'soap', 32, 24, function (g, W, H) {
            // Soap bar
            g.fillStyle(0xF0E8FF, 1);
            g.fillRoundedRect(2, 4, W - 4, H - 6, 5);
            g.lineStyle(2, 0xCCBBEE, 1);
            g.strokeRoundedRect(2, 4, W - 4, H - 6, 5);
            // Bubble highlight
            g.fillStyle(0xFFFFFF, 0.6);
            g.fillCircle(8, 10, 3);
            g.fillCircle(14, 8, 2);
            // Brand line
            g.lineStyle(1, 0xBBAADD, 1);
            g.strokeLineShape(new Phaser.Geom.Line(8, H / 2 + 1, W - 8, H / 2 + 1));
        });
    },

    _makeUniform: function (scene) {
        ItemGraphics._rt(scene, 'uniform_clean', 32, 36, function (g, W, H) {
            // Shirt silhouette
            g.fillStyle(0x4169E1, 1);
            g.fillRoundedRect(4, 8, W - 8, H - 8, 4);
            // Collar
            g.fillStyle(0x6688FF, 1);
            g.fillTriangle(W / 2 - 6, 8, W / 2, 18, W / 2 - 1, 8);
            g.fillTriangle(W / 2 + 6, 8, W / 2, 18, W / 2 + 1, 8);
            // Buttons
            g.fillStyle(0xFFFFFF, 0.8);
            g.fillCircle(W / 2, 20, 2);
            g.fillCircle(W / 2, 26, 2);
            g.fillCircle(W / 2, 32, 2);
            // Name badge
            g.fillStyle(0xFFFFFF, 0.9);
            g.fillRoundedRect(6, 14, 10, 7, 1);
            // Sparkle (clean!)
            g.fillStyle(0xFFFF88, 1);
            g.fillTriangle(W - 6, 4, W - 4, 0, W - 2, 4);
            g.fillTriangle(W - 2, 2, W + 2, 4, W - 2, 6);
        });
    },

    _makeDeodorant: function (scene) {
        ItemGraphics._rt(scene, 'deodorant', 20, 36, function (g, W, H) {
            // Can body
            g.fillStyle(0x66AAFF, 1);
            g.fillRoundedRect(2, 8, W - 4, H - 10, 4);
            // Cap
            g.fillStyle(0x4488DD, 1);
            g.fillRoundedRect(4, 0, W - 8, 12, 3);
            // Shine
            g.fillStyle(0xFFFFFF, 0.3);
            g.fillRect(6, 10, 3, H - 14);
            // Label
            g.fillStyle(0xFFFFFF, 0.8);
            g.fillRoundedRect(4, 18, W - 8, 10, 2);
            // Sparkle
            g.fillStyle(0xAAEEFF, 1);
            g.fillCircle(W - 4, 2, 2);
        });
    },

    _makeComb: function (scene) {
        ItemGraphics._rt(scene, 'comb', 36, 20, function (g, W, H) {
            // Comb body
            g.fillStyle(0xFF8844, 1);
            g.fillRoundedRect(0, 6, W, H - 8, 3);
            // Teeth
            g.fillStyle(0xCC5522, 1);
            for (var i = 0; i < 8; i++) {
                g.fillRect(4 + i * 4, H - 5, 2, 8);
            }
        });
    },

    _makeHairnet: function (scene) {
        ItemGraphics._rt(scene, 'hairnet', 32, 24, function (g, W, H) {
            // Net shape
            g.lineStyle(2, 0x888888, 0.8);
            // Horizontal lines
            for (var y = 4; y < H; y += 6) {
                g.strokeLineShape(new Phaser.Geom.Line(2, y, W - 2, y));
            }
            // Diagonal lines
            for (var x = -H; x < W; x += 6) {
                g.strokeLineShape(new Phaser.Geom.Line(x, 0, x + H, H));
                g.strokeLineShape(new Phaser.Geom.Line(x + H, 0, x, H));
            }
            // Border
            g.lineStyle(2, 0x555555, 1);
            g.strokeEllipse(W / 2, H / 2, W - 2, H - 2);
        });
    },

    _makeNailClipper: function (scene) {
        ItemGraphics._rt(scene, 'nail_clipper', 28, 18, function (g, W, H) {
            // Handle
            g.fillStyle(0xCCCCCC, 1);
            g.fillRoundedRect(2, 4, W - 4, H - 6, 3);
            g.lineStyle(2, 0x999999, 1);
            g.strokeRoundedRect(2, 4, W - 4, H - 6, 3);
            // Blade detail
            g.fillStyle(0xAAAAAA, 1);
            g.fillRect(6, 6, W - 12, 5);
            g.lineStyle(1, 0x666666, 1);
            g.strokeRect(6, 6, W - 12, 5);
            // Hinge
            g.fillStyle(0x888888, 1);
            g.fillCircle(W / 2, H / 2 + 1, 3);
        });
    },

    _makeGloves: function (scene) {
        ItemGraphics._rt(scene, 'gloves', 40, 32, function (g, W, H) {
            // Left glove
            g.fillStyle(0x88EEBB, 1);
            g.fillRoundedRect(2, 6, 16, H - 10, 5);
            // Fingers left
            g.fillRoundedRect(2, 2, 4, 8, 2);
            g.fillRoundedRect(7, 0, 4, 8, 2);
            g.fillRoundedRect(12, 2, 4, 7, 2);
            // Right glove
            g.fillStyle(0x66CC99, 1);
            g.fillRoundedRect(W - 18, 6, 16, H - 10, 5);
            g.fillRoundedRect(W - 6, 2, 4, 8, 2);
            g.fillRoundedRect(W - 11, 0, 4, 8, 2);
            g.fillRoundedRect(W - 16, 2, 4, 7, 2);
        });
    },

    // Hazards
    _makeOilSpill: function (scene) {
        ItemGraphics._rt(scene, 'oil_spill', 64, 16, function (g, W, H) {
            g.fillStyle(0x1A1A1A, 0.9);
            g.fillEllipse(W / 2, H / 2, W - 4, H - 2);
            // Sheen
            g.fillStyle(0x441144, 0.4);
            g.fillEllipse(W / 2 - 10, H / 2, 20, 6);
            g.fillStyle(0x114444, 0.3);
            g.fillEllipse(W / 2 + 8, H / 2 - 1, 14, 5);
        });
    },

    _makeDirtyCloud: function (scene) {
        ItemGraphics._rt(scene, 'dirty_cloud', 56, 36, function (g, W, H) {
            g.fillStyle(0x886644, 0.75);
            g.fillCircle(W / 2, H / 2 + 4, 14);
            g.fillCircle(W / 2 - 12, H / 2 + 6, 10);
            g.fillCircle(W / 2 + 12, H / 2 + 6, 10);
            g.fillCircle(W / 2 - 5, H / 2 - 2, 11);
            g.fillCircle(W / 2 + 5, H / 2 - 2, 11);
            // Stink marks
            g.lineStyle(2, 0x664422, 0.7);
            for (var i = 0; i < 4; i++) {
                g.beginPath(); g.arc(W / 4 + i * W / 8, H / 2 - 8, 3, Math.PI * 0.2, Math.PI * 0.8); g.strokePath();
            }
        });
    },

    _makeMessyHair: function (scene) {
        ItemGraphics._rt(scene, 'messy_hair', 48, 20, function (g, W, H) {
            g.fillStyle(0x8B4513, 0.85);
            for (var i = 0; i < 9; i++) {
                var x = 4 + i * (W - 8) / 8;
                var h = 6 + (i % 3) * 4;
                g.fillTriangle(x - 3, H, x, H - h, x + 3, H);
            }
            // Tangles
            g.lineStyle(1.5, 0x5C3A1E, 0.7);
            g.beginPath(); g.arc(W / 3, H / 2, 5, 0, Math.PI * 1.5); g.strokePath();
            g.beginPath(); g.arc(2 * W / 3, H / 2, 5, Math.PI * 0.5, Math.PI * 2); g.strokePath();
        });
    },

    _makeGermPatch: function (scene) {
        ItemGraphics._rt(scene, 'germ_patch', 52, 20, function (g, W, H) {
            g.fillStyle(0x22AA22, 0.5);
            g.fillEllipse(W / 2, H / 2 + 3, W - 4, H - 4);
            // Mini germs
            g.fillStyle(0x32CD32, 0.8);
            for (var i = 0; i < 5; i++) {
                var gx = 8 + i * (W - 16) / 4;
                var gy = H / 2 + (i % 2) * 4 - 2;
                g.fillCircle(gx, gy, 4);
                // Mini spike
                g.fillTriangle(gx, gy - 4, gx - 2, gy - 7, gx + 2, gy - 7);
            }
        });
    },

    _drawStar: function (g, cx, cy, r, points, innerR) {
        var verts = [];
        for (var i = 0; i < points * 2; i++) {
            var radius = i % 2 === 0 ? r : innerR;
            var angle = (i * Math.PI / points) - Math.PI / 2;
            verts.push(new Phaser.Geom.Point(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)));
        }
        g.fillPoints(verts, true);
    },

    _strokeStar: function (g, cx, cy, r, points, innerR) {
        var verts = [];
        for (var i = 0; i < points * 2; i++) {
            var radius = i % 2 === 0 ? r : innerR;
            var angle = (i * Math.PI / points) - Math.PI / 2;
            verts.push(new Phaser.Geom.Point(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)));
        }
        g.strokePoints(verts, true);
    }
};
