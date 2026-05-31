// Generates player character textures procedurally
// All costumes based on uniform color + skin tone variants
var PlayerGraphics = {
    // Default customization (can be overridden by CharSelectScene)
    currentSkin: 0xFFDBAC,
    currentHair: 0x1C1C1C,
    currentUniform: 0x4169E1,

    generate: function (scene) {
        var skins = [0xFFDBAC, 0xF1C27D, 0xE0AC69, 0xC68642, 0x8D5524];
        var uniforms = [0x4169E1, 0xEE4444, 0x22AA22, 0xAA44AA, 0xFF8800];
        var hairs = [0x1C1C1C, 0x8B4513, 0xFFD700, 0xCC4444, 0x555555];

        // Generate default frames
        PlayerGraphics._generateFrames(scene, skins[0], uniforms[0], hairs[0], 'player');

        // Generate costume variants for each level/unlock
        var costumeNames = ['office', 'salon', 'kitchen', 'cs', 'hotel'];
        costumeNames.forEach(function (name, i) {
            PlayerGraphics._generateFrames(scene, skins[0], uniforms[i], hairs[0], 'player_' + name);
        });

        // Custom player texture (updated when player customizes)
        PlayerGraphics._generateFrames(
            scene,
            PlayerGraphics.currentSkin,
            PlayerGraphics.currentUniform,
            PlayerGraphics.currentHair,
            'player_custom'
        );
    },

    regenerateCustom: function (scene, skin, uniform, hair) {
        PlayerGraphics.currentSkin = skin;
        PlayerGraphics.currentUniform = uniform;
        PlayerGraphics.currentHair = hair;
        PlayerGraphics._generateFrames(scene, skin, uniform, hair, 'player_custom');
    },

    _generateFrames: function (scene, skinColor, uniformColor, hairColor, prefix) {
        // idle
        PlayerGraphics._drawFrame(scene, prefix + '_idle', skinColor, uniformColor, hairColor, 0, false);
        // run frames
        PlayerGraphics._drawFrame(scene, prefix + '_run1', skinColor, uniformColor, hairColor, 1, false);
        PlayerGraphics._drawFrame(scene, prefix + '_run2', skinColor, uniformColor, hairColor, 2, false);
        PlayerGraphics._drawFrame(scene, prefix + '_run3', skinColor, uniformColor, hairColor, 3, false);
        // jump
        PlayerGraphics._drawFrame(scene, prefix + '_jump', skinColor, uniformColor, hairColor, 4, false);
        // hurt
        PlayerGraphics._drawFrame(scene, prefix + '_hurt', skinColor, uniformColor, hairColor, 5, true);
        // dead
        PlayerGraphics._drawFrame(scene, prefix + '_dead', skinColor, uniformColor, hairColor, 6, true);
    },

    _drawFrame: function (scene, key, skinColor, uniformColor, hairColor, frame, tinted) {
        var W = 32;
        var H = 48;
        var rt = scene.add.renderTexture(0, 0, W, H);
        var g = scene.add.graphics();

        if (tinted) {
            // Flash white/red tint for hurt
            g.fillStyle(0xFF6666, 0.5);
            g.fillRect(0, 0, W, H);
        }

        // Body (torso) — uniform
        g.fillStyle(uniformColor, 1);
        g.fillRoundedRect(8, 20, 16, 18, 3);

        // Legs
        var legOffset = PlayerGraphics._getLegOffset(frame);
        g.fillStyle(0x333366, 1); // dark trousers
        // Left leg
        g.fillRoundedRect(8, 36, 6, 10 + legOffset.left, 2);
        // Right leg
        g.fillRoundedRect(16, 36, 6, 10 - legOffset.right, 2);

        // Shoes
        g.fillStyle(0x222222, 1);
        g.fillRoundedRect(6, 44 + legOffset.left, 8, 4, 2);
        g.fillRoundedRect(16, 44 - legOffset.right, 8, 4, 2);

        // Arms
        var armOffset = PlayerGraphics._getArmOffset(frame);
        g.fillStyle(skinColor, 1);
        // Left arm
        g.fillRoundedRect(3, 20 + armOffset.left, 6, 14, 2);
        // Right arm
        g.fillRoundedRect(23, 20 + armOffset.right, 6, 14, 2);

        // Uniform collar/badge
        g.fillStyle(0xFFFFFF, 0.5);
        g.fillRect(12, 20, 8, 3);
        // Name badge
        g.fillStyle(0xFFFFFF, 0.8);
        g.fillRoundedRect(10, 24, 12, 7, 1);
        g.fillStyle(uniformColor, 0.6);
        g.fillRect(11, 26, 10, 1);
        g.fillRect(11, 28, 7, 1);

        // Head
        g.fillStyle(skinColor, 1);
        g.fillCircle(W / 2, 14, 12);

        // Hair
        g.fillStyle(hairColor, 1);
        if (frame === 6) {
            // Dead — spiky
            g.fillTriangle(W / 2 - 8, 8, W / 2, 2, W / 2 - 2, 10);
            g.fillTriangle(W / 2, 3, W / 2 + 4, 8, W / 2 + 8, 2);
        } else {
            // Normal hair — rounded top
            g.fillEllipse(W / 2, 8, 20, 12);
            g.fillRect(W / 2 - 10, 8, 20, 6);
        }

        // Eyes
        if (frame === 6) {
            // X eyes (dead)
            g.lineStyle(2, 0x333333, 1);
            g.strokeLineShape(new Phaser.Geom.Line(W / 2 - 6, 11, W / 2 - 2, 15));
            g.strokeLineShape(new Phaser.Geom.Line(W / 2 - 2, 11, W / 2 - 6, 15));
            g.strokeLineShape(new Phaser.Geom.Line(W / 2 + 2, 11, W / 2 + 6, 15));
            g.strokeLineShape(new Phaser.Geom.Line(W / 2 + 6, 11, W / 2 + 2, 15));
        } else if (frame === 5) {
            // Hurt — squinted
            g.fillStyle(0x333333, 1);
            g.fillEllipse(W / 2 - 4, 13, 4, 2);
            g.fillEllipse(W / 2 + 4, 13, 4, 2);
        } else if (frame === 4) {
            // Jump — wide eyes
            g.fillStyle(0xFFFFFF, 1);
            g.fillCircle(W / 2 - 4, 13, 4);
            g.fillCircle(W / 2 + 4, 13, 4);
            g.fillStyle(0x333333, 1);
            g.fillCircle(W / 2 - 4, 13, 2);
            g.fillCircle(W / 2 + 4, 13, 2);
        } else {
            // Normal eyes
            g.fillStyle(0xFFFFFF, 1);
            g.fillCircle(W / 2 - 4, 13, 3);
            g.fillCircle(W / 2 + 4, 13, 3);
            g.fillStyle(0x333333, 1);
            g.fillCircle(W / 2 - 4, 13, 1.5);
            g.fillCircle(W / 2 + 4, 13, 1.5);
        }

        // Smile
        if (frame !== 5 && frame !== 6) {
            g.lineStyle(1.5, 0x553322, 1);
            g.beginPath(); g.arc(W / 2, 16, 4, 0, Math.PI); g.strokePath();
        }

        rt.draw(g, 0, 0);
        rt.saveTexture(key);
        g.destroy();
        rt.destroy();
    },

    _getLegOffset: function (frame) {
        // Returns { left, right } pixel offsets for leg animation
        var offsets = [
            { left: 0, right: 0 },   // idle
            { left: -3, right: 3 },  // run1
            { left: 0, right: 0 },   // run2
            { left: 3, right: -3 },  // run3
            { left: -4, right: -4 }, // jump (tucked)
            { left: 0, right: 0 },   // hurt
            { left: 2, right: -2 }   // dead
        ];
        return offsets[frame] || offsets[0];
    },

    _getArmOffset: function (frame) {
        var offsets = [
            { left: 0, right: 0 },
            { left: 3, right: -3 },
            { left: 0, right: 0 },
            { left: -3, right: 3 },
            { left: -4, right: -4 }, // jump arms up
            { left: -2, right: 2 },
            { left: 2, right: -2 }
        ];
        return offsets[frame] || offsets[0];
    }
};
