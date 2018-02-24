const videoRoutes = require('./video_routes');

module.exports = function(app, db) {
    videoRoutes(app, db);
}