// Static hazard item (oil spill, dirty cloud, etc.)
var HazardItem = class extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, hazardType) {
        var texKey = hazardType || 'oil_spill';
        super(scene, x, y, texKey);
        this.hazardType = hazardType || CONSTANTS.HAZARDS.OIL_SPILL;

        scene.add.existing(this);
        scene.physics.add.existing(this, true);
        this.body.setSize(this.width * 0.85, this.height * 0.7);

        // Floating hazards pulse
        if (hazardType === CONSTANTS.HAZARDS.DIRTY_CLOUD || hazardType === CONSTANTS.HAZARDS.GERM_PATCH) {
            scene.tweens.add({
                targets: this,
                alpha: 0.6,
                duration: 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }
};
