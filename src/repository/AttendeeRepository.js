var AttendeeRepositoyOnHubot = function(brain) {
    var ROBOT_STORAGE_KEY = "hubot-attend-management-aHVib3QtYXR0ZW5kLW1hbmFnZW1lbnQ=";
    var allAttendees = (brain && brain.get(ROBOT_STORAGE_KEY)) || {};

    this.status = function() {
        var copied = {};
        Object.keys(allAttendees).forEach(function(key) {
            copied[key] = allAttendees[key];
        });
        return copied;
    };

    this.put = function(eventId, user) {
        var attendees = allAttendees[eventId] || [];
        attendees.push(user);
        allAttendees[eventId] = attendees.filter(function (x, i, self) {
            return self.indexOf(x) === i;
        });
        commit();
        return allAttendees;
    };

    this.remove = function(eventId, user) {
        var attendees = allAttendees[eventId] || [];
        allAttendees[eventId] = attendees.filter(function (x, i, self) {
            return x !== user;
        });
        commit();
        return allAttendees;
    };

    var commit = function() {
        return !!brain && brain.set(ROBOT_STORAGE_KEY, allAttendees);
    };
};

module.exports = AttendeeRepositoyOnHubot;
