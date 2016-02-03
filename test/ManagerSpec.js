var assert  = require("power-assert");
var Event   = require('../src/model/Event.js');
var Manager = require("../src/Manager.js");
var AttendeeRepository  = require("../src/repository/AttendeeRepository.js");
var MockEventRepository = function(data) {
    this.getEvents = function(callback) {
        // TODO impl start time, max result
        callback(data);
    };
};
var MockUser = function(name) {
    this.name = name;
};


describe('Manager', function() {
    describe('#addAttendee()', function () {
        it('should add attendee', function () {
            var eventRepository     = new MockEventRepository([
                new Event("id", "hoge", "desc", "tokyo", new Date(), "")
            ]);
            var attendeeRepository  = new AttendeeRepository();
            var manager = new Manager(eventRepository, attendeeRepository);
            var user    = new MockUser("piyo");
            manager.addAttendee(0, user, function(msg) {
                var actual = attendeeRepository.status();
                assert.equal(user, actual["id"][0]);
            });
        });

        it('should add some attendees',function () {
            var eventRepository     = new MockEventRepository([
                new Event("id", "hoge", "desc", "tokyo", new Date(), "")
            ]);
            var attendeeRepository  = new AttendeeRepository();
            var manager = new Manager(eventRepository, attendeeRepository);
            var user1   = new MockUser("piyo1");
            var user2   = new MockUser("piyo2");
            manager.addAttendee(0, user1, function(msg) {
                manager.addAttendee(0, user2, function(msg) {
                    var actual = attendeeRepository.status();
                    assert.notEqual(-1, actual["id"].indexOf(user1));
                    assert.notEqual(-1, actual["id"].indexOf(user2));
                });
            });
        });

        it('should add to target event1', function() {
            var eventRepository     = new MockEventRepository([
                new Event("id1", "hoge", "desc", "tokyo", new Date(), ""),
                new Event("id2", "fuga", "desc", "tokyo", new Date(), "")
            ]);
            var attendeeRepository  = new AttendeeRepository();
            var manager = new Manager(eventRepository, attendeeRepository);
            var user    = new MockUser("piyo");
            manager.addAttendee(0, user, function(msg) {
                var actual = attendeeRepository.status();
                assert.equal(user, actual["id1"][0]);
                assert.equal(false, "id2" in actual);
            });
        });

        it('should add to target event2', function() {
            var eventRepository     = new MockEventRepository([
                new Event("id1", "hoge", "desc", "tokyo", new Date(), ""),
                new Event("id2", "fuga", "desc", "tokyo", new Date(), "")
            ]);
            var attendeeRepository  = new AttendeeRepository();
            var manager = new Manager(eventRepository, attendeeRepository);
            var user    = new MockUser("piyo");
            manager.addAttendee(1, user, function(msg) {
                var actual = attendeeRepository.status();
                assert.equal(user, actual["id2"][0]);
                assert.equal(false, "id1" in actual);
            });
        });

    });

    describe('#cancelAttendee()', function() {
        it('should remove attendee', function() {
            var eventRepository     = new MockEventRepository([
                new Event("id", "hoge", "desc", "tokyo", new Date(), "")
            ]);
            var attendeeRepository  = new AttendeeRepository();
            var manager = new Manager(eventRepository, attendeeRepository);
            var user    = new MockUser("piyo");
            manager.addAttendee(0, user, function(msg) {
                manager.removeAttendee(0, user, function(msg) {
                    var actual = attendeeRepository.status();
                    assert.equal(0, actual["id"].length);
                });
            });
        });

        it('should remove attendee if name matched', function() {
            var eventRepository     = new MockEventRepository([
                new Event("id", "hoge", "desc", "tokyo", new Date(), "")
            ]);
            var attendeeRepository  = new AttendeeRepository();
            var manager = new Manager(eventRepository, attendeeRepository);
            var user1   = new MockUser("piyo1");
            var user2   = new MockUser("piyo2");
            manager.addAttendee(0, user1, function(msg) {
                manager.addAttendee(0, user2, function(msg) {
                    manager.removeAttendee(0, user1, function(msg) {
                        var actual = attendeeRepository.status();
                        assert.equal(-1, actual["id"].indexOf(user1));
                        assert.notEqual(-1, actual["id"].indexOf(user2));
                    });
                });
            });


        });
    });
});

