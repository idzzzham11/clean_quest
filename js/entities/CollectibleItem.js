// Collectible item with bobbing animation
var CollectibleItem = class extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, itemType) {
        var texKey = itemType || 'coin';
        super(scene, x, y, texKey);
        this.itemType = itemType || CONSTANTS.ITEMS.COIN;
        this._baseY = y;
        this._bobSpeed = 2 + Math.random() * 0.5;
        this._bobOffset = Math.random() * Math.PI * 2;
        this._collected = false;

        // Add to display list
        scene.add.existing(this);

        // Physics body for overlap detection
        scene.physics.add.existing(this, true); // true = static
        this.body.setSize(this.width * 0.8, this.height * 0.8);
    }

    update(time) {
        if (this._collected) return;
        // Bob up and down
        this.y = this._baseY + Math.sin(time * 0.003 * this._bobSpeed + this._bobOffset) * 5;
    }

    collect(scene) {
        if (this._collected) return;
        this._collected = true;

        // Collection animation — float up and fade
        scene.tweens.add({
            targets: this,
            y: this.y - 40,
            alpha: 0,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 350,
            ease: 'Power1',
            onComplete: function () { this.destroy(); },
            onCompleteScope: this
        });

        // Score popup text
        var scoreText = scene.add.text(this.x, this.y - 20, '+10', {
            fontFamily: 'Nunito, sans-serif',
            fontSize: '16px',
            fontStyle: 'bold',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        scene.tweens.add({
            targets: scoreText,
            y: scoreText.y - 30,
            alpha: 0,
            duration: 700,
            onComplete: function () { scoreText.destroy(); }
        });
    }

    get collected() { return this._collected; }
};
