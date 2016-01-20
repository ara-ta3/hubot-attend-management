var EventRepositoryOnGoogleCalendar = function(authedClient, calendar, calendarId) {
    this.getEvents = function(callback, errorCallback, startTime, maxResult) {
        startTime = (startTime ? startTime : new Date()).toISOString();
        calendar.events.list({
            auth: authedClient,
            calendarId: calendarId,
            timeMin: startTime,
            maxResult: maxResult || 10,
            singleEvents: true,
            orderBy: 'startTime'
        }, function(err, resp){
            if(err) {
                return errorCallback(err);
            }
            var events = resp.items.map(function(i) {
                return {
                    title: i.summary,
                    description: i.description,
                    location: i.location,
                    start: new Date(i.start.dateTime),
                    link: i.htmlLink
                };
            });
            return callback(events);
        });
    };
};

module.exports = EventRepositoryOnGoogleCalendar;
