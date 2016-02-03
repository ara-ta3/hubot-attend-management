// Description
//  manage attendees for some events.
//
// Commands:
//  hubot attend status - confirm current attendees for all events
//  hubot attend attend latest - attends latest event.
//  hubot attend cancel latest - cancel latest event.
//  hubot attend attend {event idx} - attends event. please confirm event idx by `hubot attend event list`
//  hubot attend cancel {event idx} - cancel event. please confirm event idx by `hubot attend event list`
//  hubot attend event list - confirm current all events
//

var keyFilePath = process.env.HUBOT_ATTEND_MANAGER_CREDENTIAL;
var calendarId  = process.env.HUBOT_ATTEND_MANAGER_CALENDARID;
var google    = require("googleapis");
var key       = require(keyFilePath);
var scope     = ['https://www.googleapis.com/auth/calendar.readonly'];
var jwtClient = new google.auth.JWT(key.client_email,null,key.private_key, scope, null);
var EventRepository     = require(__dirname + '/../repository/EventRepository.js');
var AttendeeRepository  = require(__dirname + '/../repository/AttendeeRepository.js');
var Manager   = require(__dirname + '/../Manager.js');
var Attendee  = require(__dirname + '/../model/Attendee.js');


module.exports = function(robot) {
    jwtClient.authorize(function(err, tokens) {
        return err ? 
            robot.logger.error("hubot-attend-management: " + err):
            robot.logger.info("hubot-attend-management: google authentication for calendar was successed");
    });

    var eventRepository     = new EventRepository(jwtClient, google.calendar('v3'), calendarId);
    var attendeeRepository  = new AttendeeRepository(robot.brain);
    var manager             = new Manager(eventRepository, attendeeRepository);
    var toAttendee          = function(u) {
        return new Attendee(u.name);
    };

    robot.respond(/attend status/i, function(msg) {
        manager.confirmStatus(function(m) {
            msg.send(m);
        }, function(err) {
            robot.logger.error("hubot-attend-management: " +err);
            msg.send(err);
        });
    });

    robot.respond(/attend attend latest/i, function(msg) {
        manager.addAttendee(0, toAttendee(msg.message.user), function(m) {
            msg.send(m);
        });
    });

    robot.respond(/attend cancel latest/i, function(msg) {
        manager.addAttendee(0, toAttendee(msg.message.user), function(m) {
            msg.send(m)
        });
    });

    robot.respond(/attend attend (\d+)/i, function(msg) {
        var eventIdx = msg.match[1];
        manager.addAttendee(eventIdx, toAttendee(msg.message.user), function(m) {
            msg.send(m)
        });
    });

    robot.respond(/attend cancel (\d+)/i, function(msg) {
        var eventIdx = msg.match[1];
        manager.removeAttendee(eventIdx, toAttendee(msg.message.user), function(m) {
            msg.send(m)
        });

    });

    robot.respond(/attend event list/i, function(msg) {
        manager.showEvents(function(m) {
            msg.send(m);
        }, function(err) {
            robot.logger.error("hubot-attend-management: " +err);
            msg.send(err);
        });
    });
}
