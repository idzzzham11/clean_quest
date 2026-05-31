// Generates all tile textures procedurally
var TileGraphics = {
    generate: function (scene) {
        var S = CONSTANTS.TILE_SIZE;

        function makeTile(key, fillColor, borderColor, detailFn) {
            var rt = scene.add.renderTexture(0, 0, S, S);
            var g = scene.add.graphics();

            // Base fill
            g.fillStyle(fillColor, 1);
            g.fillRect(0, 0, S, S);

            // Top border highlight
            g.fillStyle(borderColor, 1);
            g.fillRect(0, 0, S, 4);
            // Bottom shadow
            g.fillStyle(darken(fillColor), 1);
            g.fillRect(0, S - 3, S, 3);
            // Side borders
            g.fillStyle(borderColor, 0.5);
            g.fillRect(0, 0, 3, S);
            g.fillRect(S - 3, 0, 3, S);

            if (detailFn) detailFn(g, S);

            rt.draw(g, 0, 0);
            rt.saveTexture(key);
            g.destroy();
            rt.destroy();
        }

        function darken(color) {
            var r = (color >> 16) & 0xFF;
            var g2 = (color >> 8) & 0xFF;
            var b = color & 0xFF;
            return ((Math.floor(r * 0.7) << 16) | (Math.floor(g2 * 0.7) << 8) | Math.floor(b * 0.7));
        }

        // Office tiles — blue-grey professional
        makeTile('tile_office_floor', 0x8899AA, 0xAABBCC, function (g, S) {
            // Tile grid lines
            g.lineStyle(1, 0x6677AA, 0.4);
            g.strokeRect(4, 4, S - 8, S - 8);
        });

        makeTile('tile_office_wall', 0x6677AA, 0x8899BB, function (g, S) {
            // Window pattern
            g.fillStyle(0xCCDDEE, 0.3);
            g.fillRect(8, 8, S - 16, S - 16);
        });

        // Salon tiles — pink/lavender
        makeTile('tile_salon_floor', 0xDDA0DD, 0xEEBBEE, function (g, S) {
            g.lineStyle(1, 0xCC88CC, 0.5);
            for (var i = 8; i < S; i += 8) {
                g.strokeLineShape(new Phaser.Geom.Line(i, 0, i, S));
            }
        });

        makeTile('tile_salon_wall', 0xC084C0, 0xDD99DD, function (g, S) {
            g.fillStyle(0xFFCCFF, 0.25);
            g.fillRect(6, 6, S - 12, S - 12);
        });

        // Kitchen tiles — stainless steel
        makeTile('tile_kitchen_floor', 0xB0B8C0, 0xCCCCDD, function (g, S) {
            g.lineStyle(1, 0x889099, 0.6);
            g.strokeRect(3, 3, S - 6, S - 6);
            // Shine
            g.lineStyle(2, 0xFFFFFF, 0.3);
            g.strokeLineShape(new Phaser.Geom.Line(5, 5, S - 5, 5));
        });

        makeTile('tile_kitchen_wall', 0x9AA0A8, 0xBBBBCC, function (g, S) {
            g.fillStyle(0xDDEEFF, 0.2);
            g.fillRect(4, 4, S - 8, S - 8);
        });

        // Customer Service tiles — teal/warm
        makeTile('tile_cs_floor', 0x20B2AA, 0x40C8C0, function (g, S) {
            g.lineStyle(1, 0x108888, 0.5);
            for (var i = 12; i < S; i += 12) {
                g.strokeLineShape(new Phaser.Geom.Line(0, i, S, i));
            }
        });

        makeTile('tile_cs_wall', 0x188888, 0x30AAAA, function (g, S) {
            g.fillStyle(0x88FFFF, 0.15);
            g.fillRect(5, 5, S - 10, S - 10);
        });

        // Hotel tiles — gold/luxury
        makeTile('tile_hotel_floor', 0xC8A020, 0xE8C040, function (g, S) {
            g.lineStyle(1, 0xA88010, 0.5);
            g.strokeRect(5, 5, S - 10, S - 10);
            // Diamond pattern
            g.lineStyle(1, 0xFFEE88, 0.2);
            g.strokeLineShape(new Phaser.Geom.Line(0, S / 2, S / 2, 0));
            g.strokeLineShape(new Phaser.Geom.Line(S / 2, 0, S, S / 2));
        });

        makeTile('tile_hotel_wall', 0xAA8818, 0xCCAA30, function (g, S) {
            g.fillStyle(0xFFEEBB, 0.2);
            g.fillRect(5, 5, S - 10, S - 10);
        });

        // Generic platforms
        makeTile('tile_platform_wood', 0xC8A060, 0xE8C080, function (g, S) {
            g.lineStyle(1, 0x987040, 0.6);
            g.strokeLineShape(new Phaser.Geom.Line(0, S / 3, S, S / 3));
            g.strokeLineShape(new Phaser.Geom.Line(0, 2 * S / 3, S, 2 * S / 3));
        });

        makeTile('tile_platform_glass', 0x88CCEE, 0xAAEEFF, function (g, S) {
            g.fillStyle(0xFFFFFF, 0.3);
            g.fillRect(3, 3, S - 6, 8);
        });

        makeTile('tile_platform_metal', 0x99A8B0, 0xBBCCD0, function (g, S) {
            g.lineStyle(2, 0xFFFFFF, 0.3);
            g.strokeLineShape(new Phaser.Geom.Line(3, 4, S - 6, 4));
        });

        // Door — locked (red padlock)
        TileGraphics._makeDoor(scene, 'door_locked', 0xEE4444, 0x882222, true);

        // Door — open (green open)
        TileGraphics._makeDoor(scene, 'door_open', 0x44BB44, 0x226622, false);

        // Checkpoint flag
        TileGraphics._makeCheckpoint(scene, 'checkpoint_flag');

        // Level end flag
        TileGraphics._makeLevelEnd(scene, 'level_end_flag');
    },

    _makeDoor: function (scene, key, bodyColor, borderColor, locked) {
        var S = CONSTANTS.TILE_SIZE;
        var W = S;
        var H = S * 2;
        var rt = scene.add.renderTexture(0, 0, W, H);
        var g = scene.add.graphics();

        // Door body
        g.fillStyle(bodyColor, 1);
        g.fillRoundedRect(2, 2, W - 4, H - 4, 6);
        g.lineStyle(3, borderColor, 1);
        g.strokeRoundedRect(2, 2, W - 4, H - 4, 6);

        // Door knob
        g.fillStyle(0xFFD700, 1);
        g.fillCircle(W - 10, H / 2, 5);

        if (locked) {
            // Padlock icon
            g.lineStyle(3, 0x882222, 1);
            g.strokeCircle(W / 2, H / 2 - 6, 7);
            g.fillStyle(0x882222, 1);
            g.fillRect(W / 2 - 7, H / 2 - 4, 14, 12);
            g.fillStyle(0xFFCC00, 1);
            g.fillCircle(W / 2, H / 2 + 1, 3);
        } else {
            // Open arrow
            g.fillStyle(0x226622, 1);
            g.fillTriangle(W / 2, H / 2 - 8, W / 2 - 8, H / 2 + 4, W / 2 + 8, H / 2 + 4);
        }

        rt.draw(g, 0, 0);
        rt.saveTexture(key);
        g.destroy();
        rt.destroy();
    },

    _makeCheckpoint: function (scene, key) {
        var S = CONSTANTS.TILE_SIZE;
        var rt = scene.add.renderTexture(0, 0, S, S * 3);
        var g = scene.add.graphics();

        // Pole
        g.fillStyle(0xCCCCCC, 1);
        g.fillRect(S / 2 - 2, 0, 4, S * 3);

        // Flag (unfurled to right)
        g.fillStyle(0x22CC22, 1);
        g.fillTriangle(S / 2 + 2, 4, S / 2 + 2, S, S - 4, S / 2 + 2);

        rt.draw(g, 0, 0);
        rt.saveTexture(key);
        g.destroy();
        rt.destroy();
    },

    _makeLevelEnd: function (scene, key) {
        var S = CONSTANTS.TILE_SIZE;
        var rt = scene.add.renderTexture(0, 0, S, S * 3);
        var g = scene.add.graphics();

        // Pole
        g.fillStyle(0xFFD700, 1);
        g.fillRect(S / 2 - 2, 0, 4, S * 3);

        // Star on top
        g.fillStyle(0xFFD700, 1);
        TileGraphics._drawStar(g, S / 2, 10, 5, 10, 5);

        rt.draw(g, 0, 0);
        rt.saveTexture(key);
        g.destroy();
        rt.destroy();
    },

    _drawStar: function (g, cx, cy, outerR, innerR, points) {
        var verts = [];
        for (var i = 0; i < points * 2; i++) {
            var r = i % 2 === 0 ? outerR : innerR;
            var angle = (i * Math.PI / points) - Math.PI / 2;
            verts.push(new Phaser.Geom.Point(cx + r * Math.cos(angle), cy + r * Math.sin(angle)));
        }
        g.fillPoints(verts, true);
    }
};
