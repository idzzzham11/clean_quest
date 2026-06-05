// Quiz Manager — timer, streak bonus, 50/50 lifeline
var QuizManager = {
    _currentQuestion: null,
    _attempts: 0,
    _maxAttempts: 3,
    _onComplete: null,
    _levelKey: null,
    _queue: [],
    _queueTotal: 0,
    _queueIndex: 0,
    _allCorrect: true,      // tracks perfect-quiz streak for this level
    _fiftyUsed: false,      // one 50/50 per level

    initLevel: function (levelKey) {
        this._levelKey  = levelKey;
        this._allCorrect = true;
        this._fiftyUsed  = false;

        var questions = QuizData[levelKey] || [];
        this._queue = questions.slice();
        for (var i = this._queue.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = this._queue[i]; this._queue[i] = this._queue[j]; this._queue[j] = tmp;
        }
        this._queueTotal = this._queue.length;
        this._queueIndex = 0;

        // Wire 50/50 button
        var self = this;
        var fiftyBtn = document.getElementById('quiz-fifty');
        if (fiftyBtn) {
            fiftyBtn.onclick = null;
            fiftyBtn.onclick = function () {
                if (!self._fiftyUsed && self._currentQuestion) {
                    self._fiftyUsed = true;
                    QuizOverlay.applyFiftyFifty(self._currentQuestion.correctIndex);
                }
            };
        }
    },

    show: function (scene, levelKey, onComplete) {
        if (levelKey !== this._levelKey || this._queue.length === 0) {
            this.initLevel(levelKey);
        }

        this._onComplete = onComplete;
        this._attempts   = 0;

        if (this._queue.length === 0) {
            onComplete && onComplete(true);
            return;
        }

        this._currentQuestion = this._queue.shift();
        this._queueIndex++;

        // Reset 50/50 button availability per question (but only 1 use per level)
        var fiftyBtn = document.getElementById('quiz-fifty');
        if (fiftyBtn) fiftyBtn.disabled = this._fiftyUsed;

        scene.scene.pause(scene.scene.key);

        var progress = 'Soalan ' + this._queueIndex + ' / ' + this._queueTotal;
        var self = this;

        QuizOverlay.show(this._currentQuestion, function (selectedIndex) {
            QuizManager._handleAnswer(scene, selectedIndex);
        }, progress, function () {
            // Timer ran out — lose a heart, mark wrong, fail door
            self._allCorrect = false;
            GameState.takeDamage(1);
            GameState.quizWrong();
            setTimeout(function () {
                QuizOverlay.hide();
                scene.scene.resume(scene.scene.key);
                QuizManager._onComplete && QuizManager._onComplete(false);
            }, 2000);
        });
    },

    _handleAnswer: function (scene, selectedIndex) {
        var q       = this._currentQuestion;
        var correct = selectedIndex === q.correctIndex;
        this._attempts++;

        if (correct) {
            QuizOverlay.showFeedback(true, q.explanation || 'Betul! Syabas!');
            GameState.quizCorrect();

            if (q.reward) {
                if (q.reward.type === 'coins') GameState.addCoins(q.reward.amount || 30);
                else if (q.reward.type === 'star') GameState.addHygieneStar();
            }

            AudioManager && AudioManager.playQuizCorrect && AudioManager.playQuizCorrect();

            // Check if this was the last question — award streak bonus
            var isLastQuestion = QuizManager._queue.length === 0;
            if (isLastQuestion && QuizManager._allCorrect) {
                GameState.addScore(200);
                QuizOverlay.showFeedback(true, (q.explanation || 'Betul!') + ' 🔥 +200 Bonus Sempurna!');
            }

            setTimeout(function () {
                QuizOverlay.hide();
                scene.scene.resume(scene.scene.key);
                QuizManager._onComplete && QuizManager._onComplete(true);
            }, 1800);

        } else {
            this._allCorrect = false;
            GameState.quizWrong();
            AudioManager && AudioManager.playQuizWrong && AudioManager.playQuizWrong();

            if (this._attempts >= this._maxAttempts) {
                QuizOverlay.showFeedback(false, 'Jawapan betul: ' + q.options[q.correctIndex]);
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
