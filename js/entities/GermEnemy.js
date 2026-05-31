var GermEnemy = class extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y, 'germ', CONSTANTS.ENEMIES.GERM);
        this._patrolSpeed = 90;
        this._patrolRange = 160;
        this._bounceTimer = 0;
        this._bounceInterval = 1500;
    }

    update(delta) {
        if (!this._alive) return;
        this._patrol();

        // Occasional small bounce
        this._bounceTimer += delta;
        if (this._bounceTimer >= this._bounceInterval) {
            this._bounceTimer = 0;
            this.body.setVelocityY(-180);
        }
    }
};
