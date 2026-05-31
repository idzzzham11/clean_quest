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

        this.add.text(W / 2, 32, '🏆  Leaderboard', {
            fontFamily: 'Nunito, sans-serif', fontSize: '32px', fontStyle: 'bold',
            color: '#FFD700', stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5);

        var board = SaveManager.getLeaderboard();

        if (board.length === 0) {
            this.add.text(W / 2, H / 2, 'No scores yet!\nPlay a level to get on the board.', {
                fontFamily: 'Nunito, sans-serif', fontSize: '20px', color: '#888888',
                align: 'center'
            }).setOrigin(0.5);
        } else {
            // Table header
            var headerY = 90;
            this.add.text(100, headerY, 'Rank', TextStyles.heading);
            this.add.text(220, headerY, 'Name', TextStyles.heading);
            this.add.text(500, headerY, 'Score', TextStyles.heading);
            this.add.text(700, headerY, 'Date', TextStyles.heading);

            var divLine = this.add.graphics();
            divLine.lineStyle(1, 0x444466, 1);
            divLine.strokeLineShape(new Phaser.Geom.Line(80, headerY + 22, W - 80, headerY + 22));

            var medals = ['🥇', '🥈', '🥉'];
            board.forEach(function (entry, i) {
                var rowY = headerY + 40 + i * 36;
                var rowBg = scene.add.graphics();
                rowBg.fillStyle(i % 2 === 0 ? 0x111133 : 0x0a0a22, 0.6);
                rowBg.fillRect(80, rowY - 12, W - 160, 32);

                var rankText = i < 3 ? medals[i] : (i + 1) + '.';
                scene.add.text(100, rowY, rankText, {
                    fontFamily: 'Nunito, sans-serif', fontSize: '18px', color: '#FFD700'
                });
                scene.add.text(220, rowY, entry.name || 'Hero', {
                    fontFamily: 'Nunito, sans-serif', fontSize: '16px', color: '#FFFFFF'
                });
                scene.add.text(500, rowY, entry.score.toLocaleString(), {
                    fontFamily: 'Nunito, sans-serif', fontSize: '16px', fontStyle: 'bold',
                    color: '#FFB347'
                });
                scene.add.text(700, rowY, entry.date || '', {
                    fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#888888'
                });
            });
        }

        // Clear button
        var clearBtn = this.add.text(W - 30, H - 30, 'Clear Scores', {
            fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#CC4444'
        }).setOrigin(1, 1).setInteractive({ useHandCursor: true });
        clearBtn.on('pointerdown', function () {
            if (window.confirm('Clear all leaderboard scores?')) {
                localStorage.removeItem('cleanquest_leaderboard');
                scene.scene.restart();
            }
        });

        // Back button
        this.add.text(30, H - 30, '← Back', {
            fontFamily: 'Nunito, sans-serif', fontSize: '16px', color: '#888888'
        }).setInteractive({ useHandCursor: true }).on('pointerdown', function () {
            scene.scene.start(CONSTANTS.SCENES.TITLE);
        });

        this.cameras.main.fadeIn(400);
    }
};
