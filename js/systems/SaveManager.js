// localStorage save/load for game progress
var SaveManager = {
    SAVE_KEY: 'cleanquest_save',
    LEADERBOARD_KEY: 'cleanquest_leaderboard',

    _defaultSave: function () {
        return {
            version: 1,
            character: {
                name: 'Player 1',
                skinTone: 0xFFDBAC,
                hairColor: 0x1C1C1C,
                uniformColor: 0x4169E1
            },
            progress: {
                unlockedLevels: [1],
                levelStars:  { 1: 0, 2: 0, 3: 0, 4: 0 },
                levelScores: { 1: 0, 2: 0, 3: 0, 4: 0 },
                collectedBadges: [],
                certificates: [],
                totalCoins: 0,
                totalScore: 0,
                missions: {}
            },
            settings: {
                sfxVolume: 0.8,
                musicVolume: 0.6
            }
        };
    },

    load: function () {
        try {
            var raw = localStorage.getItem(this.SAVE_KEY);
            if (!raw) return this._defaultSave();
            return JSON.parse(raw);
        } catch (e) {
            return this._defaultSave();
        }
    },

    save: function (data) {
        try {
            localStorage.setItem(this.SAVE_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('SaveManager: could not save:', e);
        }
    },

    get: function (path) {
        var data = this.load();
        var parts = path.split('.');
        var obj = data;
        for (var i = 0; i < parts.length; i++) {
            if (obj == null) return undefined;
            obj = obj[parts[i]];
        }
        return obj;
    },

    set: function (path, value) {
        var data = this.load();
        var parts = path.split('.');
        var obj = data;
        for (var i = 0; i < parts.length - 1; i++) {
            if (obj[parts[i]] == null) obj[parts[i]] = {};
            obj = obj[parts[i]];
        }
        obj[parts[parts.length - 1]] = value;
        this.save(data);
    },

    unlockLevel: function (levelNum) {
        var data = this.load();
        if (data.progress.unlockedLevels.indexOf(levelNum) === -1) {
            data.progress.unlockedLevels.push(levelNum);
            this.save(data);
        }
    },

    saveLevelResult: function (levelNum, stars, score) {
        var data = this.load();
        var current = data.progress.levelStars[levelNum] || 0;
        if (stars > current) {
            data.progress.levelStars[levelNum] = stars;
        }
        // Store best score per level — never accumulate blindly
        if (!data.progress.levelScores) data.progress.levelScores = {};
        var currentScore = data.progress.levelScores[levelNum] || 0;
        if (score > currentScore) {
            data.progress.levelScores[levelNum] = score;
        }
        data.progress.totalCoins = (data.progress.totalCoins || 0) + GameState.getCoins();
        this.save(data);

        // Auto-unlock next level
        if (levelNum < 4) {
            this.unlockLevel(levelNum + 1);
        }
    },

    getTotalScore: function () {
        var data = this.load();
        var scores = data.progress.levelScores || {};
        var total = 0;
        for (var lv in scores) { total += scores[lv]; }
        return total;
    },

    addBadge: function (badgeKey) {
        var data = this.load();
        if (data.progress.collectedBadges.indexOf(badgeKey) === -1) {
            data.progress.collectedBadges.push(badgeKey);
            this.save(data);
        }
    },

    isLevelUnlocked: function (levelNum) {
        var data = this.load();
        return data.progress.unlockedLevels.indexOf(levelNum) !== -1;
    },

    getLevelStars: function (levelNum) {
        var data = this.load();
        return data.progress.levelStars[levelNum] || 0;
    },

    saveCharacter: function (name, skinTone, hairColor, uniformColor) {
        var data = this.load();
        data.character = { name: name, skinTone: skinTone, hairColor: hairColor, uniformColor: uniformColor };
        this.save(data);
    },

    getCharacter: function () {
        return this.load().character;
    },

    // Leaderboard
    getLeaderboard: function () {
        try {
            var raw = localStorage.getItem(this.LEADERBOARD_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    },

    addLeaderboardEntry: function (name, score) {
        var board = this.getLeaderboard();
        board.push({ name: name, score: score, date: new Date().toLocaleDateString() });
        board.sort(function (a, b) { return b.score - a.score; });
        board = board.slice(0, 10); // top 10 only
        localStorage.setItem(this.LEADERBOARD_KEY, JSON.stringify(board));
    },

    clearSave: function () {
        localStorage.removeItem(this.SAVE_KEY);
        localStorage.removeItem(this.LEADERBOARD_KEY);
    }
};
