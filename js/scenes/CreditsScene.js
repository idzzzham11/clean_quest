var CreditsScene = class extends Phaser.Scene {
    constructor() {
        super({ key: CONSTANTS.SCENES.CREDITS });
    }

    create() {
        var W = CONSTANTS.WIDTH, H = CONSTANTS.HEIGHT;
        var scene = this;

        var bg = this.add.graphics();
        bg.fillGradientStyle(0x000011, 0x000011, 0x001122, 0x001122, 1);
        bg.fillRect(0, 0, W, H);

        var lines = [
            { text: 'CleanQuest: Workplace Hero', style: 'title', y: 0 },
            { text: '', y: 30 },
            { text: 'About This Game', style: 'heading', y: 30 },
            { text: 'An educational 2D platformer teaching', style: 'body', y: 10 },
            { text: 'Amalan Kebersihan dan Penampilan Diri di Tempat Kerja', style: 'body', y: 5 },
            { text: 'for secondary school and vocational students.', style: 'body', y: 5 },
            { text: '', y: 30 },
            { text: 'Learning Objectives', style: 'heading', y: 0 },
            { text: '• Understand proper workplace hygiene habits', style: 'tip', y: 5 },
            { text: '• Learn professional appearance standards', style: 'tip', y: 5 },
            { text: '• Practice personal grooming ethics', style: 'tip', y: 5 },
            { text: '• Understand hygiene responsibilities', style: 'tip', y: 5 },
            { text: '• Build confidence through knowledge', style: 'tip', y: 5 },
            { text: '', y: 30 },
            { text: 'Game Design', style: 'heading', y: 0 },
            { text: 'Inspired by classic Mario-style platformers', style: 'body', y: 5 },
            { text: 'Built with Phaser 3 — HTML5 Canvas Game Framework', style: 'body', y: 5 },
            { text: 'Procedural graphics — no external assets', style: 'body', y: 5 },
            { text: 'Responsive design — desktop and mobile', style: 'body', y: 5 },
            { text: '', y: 30 },
            { text: 'Target Audience', style: 'heading', y: 0 },
            { text: 'Secondary school students (Form 4-5)', style: 'body', y: 5 },
            { text: 'Vocational college students', style: 'body', y: 5 },
            { text: 'Workplace training programs', style: 'body', y: 5 },
            { text: '', y: 40 },
            { text: '✨ Thank you for playing! ✨', style: 'title', y: 0 },
            { text: 'Keep yourself clean and professional!', style: 'body', y: 10 }
        ];

        var styleMap = {
            title: { fontFamily: 'Nunito, sans-serif', fontSize: '28px', fontStyle: 'bold', color: '#FFD700', stroke: '#000000', strokeThickness: 3 },
            heading: { fontFamily: 'Nunito, sans-serif', fontSize: '20px', fontStyle: 'bold', color: '#FFB347' },
            body: { fontFamily: 'Nunito, sans-serif', fontSize: '15px', color: '#CCCCCC' },
            tip: { fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: '#88CCFF' }
        };

        // Build scrolling container
        var container = this.add.container(W / 2, H + 20);
        var currentY = 0;

        lines.forEach(function (line) {
            currentY += line.y || 0;
            var style = styleMap[line.style] || styleMap.body;
            var text = scene.add.text(0, currentY, line.text, style).setOrigin(0.5, 0);
            container.add(text);
            currentY += (parseInt(style.fontSize) || 16) + 8;
        });

        var totalHeight = currentY + 100;

        // Scroll animation
        this.tweens.add({
            targets: container,
            y: -totalHeight,
            duration: totalHeight * 30,
            ease: 'Linear',
            onComplete: function () {
                scene.scene.start(CONSTANTS.SCENES.TITLE);
            }
        });

        // Skip button
        this.input.on('pointerdown', function () {
            scene.scene.start(CONSTANTS.SCENES.TITLE);
        });

        this.add.text(W - 20, 20, 'Tap to skip →', {
            fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#666666'
        }).setOrigin(1, 0);

        this.cameras.main.fadeIn(600);
    }
};
