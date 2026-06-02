// Manages quiz question selection, validation, and reward/penalty dispatch.
// Each level's questions are shuffled once at level start (initLevel).
// Each door calls show() to ask exactly 1 question from the queue.
var QuizManager = {
    _currentQuestion: null,
    _attempts: 0,
    _maxAttempts: 3,
    _onComplete: null,
    _levelKey: null,
    _queue: [],          // shuffled questions for this level, consumed door by door
    _queueTotal: 0,      // total doors / questions for the level
    _queueIndex: 0,      // how many have been asked so far

    // Call once when a level scene starts to prepare the shuffled question order
    initLevel: function (levelKey) {
        this._levelKey = levelKey;
        var questions = QuizData[levelKey] || [];
        // Fisher-Yates shuffle of the level's question pool
        this._queue = questions.slice();
        for (var i = this._queue.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = this._queue[i]; this._queue[i] = this._queue[j]; this._queue[j] = tmp;
        }
        this._queueTotal = this._queue.length;
        this._queueIndex = 0;
    },

    // Call once per door touch — asks exactly 1 question
    show: function (scene, levelKey, onComplete) {
        // Re-init if the level changed or queue is empty
        if (levelKey !== this._levelKey || this._queue.length === 0) {
            this.initLevel(levelKey);
        }

        this._onComplete = onComplete;
        this._attempts = 0;

        if (this._queue.length === 0) {
            onComplete && onComplete(true);
            return;
        }

        this._currentQuestion = this._queue.shift();
        this._queueIndex++;

        scene.scene.pause(scene.scene.key);

        var progress = 'Soalan ' + this._queueIndex + ' / ' + this._queueTotal;
        QuizOverlay.show(this._currentQuestion, function (selectedIndex) {
            QuizManager._handleAnswer(scene, selectedIndex);
        }, progress);
    },

    _handleAnswer: function (scene, selectedIndex) {
        var q = this._currentQuestion;
        var correct = selectedIndex === q.correctIndex;
        this._attempts++;

        if (correct) {
            QuizOverlay.showFeedback(true, q.explanation || 'Betul! Syabas!');
            GameState.quizCorrect();

            if (q.reward) {
                if (q.reward.type === 'coins') {
                    GameState.addCoins(q.reward.amount || 30);
                } else if (q.reward.type === 'star') {
                    GameState.addHygieneStar();
                }
            }

            AudioManager && AudioManager.playQuizCorrect && AudioManager.playQuizCorrect();

            setTimeout(function () {
                QuizOverlay.hide();
                scene.scene.resume(scene.scene.key);
                QuizManager._onComplete && QuizManager._onComplete(true);
            }, 1800);

        } else {
            GameState.quizWrong();
            AudioManager && AudioManager.playQuizWrong && AudioManager.playQuizWrong();

            if (this._attempts >= this._maxAttempts) {
                QuizOverlay.showFeedback(false, 'Jawapan yang betul ialah: ' + q.options[q.correctIndex]);
                setTimeout(function () {
                    QuizOverlay.hide();
                    scene.scene.resume(scene.scene.key);
                    QuizManager._onComplete && QuizManager._onComplete(false);
                }, 2200);
            } else {
                var remaining = QuizManager._maxAttempts - QuizManager._attempts;
                QuizOverlay.showFeedback(false, 'Cuba lagi! ' + remaining + ' percubaan lagi.');
                setTimeout(function () {
                    QuizOverlay.resetButtons();
                }, 1200);
            }
        }
    }
};
