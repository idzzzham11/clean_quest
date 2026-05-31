var BootScene = class extends Phaser.Scene {
    constructor() {
        super({ key: CONSTANTS.SCENES.BOOT });
    }

    preload() {
        // Show loading bar during texture generation
        var W = CONSTANTS.WIDTH;
        var H = CONSTANTS.HEIGHT;

        // Background
        this.cameras.main.setBackgroundColor('#1a1a2e');

        // Progress bar background
        this.add.rectangle(W / 2, H / 2 + 40, 400, 20, 0x333355).setOrigin(0.5);
        var bar = this.add.rectangle(W / 2 - 200, H / 2 + 40, 0, 18, 0xFFB347).setOrigin(0, 0.5);

        // Title text
        this.add.text(W / 2, H / 2 - 60, 'CleanQuest', {
            fontFamily: 'Nunito, sans-serif',
            fontSize: '48px',
            fontStyle: 'bold',
            color: '#FFB347',
            stroke: '#000000',
            strokeThickness: 5
        }).setOrigin(0.5);

        this.add.text(W / 2, H / 2 - 10, 'Workplace Hero', {
            fontFamily: 'Nunito, sans-serif',
            fontSize: '24px',
            color: '#AACCFF',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        // Loading tip
        var tipIndex = Math.floor(Math.random() * LoadingTips.length);
        var tipText = this.add.text(W / 2, H / 2 + 90, '"' + LoadingTips[tipIndex] + '"', {
            fontFamily: 'Nunito, sans-serif',
            fontSize: '14px',
            color: '#88BBFF',
            wordWrap: { width: 500 },
            align: 'center'
        }).setOrigin(0.5);

        var loadingLabel = this.add.text(W / 2, H / 2 + 20, 'Loading...', {
            fontFamily: 'Nunito, sans-serif',
            fontSize: '16px',
            color: '#FFFFFF'
        }).setOrigin(0.5);

        this.load.on('progress', function (value) {
            bar.width = 400 * value;
        });
    }

    create() {
        // Generate all textures procedurally
        this._generateTextures();

        // Short delay then go to title
        this.time.delayedCall(800, function () {
            this.scene.start(CONSTANTS.SCENES.TITLE);
        }, [], this);
    }

    _generateTextures() {
        // Graphics generators
        try { TileGraphics.generate(this); } catch (e) { console.warn('TileGraphics error:', e); }
        try { PlayerGraphics.generate(this); } catch (e) { console.warn('PlayerGraphics error:', e); }
        try { EnemyGraphics.generate(this); } catch (e) { console.warn('EnemyGraphics error:', e); }
        try { ItemGraphics.generate(this); } catch (e) { console.warn('ItemGraphics error:', e); }
        try { BackgroundGraphics.generate(this); } catch (e) { console.warn('BackgroundGraphics error:', e); }
        try { UIGraphics.generate(this); } catch (e) { console.warn('UIGraphics error:', e); }
    }
};
