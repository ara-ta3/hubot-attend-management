Fs   = require('fs');
Path = require('path');

module.exports = function(robot) {
    process.env.HUBOT_ATTEND_MANAGER_CREDENTIAL || robot.logger.error("Environment Variable 'HUBOT_ATTEND_MANAGER_CREDENTIAL' is required");
    process.env.HUBOT_ATTEND_MANAGER_CALENDARID || robot.logger.error("Environment Variable 'HUBOT_ATTEND_MANAGER_CALENDARID' is required");
    var path = Path.resolve(__dirname, 'src/hubot');
    Fs.exists(path, function(exists) {
        if (exists) {
            Fs.readdirSync(path).forEach(function(f) {
                robot.loadFile(path, f);
            });
        }
    });
}
