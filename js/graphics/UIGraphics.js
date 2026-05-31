// Generates UI element textures: hearts, badges, certificate frame, icons
var UIGraphics = {
    generate: function (scene) {
        UIGraphics._makeHeart(scene, 'heart_full', 0xFF4444);
        UIGraphics._makeHeart(scene, 'heart_empty', 0x555555);
        UIGraphics._makeHeart(scene, 'heart_half', 0xFF8888);

        UIGraphics._makeCoinUI(scene);
        UIGraphics._makeStarUI(scene);

        UIGraphics._makeBadge(scene, 'badge_soap', 0xF0E8FF, '🧼', 0xAA88EE);
        UIGraphics._makeBadge(scene, 'badge_deodorant', 0x66AAFF, '💨', 0x4488CC);
        UIGraphics._makeBadge(scene, 'badge_hygiene_star', 0xFFFF44, '⭐', 0xCCAA00);
        UIGraphics._makeBadge(scene, 'badge_certificate', 0xFFD700, '🏆', 0xAA8800);

        UIGraphics._makeStarRating(scene, 'star_rating_gold', 0xFFD700);
        UIGraphics._makeStarRating(scene, 'star_rating_empty', 0x444444);

        UIGraphics._makeCertificateFrame(scene);
        UIGraphics._makeButtonBg(scene);
        UIGraphics._makePauseIcon(scene);

        // Mission icons
        UIGraphics._makeMissionIcon(scene);
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

    _makeHeart: function (scene, key, color) {
        UIGraphics._rt(scene, key, 28, 26, function (g, W, H) {
            g.fillStyle(color, 1);
            // Heart shape via two circles + triangle
            g.fillCircle(W / 2 - 6, 9, 7);
            g.fillCircle(W / 2 + 6, 9, 7);
            g.fillTriangle(W / 2 - 12, 12, W / 2, H + 1, W / 2 + 12, 12);
            // Highlight
            g.fillStyle(0xFFFFFF, 0.3);
            g.fillCircle(W / 2 - 8, 7, 3);
        });
    },

    _makeCoinUI: function (scene) {
        UIGraphics._rt(scene, 'coin_ui', 22, 22, function (g, W, H) {
            g.fillStyle(0xFFD700, 1);
            g.fillCircle(W / 2, H / 2, 9);
            g.lineStyle(2, 0xCC9900, 1);
            g.strokeCircle(W / 2, H / 2, 9);
            g.fillStyle(0xFFEE88, 1);
            g.fillCircle(W / 2 - 2, H / 2 - 2, 3);
        });
    },

    _makeStarUI: function (scene) {
        UIGraphics._rt(scene, 'star_ui', 22, 22, function (g, W, H) {
            g.fillStyle(0xFFFF00, 1);
            var verts = [];
            for (var i = 0; i < 10; i++) {
                var r = i % 2 === 0 ? 9 : 4;
                var angle = (i * Math.PI / 5) - Math.PI / 2;
                verts.push(new Phaser.Geom.Point(W / 2 + r * Math.cos(angle), H / 2 + r * Math.sin(angle)));
            }
            g.fillPoints(verts, true);
            g.fillStyle(0xFFFFFF, 0.5);
            g.fillCircle(W / 2 - 2, H / 2 - 2, 2);
        });
    },

    _makeBadge: function (scene, key, bgColor, iconText, borderColor) {
        UIGraphics._rt(scene, key, 64, 64, function (g, W, H) {
            // Badge background circle
            g.fillStyle(bgColor, 1);
            g.fillCircle(W / 2, H / 2, 28);
            g.lineStyle(4, borderColor, 1);
            g.strokeCircle(W / 2, H / 2, 28);
            // Shine
            g.fillStyle(0xFFFFFF, 0.25);
            g.fillCircle(W / 2 - 6, H / 2 - 6, 10);
            // Inner border
            g.lineStyle(2, 0xFFFFFF, 0.4);
            g.strokeCircle(W / 2, H / 2, 22);
        });
    },

    _makeStarRating: function (scene, key, color) {
        UIGraphics._rt(scene, key, 24, 24, function (g, W, H) {
            g.fillStyle(color, 1);
            var verts = [];
            for (var i = 0; i < 10; i++) {
                var r = i % 2 === 0 ? 10 : 5;
                var angle = (i * Math.PI / 5) - Math.PI / 2;
                verts.push(new Phaser.Geom.Point(W / 2 + r * Math.cos(angle), H / 2 + r * Math.sin(angle)));
            }
            g.fillPoints(verts, true);
            if (color === 0xFFD700) {
                g.fillStyle(0xFFFFFF, 0.3);
                g.fillCircle(W / 2 - 3, H / 2 - 3, 2.5);
            }
        });
    },

    _makeCertificateFrame: function (scene) {
        var W = 480, H = 340;
        UIGraphics._rt(scene, 'certificate_frame', W, H, function (g) {
            // Background
            g.fillStyle(0xFFFBF0, 1);
            g.fillRect(0, 0, W, H);
            // Outer border
            g.lineStyle(6, 0xC8A020, 1);
            g.strokeRect(6, 6, W - 12, H - 12);
            // Inner border
            g.lineStyle(2, 0xC8A020, 0.5);
            g.strokeRect(14, 14, W - 28, H - 28);
            // Corner ornaments
            UIGraphics._drawCornerOrnament(g, 14, 14, 1, 1);
            UIGraphics._drawCornerOrnament(g, W - 14, 14, -1, 1);
            UIGraphics._drawCornerOrnament(g, 14, H - 14, 1, -1);
            UIGraphics._drawCornerOrnament(g, W - 14, H - 14, -1, -1);
            // Header ribbon
            g.fillStyle(0xC8A020, 0.15);
            g.fillRect(20, 20, W - 40, 50);
        });
    },

    _drawCornerOrnament: function (g, x, y, dx, dy) {
        g.fillStyle(0xC8A020, 0.6);
        g.fillCircle(x, y, 6);
        g.fillRect(x, y, 20 * dx, 3 * dy);
        g.fillRect(x, y, 3 * dx, 20 * dy);
    },

    _makeButtonBg: function (scene) {
        UIGraphics._rt(scene, 'btn_orange', 200, 50, function (g, W, H) {
            g.fillStyle(0xFFB347, 1);
            g.fillRoundedRect(0, 0, W, H, 12);
            g.lineStyle(3, 0xCC8822, 1);
            g.strokeRoundedRect(0, 0, W, H, 12);
            g.fillStyle(0xFFFFFF, 0.2);
            g.fillRoundedRect(4, 4, W - 8, H / 2 - 4, 8);
        });

        UIGraphics._rt(scene, 'btn_blue', 200, 50, function (g, W, H) {
            g.fillStyle(0x4169E1, 1);
            g.fillRoundedRect(0, 0, W, H, 12);
            g.lineStyle(3, 0x2244AA, 1);
            g.strokeRoundedRect(0, 0, W, H, 12);
            g.fillStyle(0xFFFFFF, 0.2);
            g.fillRoundedRect(4, 4, W - 8, H / 2 - 4, 8);
        });

        UIGraphics._rt(scene, 'btn_green', 200, 50, function (g, W, H) {
            g.fillStyle(0x2ECC71, 1);
            g.fillRoundedRect(0, 0, W, H, 12);
            g.lineStyle(3, 0x1A9955, 1);
            g.strokeRoundedRect(0, 0, W, H, 12);
        });
    },

    _makePauseIcon: function (scene) {
        UIGraphics._rt(scene, 'pause_icon', 32, 32, function (g, W, H) {
            g.fillStyle(0xFFFFFF, 0.85);
            g.fillRoundedRect(2, 2, W - 4, H - 4, 5);
            g.fillStyle(0x333333, 1);
            g.fillRect(9, 8, 5, H - 16);
            g.fillRect(18, 8, 5, H - 16);
        });
    },

    _makeMissionIcon: function (scene) {
        UIGraphics._rt(scene, 'mission_icon', 28, 28, function (g, W, H) {
            g.fillStyle(0xFFD700, 1);
            g.fillRoundedRect(2, 2, W - 4, H - 4, 4);
            g.fillStyle(0xCC9900, 1);
            // Checkmark
            g.lineStyle(3, 0xCC9900, 1);
            g.strokeLineShape(new Phaser.Geom.Line(6, H / 2, W / 2 - 2, H - 8));
            g.strokeLineShape(new Phaser.Geom.Line(W / 2 - 2, H - 8, W - 6, 7));
        });
    }
};
