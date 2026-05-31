// Base enemy class — patrol + stomp detection
var Enemy = class extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, textureKey, enemyType) {
        super(scene, x, y, textureKey);
        this.enemyType = enemyType || 'germ';
        this._alive = true;
        this._patrolSpeed = 80;
        this._patrolRange = 200;
        this._startX = x;
        this._direction = 1;
        this._health = 1;

        scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(true);
        this.body.allowGravity = true;
    }

    update() {
        if (!this._alive) return;
        this._patrol();
    }

    _patrol() {
        this.body.setVelocityX(this._patrolSpeed * this._direction);

        if (this.x > this._startX + this._patrolRange) {
            this._direction = -1;
            this.setFlipX(true);
        } else if (this.x < this._startX - this._patrolRange) {
            this._direction = 1;
            this.setFlipX(false);
        }

        // Turn around at edges
        if (this.body.blocked.right) { this._direction = -1; this.setFlipX(true); }
        if (this.body.blocked.left)  { this._direction = 1;  this.setFlipX(false); }
    }

    // Returns true if player is stomping from above
    isBeingStomped(player) {
        return player.body.velocity.y > 50 && player.y < this.y - 10;
    }

    die(scene) {
        if (!this._alive) return;
        this._alive = false;

        // Death animation — spin and shrink
        scene.tweens.add({
            targets: this,
            scaleX: 0,
            scaleY: 0,
            angle: 360,
            alpha: 0,
            duration: 400,
            onComplete: function () { this.destroy(); },
            onCompleteScope: this
        });

        // Particle burst (simple visual)
        for (var i = 0; i < 5; i++) {
            var particle = scene.add.rectangle(
                this.x + Phaser.Math.Between(-15, 15),
                this.y + Phaser.Math.Between(-10, 10),
                6, 6, 0x32CD32
            );
            scene.tweens.add({
                targets: particle,
                x: particle.x + Phaser.Math.Between(-40, 40),
                y: particle.y - Phaser.Math.Between(20, 50),
                alpha: 0,
                duration: 500,
                onComplete: function () { particle.destroy(); }
            });
        }
    }

    get alive() { return this._alive; }
};
