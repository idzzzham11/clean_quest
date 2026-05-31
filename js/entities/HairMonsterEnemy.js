var HairMonsterEnemy = class extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y, 'hair_monster', CONSTANTS.ENEMIES.HAIR_MONSTER);
        this._patrolSpeed = 70;
        this._patrolRange = 200;
        this._jumpTimer = 0;
        this._jumpInterval = 2500;
    }

    update(delta) {
        if (!this._alive) return;
        this._patrol();

        // Periodic jump attack
        this._jumpTimer += delta;
        if (this._jumpTimer >= this._jumpInterval && this.body.blocked.down) {
            this._jumpTimer = 0;
            this.body.setVelocityY(-350);
        }
    }
};
