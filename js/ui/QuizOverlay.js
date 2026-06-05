// DOM-based quiz overlay manager
var QuizOverlay = {
    _answerCallback: null,
    _buttonsDisabled: false,
    _timerInterval: null,
    _timeLeft: 0,
    _onTimeout: null,

    show: function (question, onAnswer, progressText, onTimeout) {
        this._answerCallback = onAnswer;
        this._buttonsDisabled = false;
        this._onTimeout = onTimeout || null;

        var overlay    = document.getElementById('quiz-overlay');
        var questionEl = document.getElementById('quiz-question');
        var feedbackEl = document.getElementById('quiz-feedback');
        var attemptsEl = document.getElementById('quiz-attempts');
        var iconEl     = document.getElementById('quiz-icon');
        var badgeEl    = document.getElementById('quiz-level-badge');
        var progressEl = document.getElementById('quiz-progress');

        questionEl.textContent = question.question;
        feedbackEl.className   = 'hidden';
        feedbackEl.textContent = '';
        attemptsEl.textContent = '3 percubaan dibenarkan';
        if (progressEl) progressEl.textContent = progressText || '';
        if (iconEl)  iconEl.textContent  = question.icon || '🧼';
        if (badgeEl) badgeEl.textContent = 'Hygiene Quiz';

        // Answer buttons
        var buttons = document.querySelectorAll('.quiz-btn');
        var letters = ['A', 'B', 'C', 'D'];
        buttons.forEach(function (btn, i) {
            btn.querySelector('.option-letter').textContent = letters[i];
            btn.querySelector('.option-text').textContent   = question.options[i] || '';
            btn.className = 'quiz-btn';
            btn.disabled  = false;
            btn.style.display = '';
            btn.onclick = null;
            btn.onclick = function () {
                if (!QuizOverlay._buttonsDisabled) {
                    QuizOverlay._buttonsDisabled = true;
                    QuizOverlay._stopTimer();
                    QuizOverlay._markAnswer(i, i === question.correctIndex);
                    if (onAnswer) onAnswer(i);
                }
            };
        });

        overlay.classList.remove('hidden');
        this._startTimer(15);
    },

    _startTimer: function (seconds) {
        this._stopTimer();
        this._timeLeft = seconds;
        var timerEl = document.getElementById('quiz-timer');
        if (!timerEl) return;

        var self = this;
        var update = function () {
            timerEl.textContent = '⏱ ' + self._timeLeft;
            timerEl.className   = self._timeLeft > 8 ? '' : self._timeLeft > 4 ? 'warning' : 'danger';
        };
        update();

        this._timerInterval = setInterval(function () {
            self._timeLeft--;
            update();
            if (self._timeLeft <= 0) {
                self._stopTimer();
                self._buttonsDisabled = true;
                // Disable all buttons and show timeout feedback
                document.querySelectorAll('.quiz-btn').forEach(function (b) { b.disabled = true; });
                var feedbackEl = document.getElementById('quiz-feedback');
                if (feedbackEl) {
                    feedbackEl.textContent = '⌛ Masa tamat! Nyawa berkurangan.';
                    feedbackEl.className   = 'quiz-feedback wrong';
                }
                if (self._onTimeout) self._onTimeout();
            }
        }, 1000);
    },

    _stopTimer: function () {
        if (this._timerInterval) {
            clearInterval(this._timerInterval);
            this._timerInterval = null;
        }
        var timerEl = document.getElementById('quiz-timer');
        if (timerEl) timerEl.className = '';
    },

    // 50/50: hide 2 random wrong options
    applyFiftyFifty: function (correctIndex) {
        var buttons  = document.querySelectorAll('.quiz-btn');
        var wrongIdx = [];
        for (var i = 0; i < 4; i++) { if (i !== correctIndex) wrongIdx.push(i); }
        // Shuffle and pick 2 to hide
        wrongIdx.sort(function () { return Math.random() - 0.5; });
        var toHide = wrongIdx.slice(0, 2);
        toHide.forEach(function (idx) {
            buttons[idx].disabled = true;
            buttons[idx].style.opacity = '0.25';
        });
        // Disable the 50/50 button
        var btn = document.getElementById('quiz-fifty');
        if (btn) btn.disabled = true;
    },

    _markAnswer: function (selectedIndex, correct) {
        var buttons = document.querySelectorAll('.quiz-btn');
        buttons.forEach(function (btn, i) {
            btn.disabled = true;
            if (i === selectedIndex) btn.classList.add(correct ? 'correct' : 'wrong');
        });
    },

    showFeedback: function (correct, message) {
        var feedbackEl = document.getElementById('quiz-feedback');
        feedbackEl.textContent = (correct ? '✅ ' : '❌ ') + message;
        feedbackEl.className   = 'quiz-feedback ' + (correct ? 'correct' : 'wrong');
    },

    resetButtons: function () {
        this._buttonsDisabled = false;
        var buttons = document.querySelectorAll('.quiz-btn');
        buttons.forEach(function (btn) {
            if (btn.style.display !== 'none' && btn.style.opacity !== '0.25') {
                btn.disabled  = false;
                btn.className = 'quiz-btn';
            }
        });
        var feedbackEl = document.getElementById('quiz-feedback');
        if (feedbackEl) feedbackEl.className = 'quiz-feedback hidden';
        this._startTimer(this._timeLeft > 0 ? this._timeLeft : 15);
    },

    hide: function () {
        this._stopTimer();
        var overlay = document.getElementById('quiz-overlay');
        overlay.classList.add('hidden');
        this._answerCallback = null;
        this._buttonsDisabled = false;
        // Reset button visuals
        document.querySelectorAll('.quiz-btn').forEach(function (btn) {
            btn.style.opacity = '';
            btn.style.display = '';
        });
        var fiftyBtn = document.getElementById('quiz-fifty');
        if (fiftyBtn) fiftyBtn.disabled = false;
    },

    isVisible: function () {
        var overlay = document.getElementById('quiz-overlay');
        return overlay && !overlay.classList.contains('hidden');
    }
};
