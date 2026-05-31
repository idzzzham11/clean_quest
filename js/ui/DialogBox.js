// Phaser-based speech bubble / tip dialog
var DialogBox = class {
    constructor(scene, x, y, text, options) {
        var opts = options || {};
        var padding = opts.padding || 12;
        var maxWidth = opts.maxWidth || 300;
        var bgColor = opts.bgColor || 0xFFF8F0;
        var borderColor = opts.borderColor || 0xFFB347;
        var duration = opts.duration || 3000;

        var style = {
            fontFamily: 'Nunito, sans-serif',
            fontSize: opts.fontSize || '14px',
            color: opts.color || '#2d2d2d',
            wordWrap: { width: maxWidth - padding * 2 }
        };

        this._text = scene.add.text(x + padding, y + padding, text, style);
        this._text.setScrollFactor(opts.scrollFactor !== undefined ? opts.scrollFactor : 0);

        var bw = this._text.width + padding * 2;
        var bh = this._text.height + padding * 2;

        this._bg = scene.add.graphics();
        this._bg.fillStyle(bgColor, 0.95);
        this._bg.fillRoundedRect(x, y, bw, bh, 8);
        this._bg.lineStyle(2, borderColor, 1);
        this._bg.strokeRoundedRect(x, y, bw, bh, 8);
        this._bg.setScrollFactor(style.wordWrap ? 0 : 1);

        this._bg.setDepth(20);
        this._text.setDepth(21);

        if (duration > 0) {
            scene.time.delayedCall(duration, function () { this.destroy(); }, [], this);
        }
    }

    destroy() {
        if (this._bg) { this._bg.destroy(); this._bg = null; }
        if (this._text) { this._text.destroy(); this._text = null; }
    }
};
