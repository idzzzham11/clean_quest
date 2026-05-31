var SmellCloudEnemy = class extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y, 'smell_cloud', CONSTANTS.ENEMIES.SMELL_CLOUD);
        this._patrolSpeed = 60;
        this._patrolRange = 180;
        this._floatOffset = 0;
        this._floatSpeed = 2;
        this._baseY = y;
        this.body.allowGravity = false;
        this.body.setVelocityY(0);
    }

    update(time) {
        if (!this._alive) return;
        this._patrol();
        // Float up and down
        this._floatOffset = Math.sin(time * 0.002) * 20;
        this.y = this._baseY + this._floatOffset;
    }
};
