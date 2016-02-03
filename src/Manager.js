var Manager = function(eventRepository, attendeeRepository) {

    var idToEvent = function(events) {
        var ret = {};
        events.forEach(function(e) {
            ret[e.id] = e;
        });
        return ret;
    };

    var eventToString = function(e, idx) {
        return [
            "event idx for `attend` or `cancel`: " + idx,
            e.title,
            "Description: " + e.description,
            "Location: " + e.location,
            "Date: " + e.start
        ].join("\n");
    };

    this.confirmStatus = function(callback, errorCallback) {
        eventRepository.getEvents(function(es) {
            var events  = idToEvent(es);
            var status  = attendeeRepository.status();
            var message = Object.keys(status).map(function(key) {
                var e = events[key];
                return e.title + "( " + e.start + " )" + ": " + status[key].map(function(u) {return u.name;}).join(",");
            }).join("\n");
            return callback.call(null, message || "there are no attendees for any events");
        }, function(err) {
            console.error(err);
            errorCallback && errorCallback.call(null, err);
        });
    };

    this.addAttendee = function(idx, user, callback) {
        eventRepository.getEvents(function(es) {
            var event = es[idx];
            if (!event) {
                return callback.call(null,"event for " + idx + " was not found.");
            }
            attendeeRepository.put(event.id, user);
            callback.call(null, user.name + " attends to " + event.title);
        });
    };

    this.removeAttendee = function(idx, user, callback) {
        eventRepository.getEvents(function(es) {
            var event = es[idx];
            if (!event) {
                return callback.call(null,"event for " + idx + " was not found.");
            }
            attendeeRepository.remove(event.id, user);
            callback.call(null, user.name + "'s attendance to " + event.title + "is canceled");
        });
    };

    this.showEvents = function(callback, errorCallback) {
        eventRepository.getEvents(function(es) {
            return callback.call(null, es.map(eventToString).join("\n\n"));
        }, errorCallback);
    };
};

module.exports = Manager;
