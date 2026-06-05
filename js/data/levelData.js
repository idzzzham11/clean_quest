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

    // ── Level 1: Office ── 30 cols (1440px) ──────────────────────────────────
    // 1 door at col 15, exit col 29
    var L1_MAP = buildMap(30, T.OF, T.PW,
        [
            { cols: [5, 6, 7],    row: 7 },
            { cols: [18, 19, 20], row: 6 },
            { cols: [25, 26, 27], row: 7 }
        ],
        [{ col: 15, row: 8 }],
        { col: 29, row: 8 }
    );
    var L1_ENEMIES = [
        { type: 'germ',        x: 280,  y: 410 },
        { type: 'smell_cloud', x: 600,  y: 410 },
        { type: 'germ',        x: 900,  y: 410 },
        { type: 'smell_cloud', x: 1200, y: 410 },
        { type: 'germ',        x: 1380, y: 410 }
    ];
    var L1_ITEMS = [
        { type: 'coin',          x: 140,  y: 395 },
        { type: 'coin',          x: 210,  y: 395 },
        { type: 'soap',          x: 360,  y: 395 },
        { type: 'coin',          x: 700,  y: 395 },
        { type: 'hygiene_star',  x: 980,  y: 395 },
        { type: 'coin',          x: 1050, y: 395 },
        { type: 'uniform_clean', x: 1300, y: 395 }
    ];
    var L1_HAZARDS = [
        { type: 'dirty_cloud', x: 500,  y: 415 },
        { type: 'dirty_cloud', x: 1200, y: 415 }
    ];

    // ── Level 2: Salon ── 40 cols (1920px) ───────────────────────────────────
    // 2 doors evenly: col 13 and col 26, exit col 39
    var L2_MAP = buildMap(40, T.SF, T.SP,
        [
            { cols: [5, 6, 7],    row: 7 },
            { cols: [16, 17, 18], row: 6 },
            { cols: [28, 29, 30], row: 7 },
            { cols: [35, 36, 37], row: 6 }
        ],
        [
            { col: 13, row: 8 },
            { col: 26, row: 8 }
        ],
        { col: 39, row: 8 }
    );
    // 1 hole between door 1 (col13) and door 2 (col26): col 20-21
    (function () {
        for (var r = 9; r <= 11; r++) {
            L2_MAP[r][20] = 0;
            L2_MAP[r][21] = 0;
        }
    })();
    // L2 exclusions — doors:448-848,1072-1472 | hole:810-1158
    var L2_ENEMIES = [
        { type: 'germ',        x: 200,  y: 410 },
        { type: 'smell_cloud', x: 420,  y: 410 },
        { type: 'germ',        x: 700,  y: 410 },  // before door1 zone
        { type: 'hair_monster',x: 1180, y: 410 },  // moved from 960 (hole)
        { type: 'smell_cloud', x: 1500, y: 410 },  // after door2 zone
        { type: 'germ',        x: 1700, y: 410 },
        { type: 'hair_monster',x: 1860, y: 410 }
    ];
    var L2_ITEMS = [
        { type: 'coin',          x: 130,  y: 395 },
        { type: 'coin',          x: 210,  y: 395 },
        { type: 'soap',          x: 320,  y: 395 },
        { type: 'coin',          x: 560,  y: 395 },
        { type: 'hygiene_star',  x: 740,  y: 395 },  // before hole zone
        { type: 'coin',          x: 1280, y: 395 },
        { type: 'uniform_clean', x: 1580, y: 395 },
        { type: 'coin',          x: 1720, y: 395 },
        { type: 'hygiene_star',  x: 1860, y: 395 }
    ];
    var L2_HAZARDS = [
        { type: 'dirty_cloud', x: 480,  y: 415 },
        { type: 'dirty_cloud', x: 1340, y: 415 },
        { type: 'dirty_cloud', x: 1820, y: 415 }
    ];

    // ── Level 3: Kitchen ── 52 cols (2496px) — MOVING PLATFORMS ─────────────
    // 3 doors: col 13, 26, 39 → exit col 51
    var L3_MAP = buildMap(52, T.KF, T.PM,
        [
            { cols: [5, 6, 7],    row: 7 },
            { cols: [17, 18, 19], row: 6 },
            { cols: [31, 32, 33], row: 7 },
            { cols: [44, 45, 46], row: 6 }
        ],
        [
            { col: 13, row: 8 },
            { col: 26, row: 8 },
            { col: 39, row: 8 }
        ],
        { col: 51, row: 8 }
    );
    // 3 holes: between seg1-2 (col 20-21), seg2-3 (col 33-34), seg3-4 (col 46-47)
    (function () {
        [[20,21],[33,34],[46,47]].forEach(function (pair) {
            for (var r = 9; r <= 11; r++) {
                L3_MAP[r][pair[0]] = 0;
                L3_MAP[r][pair[1]] = 0;
            }
        });
    })();
    // L3 exclusions — doors:448-848,1072-1472,1696-2096 | holes:810-1158,1434-1782,2058-2406
    var L3_ENEMIES = [
        { type: 'germ',        x: 200,  y: 410 },
        { type: 'smell_cloud', x: 380,  y: 410 },
        { type: 'hair_monster',x: 620,  y: 410 },  // before door1 zone
        { type: 'germ',        x: 900,  y: 410 },  // before hole1 zone
        { type: 'dirty_robot', x: 1200, y: 410 },  // after hole1, before door2
        { type: 'smell_cloud', x: 1500, y: 410 },  // moved from 1380 (door2 zone)
        { type: 'germ',        x: 1650, y: 410 },  // after door2, before hole2
        { type: 'hair_monster',x: 2120, y: 410 },  // moved from 1900 (door3 zone)
        { type: 'dirty_robot', x: 2430, y: 410 },  // after hole3
        { type: 'smell_cloud', x: 2450, y: 410 }
    ];
    var L3_ITEMS = [
        { type: 'coin',          x: 130,  y: 395 },
        { type: 'coin',          x: 210,  y: 395 },
        { type: 'soap',          x: 320,  y: 395 },
        { type: 'coin',          x: 540,  y: 395 },
        { type: 'hygiene_star',  x: 750,  y: 395 },  // before hole1 zone
        { type: 'coin',          x: 1280, y: 395 },
        { type: 'uniform_clean', x: 1560, y: 395 },
        { type: 'coin',          x: 1720, y: 395 },
        { type: 'soap',          x: 1860, y: 395 },
        { type: 'hygiene_star',  x: 2050, y: 395 },
        { type: 'coin',          x: 2360, y: 395 },
        { type: 'coin',          x: 2470, y: 395 }
    ];
    var L3_HAZARDS = [
        { type: 'dirty_cloud', x: 420,  y: 415 },
        { type: 'dirty_cloud', x: 1340, y: 415 },
        { type: 'dirty_cloud', x: 1820, y: 415 },
        { type: 'dirty_cloud', x: 2300, y: 415 }
    ];

    // ── Level 4: Customer Service ── 68 cols (3264px) — MORE MOVING PLATFORMS ─
    // 4 doors: col 13, 26, 39, 52 → exit col 67
    var L4_MAP = buildMap(68, T.CF, T.PG,
        [
            { cols: [5, 6, 7],    row: 7 },
            { cols: [17, 18, 19], row: 6 },
            { cols: [30, 31, 32], row: 7 },
            { cols: [43, 44, 45], row: 6 },
            { cols: [58, 59, 60], row: 7 }
        ],
        [
            { col: 13, row: 8 },
            { col: 26, row: 8 },
            { col: 39, row: 8 },
            { col: 52, row: 8 }
        ],
        { col: 67, row: 8 }
    );
    // 5 holes spread across 5 segments: cols 20-21, 33-34, 46-47, 58-59, 63-64
    (function () {
        [[20,21],[33,34],[46,47],[58,59],[63,64]].forEach(function (pair) {
            for (var r = 9; r <= 11; r++) {
                L4_MAP[r][pair[0]] = 0;
                L4_MAP[r][pair[1]] = 0;
            }
        });
    })();
    // L4 exclusions — doors:448-848,1072-1472,1696-2096,2320-2720
    // holes:810-1158,1434-1782,2058-2406,2634-2982,2874-3222
    var L4_ENEMIES = [
        { type: 'germ',        x: 180,  y: 410 },
        { type: 'smell_cloud', x: 340,  y: 410 },
        { type: 'hair_monster',x: 560,  y: 410 },  // before door1 zone
        { type: 'germ',        x: 750,  y: 410 },  // before hole1 zone
        { type: 'dirty_robot', x: 1200, y: 410 },  // after hole1, before door2
        { type: 'smell_cloud', x: 1500, y: 410 },  // after door2, before hole2
        { type: 'germ',        x: 1820, y: 410 },  // after hole2, before door3
        { type: 'hair_monster',x: 2120, y: 410 },  // after door3, before hole3
        { type: 'dirty_robot', x: 2450, y: 410 },  // after hole3, before door4
        { type: 'smell_cloud', x: 2750, y: 410 },  // moved from 2600 (hole3 zone)
        { type: 'germ',        x: 3050, y: 410 },  // moved from 2850 (hole4 zone)
        { type: 'hair_monster',x: 3150, y: 410 },  // moved from 3100
        { type: 'dirty_robot', x: 3220, y: 410 }
    ];
    var L4_ITEMS = [
        { type: 'coin',          x: 110,  y: 395 },
        { type: 'coin',          x: 200,  y: 395 },
        { type: 'soap',          x: 310,  y: 395 },
        { type: 'coin',          x: 490,  y: 395 },
        { type: 'hygiene_star',  x: 720,  y: 395 },  // before hole1 zone
        { type: 'coin',          x: 1120, y: 395 },
        { type: 'uniform_clean', x: 1280, y: 395 },
        { type: 'coin',          x: 1580, y: 395 },
        { type: 'soap',          x: 1740, y: 395 },
        { type: 'coin',          x: 2050, y: 395 },
        { type: 'hygiene_star',  x: 2540, y: 395 },
        { type: 'coin',          x: 2670, y: 395 },
        { type: 'uniform_clean', x: 2970, y: 395 },
        { type: 'hygiene_star',  x: 3090, y: 395 },
        { type: 'coin',          x: 3170, y: 395 }
    ];
    var L4_HAZARDS = [
        { type: 'dirty_cloud', x: 420,  y: 415 },
        { type: 'dirty_cloud', x: 1350, y: 415 },
        { type: 'dirty_cloud', x: 1900, y: 415 },
        { type: 'dirty_cloud', x: 2620, y: 415 },
        { type: 'dirty_cloud', x: 2850, y: 415 },
        { type: 'dirty_cloud', x: 3230, y: 415 }
    ];

    return {
        level1: { map: L1_MAP, enemies: L1_ENEMIES, items: L1_ITEMS, hazards: L1_HAZARDS, doorsRequired: 1 },
        level2: { map: L2_MAP, enemies: L2_ENEMIES, items: L2_ITEMS, hazards: L2_HAZARDS, doorsRequired: 2 },
        level3: { map: L3_MAP, enemies: L3_ENEMIES, items: L3_ITEMS, hazards: L3_HAZARDS, doorsRequired: 3 },
        level4: { map: L4_MAP, enemies: L4_ENEMIES, items: L4_ITEMS, hazards: L4_HAZARDS, doorsRequired: 4 }
    };
})();
