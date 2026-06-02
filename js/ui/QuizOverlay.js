// DOM-based quiz overlay manager
var QuizOverlay = {
    _answerCallback: null,
    _buttonsDisabled: false,

    show: function (question, onAnswer, progressText) {
        this._answerCallback = onAnswer;
        this._buttonsDisabled = false;

        var overlay = document.getElementById('quiz-overlay');
        var questionEl = document.getElementById('quiz-question');
        var feedbackEl = document.getElementById('quiz-feedback');
        var attemptsEl = document.getElementById('quiz-attempts');
        var iconEl = document.getElementById('quiz-icon');
        var badgeEl = document.getElementById('quiz-level-badge');
        var progressEl = document.getElementById('quiz-progress');

        questionEl.textContent = question.question;
        feedbackEl.className = 'hidden';
        feedbackEl.textContent = '';
        attemptsEl.textContent = '3 attempts allowed';
        if (progressEl) progressEl.textContent = progressText || '';

        if (iconEl) iconEl.textContent = question.icon || '🧼';
        if (badgeEl) badgeEl.textContent = 'Hygiene Quiz';

        // Set option texts
        var buttons = document.querySelectorAll('.quiz-btn');
        var letters = ['A', 'B', 'C', 'D'];
        buttons.forEach(function (btn, i) {
            var letterEl = btn.querySelector('.option-letter');
            var textEl = btn.querySelector('.option-text');
            if (letterEl) letterEl.textContent = letters[i];
            if (textEl) textEl.textContent = question.options[i] || '';
            btn.className = 'quiz-btn';
            btn.disabled = false;

            btn.onclick = null;
            btn.onclick = function () {
                if (!QuizOverlay._buttonsDisabled) {
                    QuizOverlay._buttonsDisabled = true;
                    QuizOverlay._markAnswer(i, i === question.correctIndex);
                    if (onAnswer) onAnswer(i);
                }
            };
        });

        overlay.classList.remove('hidden');
    },

    _markAnswer: function (selectedIndex, correct) {
        var buttons = document.querySelectorAll('.quiz-btn');
        buttons.forEach(function (btn, i) {
            btn.disabled = true;
            if (i === selectedIndex) {
                btn.classList.add(correct ? 'correct' : 'wrong');
            }
        });
    },

    showFeedback: function (correct, message) {
        var feedbackEl = document.getElementById('quiz-feedback');
        feedbackEl.textContent = (correct ? '✅ ' : '❌ ') + message;
        feedbackEl.className = 'quiz-feedback ' + (correct ? 'correct' : 'wrong');
    },

    resetButtons: function () {
        this._buttonsDisabled = false;
        var buttons = document.querySelectorAll('.quiz-btn');
        buttons.forEach(function (btn) {
            btn.disabled = false;
            btn.className = 'quiz-btn';
        });
        var feedbackEl = document.getElementById('quiz-feedback');
        if (feedbackEl) feedbackEl.className = 'quiz-feedback hidden';
    },

    hide: function () {
        var overlay = document.getElementById('quiz-overlay');
        overlay.classList.add('hidden');
        this._answerCallback = null;
        this._buttonsDisabled = false;
    },

    isVisible: function () {
        var overlay = document.getElementById('quiz-overlay');
        return overlay && !overlay.classList.contains('hidden');
    }
};
