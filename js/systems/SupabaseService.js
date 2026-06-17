// Supabase leaderboard integration
var SupabaseService = (function () {
    var URL  = 'https://hpxwbaollpyqylwqezdx.supabase.co/rest/v1';
    var KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhweHdiYW9sbHB5cXlsd3FlemR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NjgyMjMsImV4cCI6MjA5NjI0NDIyM30._LjRGNsJ7wfrmNtJhyv5ghEtq4DpEqk9rWAf7BDGcS0';

    // Unique session ID per browser tab — persists across levels in the same session
    var _sessionId = localStorage.getItem('cq_session');
    if (!_sessionId) {
        _sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8);
        localStorage.setItem('cq_session', _sessionId);
    }

    var HEADERS = {
        'apikey': KEY,
        'Authorization': 'Bearer ' + KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
    };

    return {
        getSessionId: function () { return _sessionId; },

        // Upsert — one row per session, updates score/level/name if session already exists
        submitScore: function (name, score, level, onDone) {
            fetch(URL + '/leaderboard?on_conflict=session_id', {
                method: 'POST',
                headers: Object.assign({}, HEADERS, { 'Prefer': 'resolution=merge-duplicates,return=minimal' }),
                body: JSON.stringify({ name: name, score: score, level: level, session_id: _sessionId })
            })
            .then(function (res) {
                if (!res.ok) {
                    res.text().then(function (body) {
                        console.warn('Supabase upsert failed [' + res.status + ']:', body);
                    });
                }
                if (onDone) onDone(res.ok, null);
            })
            .catch(function (err) {
                console.warn('Supabase submit error:', err);
                if (onDone) onDone(false, err);
            });
        },

        // Fetch top 10 scores — one best entry per session, sorted by score desc
        getTopScores: function (onDone) {
            fetch(URL + '/leaderboard?select=name,score,level,created_at&order=score.desc&limit=50', {
                method: 'GET',
                headers: {
                    'apikey': KEY,
                    'Authorization': 'Bearer ' + KEY
                }
            })
            .then(function (res) { return res.json(); })
            .then(function (data) {
                if (onDone) onDone(data, null);
            })
            .catch(function (err) {
                console.warn('Supabase fetch error:', err);
                if (onDone) onDone(null, err);
            });
        }
    };
})();
