// Generates parallax background layers for all 5 level themes
var BackgroundGraphics = {
    generate: function (scene) {
        var W = CONSTANTS.WIDTH;
        var H = CONSTANTS.HEIGHT;

        BackgroundGraphics._makeOfficeBg(scene, W, H);
        BackgroundGraphics._makeSalonBg(scene, W, H);
        BackgroundGraphics._makeKitchenBg(scene, W, H);
        BackgroundGraphics._makeCsBg(scene, W, H);
        BackgroundGraphics._makeHotelBg(scene, W, H);
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

    // === OFFICE ===
    _makeOfficeBg: function (scene, W, H) {
        // Far layer — sky gradient + distant buildings
        BackgroundGraphics._rt(scene, 'bg_office_far', W, H, function (g, W, H) {
            // Sky
            g.fillStyle(0x87CEEB, 1);
            g.fillRect(0, 0, W, H);
            // Clouds
            g.fillStyle(0xFFFFFF, 0.8);
            BackgroundGraphics._drawCloud(g, 120, 60, 80);
            BackgroundGraphics._drawCloud(g, 400, 40, 60);
            BackgroundGraphics._drawCloud(g, 700, 70, 90);
            // Distant buildings (silhouette)
            g.fillStyle(0x9AADBB, 0.6);
            g.fillRect(50, H - 200, 80, 200);
            g.fillRect(160, H - 240, 60, 240);
            g.fillRect(250, H - 180, 90, 180);
            g.fillRect(600, H - 220, 70, 220);
            g.fillRect(700, H - 200, 100, 200);
            // Windows on buildings
            g.fillStyle(0xFFFF88, 0.5);
            BackgroundGraphics._drawWindowGrid(g, 60, H - 180, 60, 8, 10);
            BackgroundGraphics._drawWindowGrid(g, 168, H - 220, 44, 8, 12);
        });

        // Mid layer — office building facade
        BackgroundGraphics._rt(scene, 'bg_office_mid', W, H, function (g, W, H) {
            // Office building wall
            g.fillStyle(0xCCDDEE, 0.7);
            g.fillRect(0, H / 3, W, H);
            // Window grid
            g.fillStyle(0xAABBCC, 0.3);
            for (var col = 0; col < 16; col++) {
                for (var row = 0; row < 3; row++) {
                    g.fillRoundedRect(col * 64 + 8, H / 3 + row * 60 + 10, 48, 40, 3);
                }
            }
        });

        // Near layer — desk + plant details
        BackgroundGraphics._rt(scene, 'bg_office_near', W, H, function (g, W, H) {
            // Floor line
            g.fillStyle(0xAABBCC, 0.4);
            g.fillRect(0, H - 120, W, 8);
            // Desks
            g.fillStyle(0xB8A090, 0.5);
            g.fillRect(80, H - 120, 120, 60);
            g.fillRect(320, H - 120, 120, 60);
            // Plant
            g.fillStyle(0x228B22, 0.6);
            g.fillCircle(600, H - 100, 28);
            g.fillStyle(0x8B6914, 0.6);
            g.fillRect(596, H - 100, 8, 30);
        });
    },

    // === SALON ===
    _makeSalonBg: function (scene, W, H) {
        BackgroundGraphics._rt(scene, 'bg_salon_far', W, H, function (g, W, H) {
            g.fillStyle(0xFFB6C1, 1);
            g.fillRect(0, 0, W, H);
            // Pastel pattern — polka dots
            g.fillStyle(0xFFCCDD, 0.5);
            for (var x = 40; x < W; x += 80) {
                for (var y = 20; y < H; y += 80) {
                    g.fillCircle(x, y, 20);
                }
            }
        });

        BackgroundGraphics._rt(scene, 'bg_salon_mid', W, H, function (g, W, H) {
            // Wall with mirrors
            g.fillStyle(0xEECCDD, 0.6);
            g.fillRect(0, 0, W, H * 0.6);
            // Mirror frames
            g.lineStyle(3, 0xDDAA88, 0.8);
            for (var m = 0; m < 5; m++) {
                g.strokeRoundedRect(m * 200 + 30, 20, 120, H * 0.5, 8);
                g.fillStyle(0xCCEEFF, 0.3);
                g.fillRoundedRect(m * 200 + 30, 20, 120, H * 0.5, 8);
            }
        });

        BackgroundGraphics._rt(scene, 'bg_salon_near', W, H, function (g, W, H) {
            // Salon chairs
            g.fillStyle(0xCC8888, 0.5);
            g.fillRoundedRect(100, H - 140, 80, 80, 6);
            g.fillRoundedRect(350, H - 140, 80, 80, 6);
            g.fillRoundedRect(600, H - 140, 80, 80, 6);
        });
    },

    // === KITCHEN ===
    _makeKitchenBg: function (scene, W, H) {
        BackgroundGraphics._rt(scene, 'bg_kitchen_far', W, H, function (g, W, H) {
            g.fillStyle(0xFFF8DC, 1);
            g.fillRect(0, 0, W, H);
            // Tiled wall
            g.lineStyle(1, 0xDDD8C0, 0.6);
            for (var tx = 0; tx < W; tx += 32) { g.strokeLineShape(new Phaser.Geom.Line(tx, 0, tx, H * 0.6)); }
            for (var ty = 0; ty < H * 0.6; ty += 32) { g.strokeLineShape(new Phaser.Geom.Line(0, ty, W, ty)); }
        });

        BackgroundGraphics._rt(scene, 'bg_kitchen_mid', W, H, function (g, W, H) {
            // Kitchen equipment — counters
            g.fillStyle(0xCCCCCC, 0.5);
            g.fillRect(0, H - 200, W, 40);
            // Pots/pans hanging
            g.fillStyle(0x888888, 0.4);
            for (var p = 0; p < 8; p++) {
                g.fillCircle(p * 130 + 60, 80, 22);
                g.lineStyle(2, 0x666666, 0.5);
                g.strokeLineShape(new Phaser.Geom.Line(p * 130 + 60, 58, p * 130 + 60, 20));
            }
        });

        BackgroundGraphics._rt(scene, 'bg_kitchen_near', W, H, function (g, W, H) {
            // Stove + oven shapes
            g.fillStyle(0xAAAAAA, 0.4);
            g.fillRoundedRect(60, H - 180, 140, 100, 5);
            g.fillRoundedRect(320, H - 180, 140, 100, 5);
        });
    },

    // === CUSTOMER SERVICE ===
    _makeCsBg: function (scene, W, H) {
        BackgroundGraphics._rt(scene, 'bg_cs_far', W, H, function (g, W, H) {
            g.fillStyle(0xE0F4F4, 1);
            g.fillRect(0, 0, W, H);
            // Teal accent strips
            g.fillStyle(0x20B2AA, 0.2);
            g.fillRect(0, 0, W, H / 4);
            g.fillRect(0, H * 3 / 4, W, H / 4);
        });

        BackgroundGraphics._rt(scene, 'bg_cs_mid', W, H, function (g, W, H) {
            // Service counter backdrop
            g.fillStyle(0x20B2AA, 0.15);
            g.fillRect(0, H / 2, W, H / 2);
            // Logo/banner
            g.fillStyle(0x20B2AA, 0.3);
            g.fillRoundedRect(W / 2 - 120, 40, 240, 60, 8);
            // Stars on banner
            g.fillStyle(0xFFD700, 0.6);
            for (var s = 0; s < 5; s++) {
                ItemGraphics && ItemGraphics._drawStar
                    ? ItemGraphics._drawStar(g, W / 2 - 40 + s * 20, 70, 8, 5, 4)
                    : g.fillCircle(W / 2 - 40 + s * 20, 70, 4);
            }
        });

        BackgroundGraphics._rt(scene, 'bg_cs_near', W, H, function (g, W, H) {
            // Reception desks
            g.fillStyle(0xFFA07A, 0.4);
            g.fillRoundedRect(80, H - 150, 180, 80, 6);
            g.fillRoundedRect(400, H - 150, 180, 80, 6);
            g.fillRoundedRect(720, H - 150, 180, 80, 6);
        });
    },

    // === HOTEL ===
    _makeHotelBg: function (scene, W, H) {
        BackgroundGraphics._rt(scene, 'bg_hotel_far', W, H, function (g, W, H) {
            g.fillStyle(0x1A3A5C, 1);
            g.fillRect(0, 0, W, H);
            // Stars in night sky
            g.fillStyle(0xFFFFFF, 0.8);
            for (var st = 0; st < 40; st++) {
                var sx = (st * 137.5) % W;
                var sy = (st * 73.1) % (H * 0.5);
                g.fillCircle(sx, sy, 1 + (st % 2));
            }
        });

        BackgroundGraphics._rt(scene, 'bg_hotel_mid', W, H, function (g, W, H) {
            // Luxury hotel wall — marble effect
            g.fillStyle(0xF5F0E8, 0.7);
            g.fillRect(0, H * 0.2, W, H);
            // Gold column lines
            g.lineStyle(4, 0xFFD700, 0.5);
            for (var col = 0; col < 8; col++) {
                var cx = col * (W / 7);
                g.strokeLineShape(new Phaser.Geom.Line(cx, H * 0.2, cx, H));
            }
            // Chandelier
            g.fillStyle(0xFFD700, 0.5);
            g.fillCircle(W / 2, H * 0.3, 30);
            for (var c = 0; c < 8; c++) {
                var angle = (c / 8) * Math.PI * 2;
                g.fillRect(W / 2 + 24 * Math.cos(angle) - 1, H * 0.3 + 24 * Math.sin(angle), 2, 12);
            }
        });

        BackgroundGraphics._rt(scene, 'bg_hotel_near', W, H, function (g, W, H) {
            // Fancy furniture
            g.fillStyle(0xC8A020, 0.35);
            g.fillRoundedRect(60, H - 180, 120, 100, 8);
            g.fillRoundedRect(350, H - 160, 100, 80, 6);
            // Carpet strip
            g.fillStyle(0x8B0000, 0.25);
            g.fillRect(0, H - 100, W, 30);
            g.lineStyle(2, 0xFFD700, 0.4);
            g.strokeRect(0, H - 100, W, 30);
        });
    },

    _drawCloud: function (g, x, y, size) {
        g.fillCircle(x, y, size * 0.4);
        g.fillCircle(x + size * 0.3, y - size * 0.1, size * 0.3);
        g.fillCircle(x - size * 0.3, y + size * 0.05, size * 0.28);
        g.fillCircle(x + size * 0.55, y + size * 0.05, size * 0.25);
    },

    _drawWindowGrid: function (g, x, y, w, cols, rows) {
        var cellW = w / cols;
        var cellH = 16;
        for (var c = 0; c < cols; c++) {
            for (var r = 0; r < rows; r++) {
                g.fillRect(x + c * cellW + 1, y + r * cellH + 1, cellW - 2, cellH - 2);
            }
        }
    }
};
