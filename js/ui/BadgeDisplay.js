// Animated badge earned popup (attached to HUDScene or current scene)
var BadgeDisplay = {
    _scene: null,

    setScene: function (scene) {
        this._scene = scene;
    },

    show: function (missionName, icon) {
        var scene = this._scene;
        if (!scene) return;

        var W = CONSTANTS.WIDTH;
        var x = W / 2;
        var y = 100;

        var bg = scene.add.graphics();
        bg.fillStyle(0xFFB347, 0.95);
        bg.fillRoundedRect(x - 150, y - 30, 300, 60, 14);
        bg.lineStyle(3, 0xCC8822, 1);
        bg.strokeRoundedRect(x - 150, y - 30, 300, 60, 14);
        bg.setScrollFactor(0).setDepth(50).setAlpha(0);

        var iconText = scene.add.text(x - 120, y, (icon || '🏅'), {
            fontFamily: 'Nunito, sans-serif',
            fontSize: '28px'
        }).setOrigin(0, 0.5).setScrollFactor(0).setDepth(51).setAlpha(0);

        var label = scene.add.text(x - 80, y - 10, 'Mission Complete!', {
            fontFamily: 'Nunito, sans-serif',
            fontSize: '13px',
            fontStyle: 'bold',
            color: '#FFFFFF',
            stroke: '#AA5500',
            strokeThickness: 2
        }).setScrollFactor(0).setDepth(51).setAlpha(0);

        var name = scene.add.text(x - 80, y + 8, missionName, {
            fontFamily: 'Nunito, sans-serif',
            fontSize: '16px',
            fontStyle: 'bold',
            color: '#FFE8C0'
        }).setScrollFactor(0).setDepth(51).setAlpha(0);

        var targets = [bg, iconText, label, name];

        // Slide in from top
        bg.y -= 50;
        iconText.y -= 50;
        label.y -= 50;
        name.y -= 50;

        scene.tweens.add({
            targets: targets,
            y: '+=50',
            alpha: 1,
            duration: 400,
            ease: 'Back.easeOut',
            onComplete: function () {
                scene.time.delayedCall(2500, function () {
                    scene.tweens.add({
                        targets: targets,
                        alpha: 0,
                        y: '-=30',
                        duration: 400,
                        onComplete: function () {
                            targets.forEach(function (t) { t.destroy(); });
                        }
                    });
                });
            }
        });

        AudioManager && AudioManager.playBadge && AudioManager.playBadge();
    }
};
