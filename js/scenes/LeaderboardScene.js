var LeaderboardScene = class extends Phaser.Scene {
    constructor() {
        super({ key: CONSTANTS.SCENES.LEADERBOARD });
    }

    create() {
        var W = CONSTANTS.WIDTH, H = CONSTANTS.HEIGHT;
        var scene = this;

        var bg = this.add.graphics();
        bg.fillGradientStyle(0x0a0a1e, 0x0a0a1e, 0x1a1a3e, 0x1a1a3e, 1);
        bg.fillRect(0, 0, W, H);

        this.add.text(W / 2, 44, '🏆  Papan Kedudukan', {
            fontFamily: 'Nunito, sans-serif', fontSize: '44px', fontStyle: 'bold',
            color: '#FFD700', stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5);

        // Loading indicator
        var loadingText = this.add.text(W / 2, H / 2, 'Memuatkan...', {
            fontFamily: 'Nunito, sans-serif', fontSize: '26px', color: '#888888'
        }).setOrigin(0.5);

        // Back button
        this.add.text(30, H - 36, '← Back', {
            fontFamily: 'Nunito, sans-serif', fontSize: '24px', color: '#888888'
        }).setInteractive({ useHandCursor: true }).on('pointerdown', function () {
            scene.scene.start(CONSTANTS.SCENES.TITLE);
        });

        this.cameras.main.fadeIn(400);

        // Fetch from Supabase
        SupabaseService.getTopScores(function (data, err) {
            if (!scene.scene.isActive(CONSTANTS.SCENES.LEADERBOARD)) return;
            loadingText.destroy();

            if (err || !data || data.length === 0) {
                scene.add.text(W / 2, H / 2, err ? 'Gagal memuatkan.\nSemak sambungan internet.' : 'Tiada skor lagi!\nMain peringkat untuk masuk senarai.', {
                    fontFamily: 'Nunito, sans-serif', fontSize: '18px', color: '#888888',
                    align: 'center'
                }).setOrigin(0.5);
                return;
            }

            scene._drawTable(data);
        });
    }

    _drawTable(board) {
        var W = CONSTANTS.WIDTH;
        var scene = this;
        var headerY = 110;
        var rowH = 48;

        // Headers — 3 columns: Rank, Name, Score+Level
        var headerStyle = { fontFamily: 'Nunito, sans-serif', fontSize: '20px', fontStyle: 'bold', color: '#FFB347' };
        scene.add.text(60,       headerY, 'RANK',  headerStyle);
        scene.add.text(180,      headerY, 'NAMA',  headerStyle);
        scene.add.text(W - 60,   headerY, 'SKOR',  headerStyle).setOrigin(1, 0);

        var divLine = scene.add.graphics();
        divLine.lineStyle(2, 0x444466, 1);
        divLine.strokeLineShape(new Phaser.Geom.Line(40, headerY + 30, W - 40, headerY + 30));

        var medals = ['🥇', '🥈', '🥉'];

        board.forEach(function (entry, i) {
            var rowY = headerY + 50 + i * rowH;

            var rowBg = scene.add.graphics();
            rowBg.fillStyle(i % 2 === 0 ? 0x111133 : 0x0a0a22, 0.6);
            rowBg.fillRect(40, rowY - rowH / 2 + 4, W - 80, rowH - 4);

            var rankText = i < 3 ? medals[i] : (i + 1) + '.';
            scene.add.text(60, rowY, rankText, {
                fontFamily: 'Nunito, sans-serif', fontSize: '22px', color: '#FFD700'
            }).setOrigin(0, 0.5);

            scene.add.text(180, rowY, entry.name || 'Player 1', {
                fontFamily: 'Nunito, sans-serif', fontSize: '20px', color: '#FFFFFF'
            }).setOrigin(0, 0.5);

            scene.add.text(W - 60, rowY,
                (entry.score || 0).toLocaleString() + '  Lv.' + (entry.level || '?'), {
                fontFamily: 'Nunito, sans-serif', fontSize: '20px', fontStyle: 'bold', color: '#FFB347'
            }).setOrigin(1, 0.5);
        });
    }
};
