// Web Audio API procedural sound effects and background music
var AudioManager = (function () {
    var _ctx = null;
    var _masterGain = null;
    var _sfxVolume = 0.6;
    var _musicVolume = 0.4;
    var _bgmOscillators = [];
    var _currentBgm = null;
    var _bgmTimer = null;

    function _getContext() {
        if (!_ctx) {
            try {
                _ctx = new (window.AudioContext || window.webkitAudioContext)();
                _masterGain = _ctx.createGain();
                _masterGain.gain.value = 1;
                _masterGain.connect(_ctx.destination);
            } catch (e) {
                console.warn('Web Audio not supported');
                return null;
            }
        }
        if (_ctx.state === 'suspended') {
            _ctx.resume();
        }
        return _ctx;
    }

    function _playTone(freq, type, volume, duration, startDelay) {
        var ctx = _getContext();
        if (!ctx) return;
        var t = ctx.currentTime + (startDelay || 0);
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();

        osc.type = type || 'square';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime((volume || 0.2) * _sfxVolume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

        osc.connect(gain);
        gain.connect(_masterGain);
        osc.start(t);
        osc.stop(t + duration);
    }

    function _playNoise(volume, duration) {
        var ctx = _getContext();
        if (!ctx) return;
        var bufferSize = ctx.sampleRate * duration;
        var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        var data = buffer.getChannelData(0);
        for (var i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.3;
        }
        var source = ctx.createBufferSource();
        source.buffer = buffer;
        var gain = ctx.createGain();
        gain.gain.setValueAtTime(volume * _sfxVolume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        source.connect(gain);
        gain.connect(_masterGain);
        source.start();
    }

    // BGM note sequences per level
    var BGM_MELODIES = {
        office: [440, 494, 523, 587, 659, 587, 523, 494],
        salon:  [523, 587, 659, 784, 659, 587, 523, 440],
        kitchen:[349, 392, 440, 523, 440, 392, 349, 330],
        cs:     [392, 440, 523, 587, 523, 440, 392, 349],
        hotel:  [659, 740, 784, 880, 784, 740, 659, 587],
        boss:   [220, 196, 165, 220, 233, 220, 196, 165],
        title:  [523, 659, 784, 1047, 784, 659, 523, 440]
    };

    return {
        init: function () {
            // Lazy-init on first user gesture
        },

        initOnGesture: function () {
            _getContext();
        },

        playJump: function () {
            _playTone(440, 'square', 0.3, 0.08);
            _playTone(600, 'square', 0.2, 0.06, 0.05);
        },

        playCollect: function () {
            _playTone(880, 'sine', 0.3, 0.12);
            _playTone(1100, 'sine', 0.2, 0.1, 0.1);
        },

        playHurt: function () {
            _playNoise(0.4, 0.25);
            _playTone(150, 'sawtooth', 0.3, 0.2, 0.02);
        },

        playStompEnemy: function () {
            _playTone(300, 'square', 0.35, 0.06);
            _playTone(150, 'square', 0.4, 0.1, 0.04);
        },

        playQuizCorrect: function () {
            _playTone(523, 'sine', 0.3, 0.1);
            _playTone(659, 'sine', 0.3, 0.1, 0.1);
            _playTone(784, 'sine', 0.35, 0.2, 0.2);
        },

        playQuizWrong: function () {
            _playTone(300, 'sawtooth', 0.3, 0.1);
            _playTone(200, 'sawtooth', 0.35, 0.2, 0.1);
        },

        playCheckpoint: function () {
            _playTone(659, 'sine', 0.3, 0.1);
            _playTone(784, 'sine', 0.3, 0.1, 0.12);
            _playTone(1047, 'sine', 0.3, 0.2, 0.24);
        },

        playBossHit: function () {
            _playTone(250, 'square', 0.4, 0.08);
        },

        playBossDie: function () {
            for (var i = 0; i < 6; i++) {
                _playTone(400 + i * 80, 'sawtooth', 0.3, 0.1, i * 0.12);
            }
        },

        playLevelComplete: function () {
            var notes = [523, 659, 784, 1047];
            notes.forEach(function (n, i) {
                _playTone(n, 'sine', 0.4, 0.3, i * 0.15);
            });
        },

        playBadge: function () {
            _playTone(784, 'sine', 0.3, 0.12);
            _playTone(1047, 'sine', 0.35, 0.12, 0.15);
            _playTone(1319, 'sine', 0.4, 0.25, 0.3);
        },

        playBGM: function (levelKey) {
            var ctx = _getContext();
            if (!ctx) return;

            this.stopBGM();
            _currentBgm = levelKey;

            var melody = BGM_MELODIES[levelKey] || BGM_MELODIES.office;
            var bpm = 140;
            var beatDuration = 60 / bpm;
            var startTime = ctx.currentTime + 0.1;

            function playLoop() {
                if (_currentBgm !== levelKey) return;
                melody.forEach(function (note, i) {
                    var t = startTime + i * beatDuration;
                    var osc = ctx.createOscillator();
                    var gain = ctx.createGain();
                    osc.type = 'square';
                    osc.frequency.setValueAtTime(note / 2, t);
                    gain.gain.setValueAtTime(_musicVolume * 0.3, t);
                    gain.gain.exponentialRampToValueAtTime(0.001, t + beatDuration * 0.8);
                    osc.connect(gain);
                    gain.connect(_masterGain);
                    osc.start(t);
                    osc.stop(t + beatDuration * 0.8);
                });

                // Schedule next loop
                startTime += melody.length * beatDuration;
                var delay = (startTime - ctx.currentTime) * 1000;
                _bgmTimer = setTimeout(playLoop, Math.max(0, delay - 50));
            }

            playLoop();
        },

        stopBGM: function () {
            _currentBgm = null;
            if (_bgmTimer) { clearTimeout(_bgmTimer); _bgmTimer = null; }
        },

        setMusicVolume: function (v) {
            _musicVolume = Math.max(0, Math.min(1, v));
        },

        setSfxVolume: function (v) {
            _sfxVolume = Math.max(0, Math.min(1, v));
        }
    };
})();
