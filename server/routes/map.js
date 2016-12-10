app.get('/map/base', function(req, res) {
    res.sendJSON(mapBaseData);
});

app.get('/map/:section', function(req, res) {
    res.sendJSON(mapData);
});