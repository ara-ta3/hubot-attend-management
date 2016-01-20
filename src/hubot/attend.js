// Description
//  manage attendees for some events.
//
// Commands:
//  hubot attend status - confirm current attendees for all events
//  hubot attend attend {event idx} - attends event. please confirm event idx by `hubot attend event list`
//  hubot attend cancel {event idx} - cancel event. please confirm event idx by `hubot attend event list`
//  hubot attend event list - confirm current all events
//

var keyFilePath = process.env.HUBOT_ATTEND_MANAGER_CREDENTIAL;
var google    = require("googleapis");
var key       = require(keyFilePath);
var scope     = ['https://www.googleapis.com/auth/calendar.readonly'];
var jwtClient = new google.auth.JWT(key.client_email,null,key.private_key, scope, null);
var EventRepository     = require(__dirname + '/../repository/EventRepository.js');
var AttendeeRepository  = require(__dirname + '/../repository/AttendeeRepository.js');


module.exports = function(robot) {
    jwtClient.authorize(function(err, tokens) {
        return err ? 
            robot.logger.error("hubot-attend-management: " + err):
            robot.logger.info("hubot-attend-management: google authentication for calendar was successed");
    });

    var eventRepository     = new EventRepository(jwtClient, google.calendar('v3'), 'h2j0hj6rh0kadoi561c03amv84@group.calendar.google.com');
    var attendeeRepository  = new AttendeeRepository(robot.brain);

    var eventToString = function(e, idx) {
        return [
            "event idx for `attend` or `cancel`: " + idx,
            e.title,
            "Description: " + e.description,
            "Location: " + e.location,
            "Date: " + e.start
        ].join("\n");
    };

    robot.respond(/attend status/i, function(msg) {
        eventRepository.getEvents(function(es) {
            var idToEvent = {};
            es.forEach(function(e) {
                return idToEvent[e.id] = e;
            });
            var status  = attendeeRepository.status();
            var message = Object.keys(status).map(function(key) {
                var e = idToEvent[key];
                return e.title + "( " + e.start + " )" + ": " + status[key].map(function(u) {return u.name;}).join(",");
            }).join("\n");
            message = message || "there are no attendees for any events";
            msg.send(message);
        }, function(err) {
            robot.logger.error("hubot-attend-management: " +err);
            msg.send(err);
        });
    });

    robot.respond(/attend attend (.+)/i, function(msg) {
        var eventIdx = msg.match[1];
        eventRepository.getEvents(function(es) {
            var event = es[eventIdx];
            if (!event) {
                msg.send("event for " + eventIdx + " was not found.");
                msg.send("please confirm eventIdx by `hubot attend event list`");
                return;
            }
            attendeeRepository.put(event.id, msg.message.user);
            var message = msg.message.user.name + " attends to " + event.title;
            msg.send(message);
        });
    });

    robot.respond(/attend cancel (.+)/i, function(msg) {
        var eventIdx = msg.match[1];
        eventRepository.getEvents(function(es) {
            var event = es[eventIdx];
            if (!event) {
                msg.send("event for " + eventIdx + " was not found.");
                msg.send("please confirm eventIdx by `hubot attend event list`");
                return;
            }
            attendeeRepository.remove(event.id, msg.message.user);
            var message = msg.message.user.name + "'s attendance to " + event.title + "is canceled";
            msg.send(message);
        });

    });

    robot.respond(/attend event list/i, function(msg) {
        eventRepository.getEvents(function(es) {
            var message = es.map(eventToString).join("\n\n");
            msg.send(message);
        }, function(err) {
            robot.logger.error("hubot-attend-management: " +err);
            msg.send(err);
        });
    });
}
