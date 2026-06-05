// Touch-based mobile controls
var MobileControls = {
    left: false,
    right: false,
    jumpJustPressed: false,
    _jumpHeld: false,
    _visible: false,
    _initialized: false,

    _isTouchDevice: function () {
        return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    },

    init: function () {
        if (!this._isTouchDevice()) return;

        if (this._initialized) {
            // Already bound — just make sure controls are visible again
            this.show();
            return;
        }

        this._initialized = true;
        this.show();
        this._bindButtons();
    },

    _bindButtons: function () {
        var self = this;

        var dpadLeft  = document.getElementById('dpad-left');
        var dpadRight = document.getElementById('dpad-right');
        var jumpBtn   = document.getElementById('btn-jump');

        if (!dpadLeft || !dpadRight || !jumpBtn) return;

        function onPress(el, onDown, onUp) {
            ['touchstart', 'mousedown'].forEach(function (evt) {
                el.addEventListener(evt, function (e) {
                    e.preventDefault();
                    el.classList.add('pressed');
                    onDown();
                }, { passive: false });
            });
            ['touchend', 'touchcancel', 'mouseup', 'mouseleave'].forEach(function (evt) {
                el.addEventListener(evt, function (e) {
                    e.preventDefault();
                    el.classList.remove('pressed');
                    onUp();
                }, { passive: false });
            });
        }

        onPress(dpadLeft,
            function () { self.left = true; },
            function () { self.left = false; }
        );
        onPress(dpadRight,
            function () { self.right = true; },
            function () { self.right = false; }
        );

        // Jump: fire jumpJustPressed on the leading edge only
        ['touchstart', 'mousedown'].forEach(function (evt) {
            jumpBtn.addEventListener(evt, function (e) {
                e.preventDefault();
                jumpBtn.classList.add('pressed');
                if (!self._jumpHeld) {
                    self.jumpJustPressed = true;
                    self._jumpHeld = true;
                }
            }, { passive: false });
        });
        ['touchend', 'touchcancel', 'mouseup', 'mouseleave'].forEach(function (evt) {
            jumpBtn.addEventListener(evt, function (e) {
                e.preventDefault();
                jumpBtn.classList.remove('pressed');
                self._jumpHeld = false;
            }, { passive: false });
        });
    },

    // Call once per frame after reading jumpJustPressed to clear it
    consumeJump: function () {
        var was = this.jumpJustPressed;
        this.jumpJustPressed = false;
        return was;
    },

    show: function () {
        if (!this._initialized) return;
        var controls = document.getElementById('mobile-controls');
        if (controls) {
            controls.classList.remove('hidden');
            this._visible = true;
        }
        document.body.classList.add('mobile-active');
        if (typeof resizeGameContainer === 'function') resizeGameContainer();
    },

    hide: function () {
        var controls = document.getElementById('mobile-controls');
        if (controls) {
            controls.classList.add('hidden');
            this._visible = false;
        }
        document.body.classList.remove('mobile-active');
        if (typeof resizeGameContainer === 'function') resizeGameContainer();
    }
};
