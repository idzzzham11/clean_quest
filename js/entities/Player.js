// Player entity — state machine + physics + animations
var Player = class extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, costume) {
        var textureKey = costume ? 'player_' + costume + '_idle' : 'player_idle';
        super(scene, x, y, textureKey);

        this.costume = costume || 'default';
        this._state = 'IDLE';
        this._health = CONSTANTS.PLAYER_MAX_HEALTH;
        this._invincible = false;
        this._invincibleTimer = 0;
        this._coyoteTimer = 0;
        this._jumpBufferTimer = 0;
        this._facingRight = true;

        // Setup physics body
        scene.physics.add.existing(this);
        this.body.setSize(24, 44);
        this.body.setOffset(4, 4);
        this.body.setMaxVelocityY(CONSTANTS.MAX_FALL_SPEED);

        this._setupAnimations(scene);
        this._inputState = { left: false, right: false, jump: false, jumpJustPressed: false };
    }

    _setupAnimations(scene) {
        var prefix = this.costume === 'default' ? 'player' : 'player_' + this.costume;

        var anims = scene.anims;

        if (!anims.exists(prefix + '_idle_anim')) {
            anims.create({
                key: prefix + '_idle_anim',
                frames: [{ key: prefix + '_idle' }],
                frameRate: 1,
                repeat: -1
            });
        }
        if (!anims.exists(prefix + '_run_anim')) {
            anims.create({
                key: prefix + '_run_anim',
                frames: [
                    { key: prefix + '_run1' },
                    { key: prefix + '_run2' },
                    { key: prefix + '_run3' },
                    { key: prefix + '_run2' }
                ],
                frameRate: 10,
                repeat: -1
            });
        }
        if (!anims.exists(prefix + '_jump_anim')) {
            anims.create({
                key: prefix + '_jump_anim',
                frames: [{ key: prefix + '_jump' }],
                frameRate: 1
            });
        }
        if (!anims.exists(prefix + '_hurt_anim')) {
            anims.create({
                key: prefix + '_hurt_anim',
                frames: [{ key: prefix + '_hurt' }],
                frameRate: 1
            });
        }
        if (!anims.exists(prefix + '_dead_anim')) {
            anims.create({
                key: prefix + '_dead_anim',
                frames: [{ key: prefix + '_dead' }],
                frameRate: 1
            });
        }

        this._animPrefix = prefix;
    }

    update(cursors, mobileInput, delta) {
        if (this._state === 'DEAD') return;

        var onGround = this.body.blocked.down;
        var left = (cursors && cursors.left.isDown) || (mobileInput && mobileInput.left);
        var right = (cursors && cursors.right.isDown) || (mobileInput && mobileInput.right);
        var jump = (cursors && Phaser.Input.Keyboard.JustDown(cursors.up)) ||
                   (cursors && Phaser.Input.Keyboard.JustDown(cursors.space)) ||
                   (mobileInput && mobileInput.jumpJustPressed);

        // Update timers
        if (onGround) {
            this._coyoteTimer = CONSTANTS.COYOTE_TIME;
        } else {
            this._coyoteTimer = Math.max(0, this._coyoteTimer - delta);
        }

        if (jump) {
            this._jumpBufferTimer = CONSTANTS.JUMP_BUFFER;
        } else {
            this._jumpBufferTimer = Math.max(0, this._jumpBufferTimer - delta);
        }

        // Invincibility
        if (this._invincible) {
            this._invincibleTimer -= delta;
            if (this._invincibleTimer <= 0) {
                this._invincible = false;
                this.clearTint();
            } else {
                // Flash effect
                this.setAlpha(Math.sin(this._invincibleTimer * 0.02) > 0 ? 1 : 0.3);
            }
        }

        if (this._state === 'HURT') return;

        // Horizontal movement
        if (left) {
            this.body.setVelocityX(-CONSTANTS.PLAYER_SPEED);
            this._facingRight = false;
            this.setFlipX(true);
        } else if (right) {
            this.body.setVelocityX(CONSTANTS.PLAYER_SPEED);
            this._facingRight = true;
            this.setFlipX(false);
        } else {
            this.body.setVelocityX(0);
        }

        // Jump
        if (this._jumpBufferTimer > 0 && this._coyoteTimer > 0) {
            this.body.setVelocityY(CONSTANTS.JUMP_VELOCITY);
            this._coyoteTimer = 0;
            this._jumpBufferTimer = 0;
            AudioManager && AudioManager.playJump && AudioManager.playJump();
        }

        // State transitions
        if (!onGround) {
            this._state = this.body.velocity.y < 0 ? 'JUMPING' : 'FALLING';
        } else if (left || right) {
            this._state = 'RUNNING';
        } else {
            this._state = 'IDLE';
        }

        this._updateAnimation();
    }

    _updateAnimation() {
        var p = this._animPrefix;
        switch (this._state) {
            case 'IDLE':    this.play(p + '_idle_anim', true); break;
            case 'RUNNING': this.play(p + '_run_anim', true); break;
            case 'JUMPING': this.play(p + '_jump_anim', true); break;
            case 'FALLING': this.play(p + '_jump_anim', true); break;
            case 'HURT':    this.play(p + '_hurt_anim', true); break;
            case 'DEAD':    this.play(p + '_dead_anim', true); break;
        }
    }

    takeDamage(amount, sourceX) {
        if (this._invincible || this._state === 'DEAD') return;

        this._health -= (amount || 1);
        GameState.takeDamage(amount || 1);
        AudioManager && AudioManager.playHurt && AudioManager.playHurt();

        if (this._health <= 0) {
            this._die();
            return;
        }

        // Knockback
        var direction = (sourceX !== undefined && sourceX < this.x) ? 1 : -1;
        this.body.setVelocityX(direction * 200);
        this.body.setVelocityY(-200);

        this._state = 'HURT';
        this.setTint(0xFF6666);
        this._invincible = true;
        this._invincibleTimer = CONSTANTS.INVINCIBILITY_DURATION;

        // Exit hurt state after 600ms
        this.scene.time.delayedCall(600, function () {
            if (this._state === 'HURT') this._state = 'IDLE';
        }, [], this);
    }

    _die() {
        this._state = 'DEAD';
        this._updateAnimation();
        this.body.setVelocityX(0);
        this.body.setVelocityY(-300);
        this.setTint(0xFF4444);

        this.scene.time.delayedCall(1200, function () {
            GameState.emit('playerDied');
        }, [], this);
    }

    stomp(enemy) {
        this.body.setVelocityY(CONSTANTS.STOMP_BOUNCE);
        GameState.enemyDefeated(enemy.enemyType || 'germ');
        GameState.addScore(CONSTANTS.STOMP_BONUS);
        AudioManager && AudioManager.playStompEnemy && AudioManager.playStompEnemy();
    }

    collect(item) {
        GameState.collectItem(item.itemType);
        if (item.itemType === CONSTANTS.ITEMS.COIN) {
            GameState.addCoins(1);
        } else if (item.itemType === CONSTANTS.ITEMS.HYGIENE_STAR) {
            GameState.addHygieneStar();
        } else {
            GameState.addScore(30);
        }
        AudioManager && AudioManager.playCollect && AudioManager.playCollect();
    }

    get health() { return this._health; }
    get isDead() { return this._state === 'DEAD'; }
    get state() { return this._state; }
};
