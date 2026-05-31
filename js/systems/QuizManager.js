// Manages quiz question selection, validation, and reward/penalty dispatch
var QuizManager = {
    _currentQuestion: null,
    _attempts: 0,
    _maxAttempts: 3,
    _onComplete: null,
    _levelKey: null,
    _usedQuestions: {},

    show: function (scene, levelKey, onComplete) {
        this._levelKey = levelKey;
        this._onComplete = onComplete;
        this._attempts = 0;

        var question = this._selectQuestion(levelKey);
        if (!question) {
            // No questions — just open door
            onComplete && onComplete(true);
            return;
        }

        this._currentQuestion = question;

        // Pause the level scene
        scene.scene.pause(scene.scene.key);

        // Show overlay
        QuizOverlay.show(question, function (selectedIndex) {
            QuizManager._handleAnswer(scene, selectedIndex);
        });
    },

    _selectQuestion: function (levelKey) {
        var questions = QuizData[levelKey];
        if (!questions || questions.length === 0) return null;

        // Track used questions per level
        if (!this._usedQuestions[levelKey]) {
            this._usedQuestions[levelKey] = [];
        }

        var used = this._usedQuestions[levelKey];
        var available = questions.filter(function (q) {
            return used.indexOf(q.id) === -1;
        });

        if (available.length === 0) {
            // Reset used questions for this level
            this._usedQuestions[levelKey] = [];
            available = questions;
        }

        var idx = Math.floor(Math.random() * available.length);
        var q = available[idx];
        this._usedQuestions[levelKey].push(q.id);
        return q;
    },

    _handleAnswer: function (scene, selectedIndex) {
        var q = this._currentQuestion;
        var correct = selectedIndex === q.correctIndex;
        this._attempts++;

        if (correct) {
            QuizOverlay.showFeedback(true, q.explanation || 'Correct! Well done!');
            GameState.quizCorrect();

            // Apply reward
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
                // Re-enable buttons after delay
                setTimeout(function () {
                    QuizOverlay.resetButtons();
                }, 1200);
            }
        }
    }
};
