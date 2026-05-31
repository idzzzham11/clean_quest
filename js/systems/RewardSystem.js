// Badge and certificate reward generation
var RewardSystem = {
    calculateStars: function (score, coinsCollected, hygieneStars, quizPassed, noDamage) {
        var stars = 0;
        if (score >= 500) stars++;
        if (coinsCollected >= 10 || hygieneStars >= 3) stars++;
        if (quizPassed && noDamage) stars++;
        return Math.min(3, stars);
    },

    // Displays a certificate as a DOM overlay (not rendered to canvas texture)
    showCertificate: function (scene, levelNum, playerName, stars, onClose) {
        var W = CONSTANTS.WIDTH, H = CONSTANTS.HEIGHT;

        var overlay = scene.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.75)
            .setScrollFactor(0).setDepth(80).setInteractive();

        var certBg = scene.add.graphics();
        certBg.fillStyle(0xFFFBF0, 1);
        certBg.fillRoundedRect(W / 2 - 220, H / 2 - 155, 440, 310, 12);
        certBg.lineStyle(5, 0xC8A020, 1);
        certBg.strokeRoundedRect(W / 2 - 220, H / 2 - 155, 440, 310, 12);
        certBg.lineStyle(2, 0xC8A020, 0.4);
        certBg.strokeRoundedRect(W / 2 - 210, H / 2 - 145, 420, 290, 8);
        certBg.setScrollFactor(0).setDepth(81);

        var cx = W / 2;
        var labels = [
            scene.add.text(cx, H / 2 - 125, 'SIJIL KEBERSIHAN', { fontFamily: 'Nunito, sans-serif', fontSize: '20px', fontStyle: 'bold', color: '#C8A020' }).setOrigin(0.5).setScrollFactor(0).setDepth(82),
            scene.add.text(cx, H / 2 - 100, 'Certificate of Workplace Hygiene', { fontFamily: 'Nunito, sans-serif', fontSize: '12px', color: '#888888' }).setOrigin(0.5).setScrollFactor(0).setDepth(82),
            scene.add.text(cx, H / 2 - 68, 'This certifies that', { fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#555555' }).setOrigin(0.5).setScrollFactor(0).setDepth(82),
            scene.add.text(cx, H / 2 - 38, playerName || 'Workplace Hero', { fontFamily: 'Nunito, sans-serif', fontSize: '26px', fontStyle: 'bold', color: '#4169E1' }).setOrigin(0.5).setScrollFactor(0).setDepth(82),
            scene.add.text(cx, H / 2 - 4, 'has successfully completed', { fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#555555' }).setOrigin(0.5).setScrollFactor(0).setDepth(82),
            scene.add.text(cx, H / 2 + 28, CONSTANTS.LEVEL_NAMES[levelNum], { fontFamily: 'Nunito, sans-serif', fontSize: '17px', fontStyle: 'bold', color: '#2d2d2d' }).setOrigin(0.5).setScrollFactor(0).setDepth(82),
            scene.add.text(cx, H / 2 + 60, 'Amalan Kebersihan dan Penampilan Diri di Tempat Kerja', { fontFamily: 'Nunito, sans-serif', fontSize: '10px', color: '#888888' }).setOrigin(0.5).setScrollFactor(0).setDepth(82),
            scene.add.text(cx, H / 2 + 90, '★'.repeat(stars) + '☆'.repeat(3 - stars), { fontFamily: 'Nunito, sans-serif', fontSize: '22px', color: '#FFD700' }).setOrigin(0.5).setScrollFactor(0).setDepth(82),
            scene.add.text(cx, H / 2 + 116, new Date().toLocaleDateString(), { fontFamily: 'Nunito, sans-serif', fontSize: '11px', color: '#AAAAAA' }).setOrigin(0.5).setScrollFactor(0).setDepth(82)
        ];

        var closeBtn = scene.add.text(cx, H / 2 + 148, 'Close', {
            fontFamily: 'Nunito, sans-serif', fontSize: '16px', color: '#4169E1'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(82).setInteractive({ useHandCursor: true });

        closeBtn.on('pointerdown', function () {
            overlay.destroy(); certBg.destroy();
            labels.forEach(function (l) { l.destroy(); });
            closeBtn.destroy();
            if (onClose) onClose();
        });
    }
};
