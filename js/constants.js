// CleanQuest: Workplace Hero - Global Constants
var CONSTANTS = {
    // Canvas
    WIDTH: 960,
    HEIGHT: 540,
    TILE_SIZE: 48,

    // Physics
    GRAVITY: 800,
    PLAYER_SPEED: 220,
    JUMP_VELOCITY: -520,
    COYOTE_TIME: 80,
    JUMP_BUFFER: 100,
    MAX_FALL_SPEED: 600,
    STOMP_BOUNCE: -350,

    // Player
    PLAYER_MAX_HEALTH: 3,
    INVINCIBILITY_DURATION: 1200,

    // Scoring
    COIN_VALUE: 10,
    STAR_VALUE: 50,
    QUIZ_CORRECT_BONUS: 50,
    STOMP_BONUS: 25,
    HEART_BONUS: 100,       // bonus per remaining heart at level end
    TIME_BONUS_MAX: 1000,   // max time bonus awarded for fastest completion
    TIME_BONUS_MIN: 50,     // minimum bonus even for very slow completion
    TIME_BONUS_CAP: 300000, // 5 minutes — at this point bonus = TIME_BONUS_MIN
    SCORE_DRAIN_INTERVAL: 15000,  // every 15 seconds
    SCORE_DRAIN_AMOUNT: 25,       // points deducted each interval

    // Level dimensions (width in px) — cols x 48px
    LEVEL_WIDTHS: {
        1: 1728,   // 36 cols
        2: 2304,   // 48 cols
        3: 2976,   // 62 cols
        4: 3840    // 80 cols
    },
    LEVEL_HEIGHT: 576,

    // Tile IDs
    TILES: {
        EMPTY: 0,
        // Office (1x)
        OFFICE_FLOOR: 1,
        OFFICE_WALL: 2,
        OFFICE_PLATFORM: 3,
        // Salon (2x)
        SALON_FLOOR: 11,
        SALON_WALL: 12,
        SALON_PLATFORM: 13,
        // Kitchen (3x)
        KITCHEN_FLOOR: 21,
        KITCHEN_WALL: 22,
        KITCHEN_PLATFORM: 23,
        // Customer Service (4x)
        CS_FLOOR: 31,
        CS_WALL: 32,
        CS_PLATFORM: 33,
        // Hotel (5x)
        HOTEL_FLOOR: 41,
        HOTEL_WALL: 42,
        HOTEL_PLATFORM: 43,
        // Special
        DOOR_LOCKED: 50,
        DOOR_OPEN: 51,
        CHECKPOINT: 52,
        LEVEL_END: 53,
        PLATFORM_WOOD: 60,
        PLATFORM_GLASS: 61,
        PLATFORM_METAL: 62
    },

    // Colors
    COLORS: {
        // Pastels
        PASTEL_BLUE: 0xADD8E6,
        PASTEL_PINK: 0xFFB6C1,
        PASTEL_GREEN: 0x90EE90,
        PASTEL_YELLOW: 0xFFFFE0,
        PASTEL_LAVENDER: 0xE6E6FA,
        PASTEL_PEACH: 0xFFDAB9,
        PASTEL_MINT: 0x98FF98,
        PASTEL_CREAM: 0xFFFDD0,

        // Environment themes
        OFFICE_BG: 0x87CEEB,
        OFFICE_FLOOR: 0x708090,
        SALON_BG: 0xFFB6C1,
        SALON_FLOOR: 0xDDA0DD,
        KITCHEN_BG: 0xFFF8DC,
        KITCHEN_FLOOR: 0xB0C4DE,
        CS_BG: 0x20B2AA,
        CS_FLOOR: 0xFFA07A,
        HOTEL_BG: 0x4682B4,
        HOTEL_FLOOR: 0xFFD700,

        // Characters
        SKIN_1: 0xFFDBAC,
        SKIN_2: 0xF1C27D,
        SKIN_3: 0xE0AC69,
        SKIN_4: 0xC68642,
        SKIN_5: 0x8D5524,
        HAIR_BLACK: 0x1C1C1C,
        HAIR_BROWN: 0x8B4513,
        HAIR_GOLD: 0xFFD700,

        // Enemies
        GERM_GREEN: 0x32CD32,
        SMELL_PURPLE: 0x9370DB,
        HAIR_MONSTER_BROWN: 0x8B4513,
        ROBOT_GREY: 0x808080,

        // Items
        COIN_GOLD: 0xFFD700,
        STAR_YELLOW: 0xFFFF00,
        SOAP_WHITE: 0xF5F5F5,
        UNIFORM_BLUE: 0x4169E1,

        // UI
        WHITE: 0xFFFFFF,
        BLACK: 0x000000,
        RED: 0xFF0000,
        HEALTH_RED: 0xFF4444,
        HEALTH_EMPTY: 0x333333,
        UI_ORANGE: 0xFFB347,
        UI_BG: 0xFFF8F0,

        // Hazards
        OIL_BLACK: 0x2F2F2F,
        DIRTY_BROWN: 0x8B6914
    },

    // Scene keys
    SCENES: {
        BOOT: 'BootScene',
        TITLE: 'TitleScene',
        CHAR_SELECT: 'CharSelectScene',
        LEVEL_SELECT: 'LevelSelectScene',
        HUD: 'HUDScene',
        LEVEL1: 'Level1Scene',
        LEVEL2: 'Level2Scene',
        LEVEL3: 'Level3Scene',
        LEVEL4: 'Level4Scene',
        BOSS: 'BossScene',
        QUIZ: 'QuizScene',
        RESULTS: 'ResultsScene',
        LEADERBOARD: 'LeaderboardScene',
        CREDITS: 'CreditsScene'
    },

    // Level names
    LEVEL_NAMES: {
        1: 'Office Hygiene Adventure',
        2: 'Salon Cleanliness Challenge',
        3: 'Restaurant Kitchen Safety',
        4: 'Customer Service Professionalism'
    },

    // Boss types
    BOSSES: {
        GERM_MONSTER: 'germ_monster',
        SMELLY_FOG: 'smelly_fog',
        HAIR_CREATURE: 'hair_creature',
        DIRTY_ROBOT: 'dirty_robot',
        FINAL_BOSS: 'final_boss'
    },

    // Collectible types
    ITEMS: {
        COIN: 'coin',
        HYGIENE_STAR: 'hygiene_star',
        SOAP: 'soap',
        UNIFORM: 'uniform_clean',
        DEODORANT: 'deodorant',
        COMB: 'comb',
        HAIRNET: 'hairnet',
        NAIL_CLIPPER: 'nail_clipper',
        GLOVES: 'gloves'
    },

    // Hazard types
    HAZARDS: {
        OIL_SPILL: 'oil_spill',
        DIRTY_CLOUD: 'dirty_cloud',
        MESSY_HAIR: 'messy_hair',
        GERM_PATCH: 'germ_patch'
    },

    // Enemy types
    ENEMIES: {
        GERM: 'germ',
        SMELL_CLOUD: 'smell_cloud',
        HAIR_MONSTER: 'hair_monster',
        DIRTY_ROBOT: 'dirty_robot'
    }
};
