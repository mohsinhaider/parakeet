module.exports = function(app, db) {
    app.get('/video', (req, res) => {
        res.send('Success');
    })
};