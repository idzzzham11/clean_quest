var DirtyRobotEnemy = class extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y, 'dirty_robot', CONSTANTS.ENEMIES.DIRTY_ROBOT);
        this._patrolSpeed = 100;
        this._patrolRange = 220;
        this._chargeTimer = 0;
        this._chargeInterval = 3000;
        this._charging = false;
    }

    update(delta) {
        if (!this._alive) return;

        this._chargeTimer += delta;
        if (this._chargeTimer >= this._chargeInterval) {
            this._chargeTimer = 0;
            this._charging = true;
            this.body.setVelocityX(this._direction * 280);
            this.scene.time.delayedCall(600, function () {
                this._charging = false;
            }, [], this);
        }

        if (!this._charging) {
            this._patrol();
        }
    }
};
