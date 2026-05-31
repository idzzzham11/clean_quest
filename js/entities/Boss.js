// Base boss class with 3-phase health system
var Boss = class extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, textureKey, bossType, maxHits) {
        super(scene, x, y, textureKey);
        this.bossType = bossType;
        this._maxHits = maxHits || 5;
        this._hits = 0;
        this._phase = 1;
        this._alive = true;
        this._invincible = false;
        this._invincibleTimer = 0;
        this._direction = -1;

        scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(true);
        this.setScale(1.5);

        this._createHealthBar(scene);
    }

    _createHealthBar(scene) {
        var barW = 200;
        var barH = 16;

        this._hpBarBg = scene.add.rectangle(
            CONSTANTS.WIDTH / 2, 30, barW, barH, 0x333333
        ).setScrollFactor(0).setDepth(10);

        this._hpBar = scene.add.rectangle(
            CONSTANTS.WIDTH / 2 - barW / 2, 30, barW, barH, 0xFF4444
        ).setScrollFactor(0).setDepth(11).setOrigin(0, 0.5);

        this._hpBarBg.y = 30;
        this._hpBar.y = 30;

        this._hpLabel = scene.add.text(CONSTANTS.WIDTH / 2, 48, '', {
            fontFamily: 'Nunito, sans-serif',
            fontSize: '13px',
            color: '#FF8888',
            stroke: '#000000',
            strokeThickness: 2
        }).setScrollFactor(0).setDepth(11).setOrigin(0.5);
    }

    _updateHealthBar() {
        var ratio = 1 - (this._hits / this._maxHits);
        var barW = 200;
        this._hpBar.width = barW * Math.max(0, ratio);
        var color = ratio > 0.66 ? 0x44FF44 : ratio > 0.33 ? 0xFFFF00 : 0xFF4444;
        this._hpBar.setFillStyle(color);

        var phaseName = ['', 'Phase 1', 'Phase 2', 'Phase 3'];
        this._hpLabel.setText(this._getBossName() + ' — ' + phaseName[this._phase]);
    }

    _getBossName() {
        var names = {
            germ_monster: 'Giant Germ Monster',
            smelly_fog: 'Smelly Fog Boss',
            hair_creature: 'Messy Hair Creature',
            dirty_robot: 'Dirty Uniform Robot',
            final_boss: 'Final Hygiene Master'
        };
        return names[this.bossType] || 'Boss';
    }

    takehit(scene) {
        if (this._invincible || !this._alive) return false;

        this._hits++;
        this._updateHealthBar();
        this._invincible = true;
        this._invincibleTimer = 1000;

        // Flash
        this.setTint(0xFFFFFF);
        scene.time.delayedCall(200, function () {
            this.clearTint();
            this._invincible = false;
        }, [], this);

        // Phase transitions
        var ratio = this._hits / this._maxHits;
        if (ratio >= 0.66 && this._phase === 1) {
            this._phase = 2;
            this._onPhaseChange(scene, 2);
        } else if (ratio >= 0.33 && this._phase === 2) {
            this._phase = 3;
            this._onPhaseChange(scene, 3);
        }

        if (this._hits >= this._maxHits) {
            this._die(scene);
            return true;
        }

        AudioManager && AudioManager.playBossHit && AudioManager.playBossHit();
        return false;
    }

    _onPhaseChange(scene, phase) {
        // Screen shake
        scene.cameras.main.shake(300, 0.02);
        // Speed up on each phase
        if (this.body) this.body.setVelocityX(this._direction * (80 + phase * 40));
    }

    _die(scene) {
        this._alive = false;
        this.body.setVelocity(0, 0);

        // Death animation
        scene.tweens.add({
            targets: this,
            angle: 720,
            scaleX: 0,
            scaleY: 0,
            alpha: 0,
            duration: 1200,
            ease: 'Power2'
        });

        scene.tweens.add({
            targets: [this._hpBar, this._hpBarBg, this._hpLabel],
            alpha: 0,
            duration: 800
        });

        // Explosion particles
        for (var i = 0; i < 12; i++) {
            var p = scene.add.rectangle(
                this.x + Phaser.Math.Between(-40, 40),
                this.y + Phaser.Math.Between(-30, 30),
                10, 10,
                [0xFF4444, 0xFFFF00, 0x44FF44, 0xFFFFFF][i % 4]
            );
            scene.tweens.add({
                targets: p,
                x: p.x + Phaser.Math.Between(-80, 80),
                y: p.y - Phaser.Math.Between(40, 120),
                alpha: 0,
                duration: 800 + i * 60,
                onComplete: function () { p.destroy(); }
            });
        }

        AudioManager && AudioManager.playBossDie && AudioManager.playBossDie();

        // Notify scene after delay
        scene.time.delayedCall(1800, function () {
            GameState.emit('bossDefeated', { bossType: this.bossType });
        }, [], this);
    }

    get alive() { return this._alive; }
    get phase() { return this._phase; }

    isBeingStomped(player) {
        return player.body.velocity.y > 50 && player.y < this.y - 20 && !this._invincible;
    }
};
