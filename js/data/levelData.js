// Level tilemap data — each level is wider and more complex than the previous
var LevelData = (function () {
    var T = {
        _: 0,
        OF: 1,  SF: 11, KF: 21, CF: 31, HF: 41,
        PW: 60, SP: 13, PM: 62, PG: 61, HP: 43,
        DL: 50, LE: 53
    };

    // Build a solid-ground map (no pits).
    // cols: total columns, floor/platTile: tile IDs
    // doors: [{col, row}] for quiz doors, end: {col, row} for level exit
    // platforms: [{cols:[...], row}]
    function buildMap(cols, floor, platTile, platforms, doors, end) {
        var ROWS = 12;
        var map = [];
        for (var r = 0; r < ROWS; r++) {
            var row = [];
            for (var c = 0; c < cols; c++) {
                row.push(r >= 9 ? floor : 0);
            }
            map.push(row);
        }
        platforms.forEach(function (p) {
            p.cols.forEach(function (c) { map[p.row][c] = platTile; });
        });
        doors.forEach(function (d) { map[d.row][d.col] = T.DL; });
        map[end.row][end.col] = T.LE;
        return map;
    }

    // ── Level 1: Office ── 25 cols (1200px) ──────────────────────────────────
    // 1 quiz door evenly placed, then the exit
    // Segment width = 1200 / 2 = 600px → door at col 12, exit col 24
    // Platforms at row 6 (surface y=288) and row 7 (surface y=336) — reachable heights
    // Ground surface at row 9 top = y 432; entities stand at y 410 (feet near ground)
    var L1_MAP = buildMap(25, T.OF, T.PW,
        [
            { cols: [5, 6, 7],    row: 7 },
            { cols: [15, 16, 17], row: 6 }
        ],
        [{ col: 12, row: 8 }],
        { col: 24, row: 8 }
    );
    // L1 door at col 12 = 576px. Clear zone: 376-776px.
    var L1_ENEMIES = [
        { type: 'germ',        x: 280,  y: 410 },
        { type: 'smell_cloud', x: 880,  y: 410 },
        { type: 'germ',        x: 1050, y: 410 }
    ];
    var L1_ITEMS = [
        { type: 'coin',          x: 150,  y: 395 },
        { type: 'coin',          x: 220,  y: 395 },
        { type: 'soap',          x: 340,  y: 395 },
        { type: 'hygiene_star',  x: 850,  y: 395 },
        { type: 'coin',          x: 1000, y: 395 },
        { type: 'uniform_clean', x: 1080, y: 395 }
    ];
    var L1_HAZARDS = [
        { type: 'dirty_cloud', x: 950, y: 415 }
    ];

    // ── Level 2: Salon ── 34 cols (1632px) ───────────────────────────────────
    // 2 quiz doors: split 1632 into 3 equal segments (~544px each)
    // Door cols: 544/48≈11, 1088/48≈22 → cols 11 and 22, exit col 33
    var L2_MAP = buildMap(34, T.SF, T.SP,
        [
            { cols: [5, 6, 7],    row: 7 },
            { cols: [16, 17, 18], row: 6 },
            { cols: [27, 28, 29], row: 7 }
        ],
        [
            { col: 11, row: 8 },
            { col: 22, row: 8 }
        ],
        { col: 33, row: 8 }
    );
    // L2 doors at col 11=528px, col 22=1056px. Clear zones: 328-728px and 856-1256px.
    var L2_ENEMIES = [
        { type: 'germ',        x: 200,  y: 410 },  // before zone 1
        { type: 'smell_cloud', x: 800,  y: 410 },  // between zones
        { type: 'germ',        x: 1320, y: 410 },  // after zone 2
        { type: 'hair_monster',x: 1480, y: 410 },
        { type: 'smell_cloud', x: 1580, y: 380 }
    ];
    var L2_ITEMS = [
        { type: 'coin',          x: 130,  y: 395 },
        { type: 'coin',          x: 200,  y: 395 },
        { type: 'soap',          x: 290,  y: 395 },
        { type: 'coin',          x: 750,  y: 395 },  // shifted away from hazard at 860
        { type: 'hygiene_star',  x: 1310, y: 395 },
        { type: 'coin',          x: 1450, y: 395 },  // shifted away from hazard at 1500
        { type: 'coin',          x: 1540, y: 395 },
        { type: 'uniform_clean', x: 1580, y: 395 }
    ];
    var L2_HAZARDS = [
        { type: 'dirty_cloud', x: 860,  y: 415 },
        { type: 'dirty_cloud', x: 1500, y: 415 }
    ];

    // ── Level 3: Kitchen ── 44 cols (2112px) ─────────────────────────────────
    // 3 quiz doors: split 2112 into 4 equal segments (528px each)
    // Door cols: 528/48=11, 1056/48=22, 1584/48=33 → cols 11, 22, 33, exit col 43
    var L3_MAP = buildMap(44, T.KF, T.PM,
        [
            { cols: [5, 6, 7],    row: 7 },
            { cols: [14, 15, 16], row: 6 },
            { cols: [26, 27, 28], row: 7 },
            { cols: [37, 38, 39], row: 6 }
        ],
        [
            { col: 11, row: 8 },
            { col: 22, row: 8 },
            { col: 33, row: 8 }
        ],
        { col: 43, row: 8 }
    );
    // L3 doors at col 11=528px, 22=1056px, 33=1584px. Clear zones: 328-728, 856-1256, 1384-1784px.
    var L3_ENEMIES = [
        { type: 'germ',        x: 220,  y: 410 },  // before zone 1
        { type: 'smell_cloud', x: 310,  y: 410 },
        { type: 'hair_monster',x: 820,  y: 410 },  // between zones 1-2
        { type: 'germ',        x: 1000, y: 410 },
        { type: 'dirty_robot', x: 1300, y: 410 },  // between zones 2-3
        { type: 'smell_cloud', x: 1330, y: 410 },
        { type: 'germ',        x: 1850, y: 410 },  // after zone 3
        { type: 'hair_monster',x: 2000, y: 410 }
    ];
    var L3_ITEMS = [
        { type: 'coin',          x: 120,  y: 395 },
        { type: 'coin',          x: 200,  y: 395 },
        { type: 'soap',          x: 380,  y: 395 },  // shifted away from hazard at 280
        { type: 'coin',          x: 840,  y: 395 },  // shifted away from hazard at 760
        { type: 'hygiene_star',  x: 950,  y: 395 },
        { type: 'coin',          x: 1280, y: 395 },
        { type: 'uniform_clean', x: 1330, y: 395 },
        { type: 'coin',          x: 1790, y: 395 },  // shifted away from hazard at 1870
        { type: 'soap',          x: 1950, y: 395 },
        { type: 'hygiene_star',  x: 2020, y: 395 },
        { type: 'coin',          x: 2060, y: 395 }
    ];
    var L3_HAZARDS = [
        { type: 'dirty_cloud', x: 280,  y: 415 },
        { type: 'dirty_cloud', x: 760,  y: 415 },
        { type: 'dirty_cloud', x: 1870, y: 415 }
    ];

    // ── Level 4: Customer Service ── 56 cols (2688px) ────────────────────────
    // 4 quiz doors: split 2688 into 5 equal segments (537.6px ≈ 538px each)
    // Door cols: 538/48≈11, 1075/48≈22, 1613/48≈33, 2150/48≈44 → cols 11,22,33,44, exit col 55
    var L4_MAP = buildMap(56, T.CF, T.PG,
        [
            { cols: [5, 6, 7],    row: 7 },
            { cols: [15, 16, 17], row: 6 },
            { cols: [26, 27, 28], row: 7 },
            { cols: [37, 38, 39], row: 6 },
            { cols: [48, 49, 50], row: 7 }
        ],
        [
            { col: 11, row: 8 },
            { col: 22, row: 8 },
            { col: 33, row: 8 },
            { col: 44, row: 8 }
        ],
        { col: 55, row: 8 }
    );
    // L4 doors at col 11=528, 22=1056, 33=1584, 44=2112px. Clear zones: 328-728, 856-1256, 1384-1784, 1912-2312px.
    var L4_ENEMIES = [
        { type: 'germ',        x: 180,  y: 410 },  // before zone 1
        { type: 'smell_cloud', x: 300,  y: 410 },
        { type: 'hair_monster',x: 800,  y: 410 },  // between zones 1-2
        { type: 'germ',        x: 1310, y: 410 },  // between zones 2-3
        { type: 'dirty_robot', x: 1350, y: 410 },
        { type: 'smell_cloud', x: 1840, y: 410 },  // between zones 3-4
        { type: 'germ',        x: 1880, y: 410 },
        { type: 'hair_monster',x: 2380, y: 410 },  // after zone 4
        { type: 'dirty_robot', x: 2460, y: 410 },
        { type: 'smell_cloud', x: 2560, y: 410 },
        { type: 'germ',        x: 2620, y: 410 }
    ];
    var L4_ITEMS = [
        { type: 'coin',          x: 110,  y: 395 },
        { type: 'coin',          x: 200,  y: 395 },
        { type: 'soap',          x: 350,  y: 395 },  // shifted away from hazard at 250
        { type: 'coin',          x: 730,  y: 395 },  // shifted away from hazard at 820
        { type: 'hygiene_star',  x: 920,  y: 395 },
        { type: 'uniform_clean', x: 1200, y: 395 },  // shifted away from hazard at 1310
        { type: 'coin',          x: 1400, y: 395 },
        { type: 'soap',          x: 1760, y: 395 },  // shifted away from hazard at 1850
        { type: 'coin',          x: 1960, y: 395 },
        { type: 'hygiene_star',  x: 2320, y: 395 },  // shifted away from hazard at 2400
        { type: 'coin',          x: 2450, y: 395 },
        { type: 'coin',          x: 2520, y: 395 },
        { type: 'uniform_clean', x: 2600, y: 395 },
        { type: 'hygiene_star',  x: 2650, y: 395 },
        { type: 'coin',          x: 2680, y: 395 }
    ];
    var L4_HAZARDS = [
        { type: 'dirty_cloud', x: 250,  y: 415 },
        { type: 'dirty_cloud', x: 820,  y: 415 },
        { type: 'dirty_cloud', x: 1310, y: 415 },
        { type: 'dirty_cloud', x: 1850, y: 415 },
        { type: 'dirty_cloud', x: 2400, y: 415 }
    ];

    return {
        level1: { map: L1_MAP, enemies: L1_ENEMIES, items: L1_ITEMS, hazards: L1_HAZARDS, doorsRequired: 1 },
        level2: { map: L2_MAP, enemies: L2_ENEMIES, items: L2_ITEMS, hazards: L2_HAZARDS, doorsRequired: 2 },
        level3: { map: L3_MAP, enemies: L3_ENEMIES, items: L3_ITEMS, hazards: L3_HAZARDS, doorsRequired: 3 },
        level4: { map: L4_MAP, enemies: L4_ENEMIES, items: L4_ITEMS, hazards: L4_HAZARDS, doorsRequired: 4 }
    };
})();
