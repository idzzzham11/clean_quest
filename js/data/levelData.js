// Level tilemap data — each level longer and harder than the previous
var LevelData = (function () {
    var T = {
        _: 0,
        OF: 1,  SF: 11, KF: 21, CF: 31,
        PW: 60, SP: 13, PM: 62, PG: 61,
        DL: 50, LE: 53
    };

    function buildMap(cols, floor, platTile, platforms, doors, end) {
        var ROWS = 12;
        var map = [];
        for (var r = 0; r < ROWS; r++) {
            var row = [];
            for (var c = 0; c < cols; c++) { row.push(r >= 9 ? floor : 0); }
            map.push(row);
        }
        platforms.forEach(function (p) {
            p.cols.forEach(function (c) { map[p.row][c] = platTile; });
        });
        doors.forEach(function (d) { map[d.row][d.col] = T.DL; });
        map[end.row][end.col] = T.LE;
        return map;
    }

    // ── Level 1 ── 36 cols (1728px) ──────────────────────────────────────────
    // door col15=744px, exit col35=1704px
    // Clear zones: 544-944 (door), 1504-1728 (exit)
    var L1_MAP = buildMap(36, T.OF, T.PW,
        [
            { cols: [5, 6, 7],    row: 7 },
            { cols: [18, 19, 20], row: 6 },
            { cols: [28, 29, 30], row: 7 }
        ],
        [{ col: 15, row: 8 }],
        { col: 35, row: 8 }
    );
    var L1_ENEMIES = [
        { type: 'germ',        x: 280,  y: 410 },
        { type: 'smell_cloud', x: 420,  y: 410 },
        { type: 'germ',        x: 1050, y: 410 },
        { type: 'smell_cloud', x: 1200, y: 410 },
        { type: 'germ',        x: 1380, y: 410 }
    ];
    var L1_ITEMS = [
        { type: 'coin',          x: 140,  y: 395 },
        { type: 'coin',          x: 220,  y: 395 },
        { type: 'soap',          x: 360,  y: 395 },
        { type: 'coin',          x: 480,  y: 395 },
        { type: 'hygiene_star',  x: 1000, y: 395 },
        { type: 'coin',          x: 1100, y: 395 },
        { type: 'coin',          x: 1280, y: 395 },
        { type: 'uniform_clean', x: 1380, y: 395 }
    ];
    var L1_HAZARDS = [
        { type: 'dirty_cloud', x: 340,  y: 415 },
        { type: 'dirty_cloud', x: 1180, y: 415 }
    ];

    // ── Level 2 ── 48 cols (2304px) ──────────────────────────────────────────
    // doors col13=648, col30=1464, exit col47=2280
    // Clear zones: 448-848, 1264-1664, 2080-2304
    // hole col20-21 (between door1 and door2)
    var L2_MAP = buildMap(48, T.SF, T.SP,
        [
            { cols: [5, 6, 7],    row: 7 },
            { cols: [18, 19, 20], row: 6 },
            { cols: [35, 36, 37], row: 7 },
            { cols: [42, 43, 44], row: 6 }
        ],
        [
            { col: 13, row: 8 },
            { col: 30, row: 8 }
        ],
        { col: 47, row: 8 }
    );
    (function () {
        for (var r = 9; r <= 11; r++) {
            L2_MAP[r][23] = 0;
            L2_MAP[r][24] = 0;
        }
    })();
    // hole center=1128px, clear 978-1278. door2=1464px clear 1264-1664. exit=2280px clear 2080-2304
    var L2_ENEMIES = [
        { type: 'germ',        x: 200,  y: 410 },
        { type: 'smell_cloud', x: 340,  y: 410 },
        { type: 'germ',        x: 920,  y: 410 },
        { type: 'hair_monster',x: 1700, y: 410 },
        { type: 'smell_cloud', x: 1860, y: 410 },
        { type: 'germ',        x: 1980, y: 410 }
    ];
    var L2_ITEMS = [
        { type: 'coin',          x: 130,  y: 395 },
        { type: 'coin',          x: 220,  y: 395 },
        { type: 'soap',          x: 340,  y: 395 },
        { type: 'coin',          x: 480,  y: 395 },
        { type: 'hygiene_star',  x: 880,  y: 395 },
        { type: 'coin',          x: 1000, y: 395 },
        { type: 'coin',          x: 1720, y: 395 },
        { type: 'uniform_clean', x: 1860, y: 395 },
        { type: 'coin',          x: 1980, y: 395 }
    ];
    var L2_HAZARDS = [
        { type: 'dirty_cloud', x: 300,  y: 415 },
        { type: 'dirty_cloud', x: 900,  y: 415 },
        { type: 'dirty_cloud', x: 1780, y: 415 }
    ];

    // ── Level 3 ── 62 cols (2976px) ──────────────────────────────────────────
    // doors col13=648, col29=1416, col45=2184, exit col61=2952
    // Clear zones: 448-848, 1216-1616, 1984-2384, 2752-2976
    // holes col21-22, col37-38, col53-54
    var L3_MAP = buildMap(62, T.KF, T.PM,
        [
            { cols: [5, 6, 7],    row: 7 },
            { cols: [19, 20, 21], row: 6 },
            { cols: [35, 36, 37], row: 7 },
            { cols: [51, 52, 53], row: 6 }
        ],
        [
            { col: 13, row: 8 },
            { col: 29, row: 8 },
            { col: 45, row: 8 }
        ],
        { col: 61, row: 8 }
    );
    (function () {
        [[21,22],[37,38],[53,54]].forEach(function (pair) {
            for (var r = 9; r <= 11; r++) {
                L3_MAP[r][pair[0]] = 0;
                L3_MAP[r][pair[1]] = 0;
            }
        });
    })();
    // hole1 center=1056px clear 906-1206, hole2=1824 clear 1674-1974, hole3=2592 clear 2442-2742
    var L3_ENEMIES = [
        { type: 'germ',        x: 200,  y: 410 },
        { type: 'smell_cloud', x: 340,  y: 410 },
        { type: 'hair_monster',x: 920,  y: 410 },
        { type: 'germ',        x: 1050, y: 410 },
        { type: 'dirty_robot', x: 1700, y: 410 },
        { type: 'smell_cloud', x: 1840, y: 410 },
        { type: 'germ',        x: 2460, y: 410 },
        { type: 'hair_monster',x: 2600, y: 410 },
        { type: 'dirty_robot', x: 2760, y: 410 }
    ];
    var L3_ITEMS = [
        { type: 'coin',          x: 130,  y: 395 },
        { type: 'coin',          x: 220,  y: 395 },
        { type: 'soap',          x: 360,  y: 395 },
        { type: 'coin',          x: 480,  y: 395 },
        { type: 'hygiene_star',  x: 880,  y: 395 },
        { type: 'coin',          x: 1000, y: 395 },
        { type: 'coin',          x: 1680, y: 395 },
        { type: 'uniform_clean', x: 1840, y: 395 },
        { type: 'coin',          x: 2460, y: 395 },
        { type: 'hygiene_star',  x: 2600, y: 395 },
        { type: 'coin',          x: 2760, y: 395 },
        { type: 'coin',          x: 2880, y: 395 }
    ];
    var L3_HAZARDS = [
        { type: 'dirty_cloud', x: 300,  y: 415 },
        { type: 'dirty_cloud', x: 900,  y: 415 },
        { type: 'dirty_cloud', x: 1760, y: 415 },
        { type: 'dirty_cloud', x: 2560, y: 415 }
    ];

    // ── Level 4 ── 80 cols (3840px) ──────────────────────────────────────────
    // doors col13=648, col29=1416, col45=2184, col61=2952, exit col79=3816
    // Clear zones: 448-848, 1216-1616, 1984-2384, 2752-3152, 3616-3840
    // holes col21-22, col37-38, col53-54, col69-70, col75-76
    var L4_MAP = buildMap(80, T.CF, T.PG,
        [
            { cols: [5, 6, 7],    row: 7 },
            { cols: [19, 20, 21], row: 6 },
            { cols: [35, 36, 37], row: 7 },
            { cols: [51, 52, 53], row: 6 },
            { cols: [67, 68, 69], row: 7 }
        ],
        [
            { col: 13, row: 8 },
            { col: 29, row: 8 },
            { col: 45, row: 8 },
            { col: 61, row: 8 }
        ],
        { col: 79, row: 8 }
    );
    (function () {
        [[21,22],[37,38],[53,54],[69,70],[75,76]].forEach(function (pair) {
            for (var r = 9; r <= 11; r++) {
                L4_MAP[r][pair[0]] = 0;
                L4_MAP[r][pair[1]] = 0;
            }
        });
    })();
    var L4_ENEMIES = [
        { type: 'germ',        x: 180,  y: 410 },
        { type: 'smell_cloud', x: 320,  y: 410 },
        { type: 'hair_monster',x: 920,  y: 410 },
        { type: 'germ',        x: 1060, y: 410 },
        { type: 'dirty_robot', x: 1680, y: 410 },
        { type: 'smell_cloud', x: 1820, y: 410 },
        { type: 'germ',        x: 2460, y: 410 },
        { type: 'hair_monster',x: 2600, y: 410 },
        { type: 'dirty_robot', x: 3220, y: 410 },
        { type: 'smell_cloud', x: 3360, y: 410 },
        { type: 'germ',        x: 3480, y: 410 },
        { type: 'hair_monster',x: 3600, y: 410 },
        { type: 'dirty_robot', x: 3720, y: 410 }
    ];
    var L4_ITEMS = [
        { type: 'coin',          x: 110,  y: 395 },
        { type: 'coin',          x: 200,  y: 395 },
        { type: 'soap',          x: 320,  y: 395 },
        { type: 'coin',          x: 460,  y: 395 },
        { type: 'hygiene_star',  x: 880,  y: 395 },
        { type: 'coin',          x: 1000, y: 395 },
        { type: 'coin',          x: 1660, y: 395 },
        { type: 'uniform_clean', x: 1820, y: 395 },
        { type: 'coin',          x: 2460, y: 395 },
        { type: 'hygiene_star',  x: 2620, y: 395 },
        { type: 'coin',          x: 3220, y: 395 },
        { type: 'coin',          x: 3380, y: 395 },
        { type: 'uniform_clean', x: 3500, y: 395 },
        { type: 'hygiene_star',  x: 3620, y: 395 },
        { type: 'coin',          x: 3740, y: 395 }
    ];
    var L4_HAZARDS = [
        { type: 'dirty_cloud', x: 280,  y: 415 },
        { type: 'dirty_cloud', x: 940,  y: 415 },
        { type: 'dirty_cloud', x: 1760, y: 415 },
        { type: 'dirty_cloud', x: 2560, y: 415 },
        { type: 'dirty_cloud', x: 3300, y: 415 },
        { type: 'dirty_cloud', x: 3560, y: 415 }
    ];

    return {
        level1: { map: L1_MAP, enemies: L1_ENEMIES, items: L1_ITEMS, hazards: L1_HAZARDS, doorsRequired: 1 },
        level2: { map: L2_MAP, enemies: L2_ENEMIES, items: L2_ITEMS, hazards: L2_HAZARDS, doorsRequired: 2 },
        level3: { map: L3_MAP, enemies: L3_ENEMIES, items: L3_ITEMS, hazards: L3_HAZARDS, doorsRequired: 3 },
        level4: { map: L4_MAP, enemies: L4_ENEMIES, items: L4_ITEMS, hazards: L4_HAZARDS, doorsRequired: 4 }
    };
})();
