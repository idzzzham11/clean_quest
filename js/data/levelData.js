// Level tilemap data — 25 cols x 12 rows = 1200px x 576px each
var LevelData = (function () {
    var T = {
        _: 0,
        OF: 1,  SF: 11, KF: 21, CF: 31, HF: 41,
        PW: 60, SP: 13, PM: 62, PG: 61, HP: 43,
        DL: 50, LE: 53
    };

    // Build a simple flat level: ground at rows 9-11, two platforms, 1 door, level end
    function build(floor, platTile) {
        var COLS = 25, ROWS = 12;
        var map = [];
        for (var r = 0; r < ROWS; r++) {
            var row = [];
            for (var c = 0; c < COLS; c++) {
                row.push(r >= 9 ? floor : 0);
            }
            map.push(row);
        }
        // Platform 1: cols 6-8 at row 6
        [6, 7, 8].forEach(function (c) { map[6][c] = platTile; });
        // Platform 2: cols 14-16 at row 7
        [14, 15, 16].forEach(function (c) { map[7][c] = platTile; });
        // Door (quiz) at col 20, row 8
        map[8][20] = T.DL;
        // Level end at col 24, row 8
        map[8][24] = T.LE;
        return map;
    }

    // 3 enemies spread across 1200px
    // Ground surface y = row9 * 48 = 432; enemy standing y ≈ 410
    var ENEMIES = [
        { type: 'germ',        x: 250,  y: 410 },
        { type: 'smell_cloud', x: 550,  y: 380 },
        { type: 'germ',        x: 820,  y: 410 }
    ];

    // Items scattered across level
    var ITEMS = [
        { type: 'coin',          x: 150,  y: 390 },
        { type: 'coin',          x: 200,  y: 390 },
        { type: 'soap',          x: 380,  y: 390 },
        { type: 'hygiene_star',  x: 660,  y: 350 },
        { type: 'coin',          x: 900,  y: 390 },
        { type: 'uniform_clean', x: 1050, y: 390 }
    ];

    // 2 hazards
    var HAZARDS = [
        { type: 'oil_spill',   x: 320, y: 428 },
        { type: 'dirty_cloud', x: 700, y: 400 }
    ];

    return {
        level1: { map: build(T.OF, T.PW), enemies: ENEMIES, items: ITEMS, hazards: HAZARDS },
        level2: { map: build(T.SF, T.SP), enemies: ENEMIES, items: ITEMS, hazards: HAZARDS },
        level3: { map: build(T.KF, T.PM), enemies: ENEMIES, items: ITEMS, hazards: HAZARDS },
        level4: { map: build(T.CF, T.PG), enemies: ENEMIES, items: ITEMS, hazards: HAZARDS },
        level5: { map: build(T.HF, T.HP), enemies: ENEMIES, items: ITEMS, hazards: HAZARDS }
    };
})();
