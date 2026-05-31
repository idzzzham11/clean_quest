// Tracks mission objectives and completion
var MissionManager = {
    _progress: {},
    _completed: [],

    init: function () {
        var saved = SaveManager.get('progress.missions') || {};
        this._progress = saved;
        this._completed = SaveManager.get('progress.collectedBadges') || [];

        // Listen to GameState events
        GameState.on('missionProgress', this._onProgress, this);
        GameState.on('quizCorrect', this._onQuizCorrect, this);
    },

    _onProgress: function (data) {
        MissionManager._checkMissions(data);
    },

    _onQuizCorrect: function (streak) {
        if (streak >= 5) {
            MissionManager._completeMission('mission_3');
        }
    },

    _checkMissions: function (data) {
        MissionData.forEach(function (mission) {
            if (MissionManager._completed.indexOf(mission.id) !== -1) return;

            var obj = mission.objective;
            var progress = MissionManager._progress[mission.id] || 0;
            var newProgress = progress;

            switch (obj.type) {
                case 'uniform':
                    if (data.type === 'uniform') newProgress = data.count;
                    break;
                case 'germ_stomp':
                    if (data.type === 'germ_stomp') newProgress = data.count;
                    break;
                case 'soap':
                    if (data.type === 'soap') newProgress = data.count;
                    break;
                case 'nail_clipper':
                    if (data.type === 'nail_clipper') newProgress = data.count;
                    break;
                case 'smell_cloud':
                    if (data.type === 'smell_cloud') newProgress = data.count;
                    break;
                case 'hair_combo':
                    var hn = GameState.get('hairnetCollected');
                    var cb = GameState.get('combCollected');
                    if (hn && cb) newProgress = 1;
                    break;
            }

            MissionManager._progress[mission.id] = newProgress;

            if (newProgress >= obj.count) {
                MissionManager._completeMission(mission.id);
            }
        });

        // Persist progress
        SaveManager.set('progress.missions', MissionManager._progress);
    },

    checkLevelComplete: function (levelId, noHazards, noDamage) {
        // Check mission_5 (no hazards)
        if (noHazards) this._completeMission('mission_5');
        // Check mission_7 (kitchen no damage)
        if (noDamage && levelId === 3) this._completeMission('mission_7');

        // Check mission_10 (all levels 2+ stars)
        var allDone = true;
        for (var i = 1; i <= 5; i++) {
            if (SaveManager.getLevelStars(i) < 2) { allDone = false; break; }
        }
        if (allDone) this._completeMission('mission_10');
    },

    _completeMission: function (id) {
        if (this._completed.indexOf(id) !== -1) return;
        this._completed.push(id);

        var mission = MissionData.find(function (m) { return m.id === id; });
        if (!mission) return;

        SaveManager.addBadge(id);
        GameState.emit('missionCompleted', mission);

        if (typeof BadgeDisplay !== 'undefined') {
            BadgeDisplay.show(mission.name, mission.icon);
        }
    },

    getProgress: function (id) {
        return this._progress[id] || 0;
    },

    isCompleted: function (id) {
        return this._completed.indexOf(id) !== -1;
    }
};
