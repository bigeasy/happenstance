require('proof')(17, prove)

function prove (okay) {
    var Scheduler = require('..').Scheduler

    var time = 0, scheduler

    var scheduler = new Scheduler()

    var shifter = scheduler.events.shifter()

    okay(scheduler.next(), null, 'nothing scheduled')
    okay(scheduler.when('x'), null, 'not scheduled')

    scheduler.schedule(time + 1, 'x', 'X')

    okay(scheduler.next(), 1, 'something scheduled')

    okay(shifter.shift(), {
        module: 'happenstance',
        method: 'set',
        body: { when: 1 }
    }, 'schedule')

    okay(scheduler.when('x'), 1, 'scheduled')

    scheduler.schedule(time + 1, 'y', 'Y')

    scheduler.schedule(time + 2, 'z', 'Z')

    okay(shifter.shift(), null, 'no timer resets')

    okay(scheduler.when('y'), 1, 'both scheduled')

    scheduler.unschedule('x')

    okay(scheduler.when('x'), null, 'unscheduled')

    scheduler.unschedule('y')
    okay(scheduler.when('y'), null, 'both unscheduled')

    okay(shifter.shift(), {
        module: 'happenstance',
        method: 'set',
        body: { when: 2 }
    }, 'timer moved forward')

    scheduler.unschedule('z')
    okay(scheduler.when('z'), null, 'all unscheduled')

    okay(shifter.shift(), {
        module: 'happenstance',
        method: 'unset',
        body: null
    }, 'timer unset')

    scheduler.schedule(time + 1, 'x', 'X')
    scheduler.schedule(time + 1, 'y', 'Y')
    scheduler.schedule(time + 2, 'z', 'Z')

    okay(shifter.shift(), {
        module: 'happenstance',
        method: 'set',
        body: { when: 1 }
    }, 'timer set again')

    scheduler.check(1)

    okay([ shifter.shift(), shifter.shift(), shifter.shift(), shifter.shift() ], [{
        module: 'happenstance',
        method: 'event',
        now: 1,
        when: 1,
        key: 'x',
        body: 'X'
    }, {
        module: 'happenstance',
        method: 'event',
        now: 1,
        when: 1,
        key: 'y',
        body: 'Y'
    }, {
        module: 'happenstance',
        method: 'set',
        body: { when: 2 }
    }, null], 'check')

    // Should do nothing.
    scheduler.unschedule('x')

    scheduler.check(3)

    okay([ shifter.shift(), shifter.shift(), shifter.shift() ], [{
        module: 'happenstance',
        method: 'event',
        now: 3,
        when: 2,
        key: 'z',
        body: 'Z'
    }, {
        module: 'happenstance',
        method: 'unset',
        body: null
    }, null], 'check and done')

    scheduler.clear()

    okay(shifter.shift(), {
        module: 'happenstance',
        method: 'unset',
        body: null
    }, 'cleared')

    scheduler.schedule(time + 1, 'x', 'X')
    scheduler.schedule(time + 1, 'y', 'Y')
    shifter.join(function (envelope) {
        return envelope.method == 'event'
    }, function (error, envelope) {
        scheduler.unschedule('y')
    })

    scheduler.check(4)

    okay(shifter.shift(), {
        module: 'happenstance',
        method: 'unset',
        body: null
    }, 'cancel event scheduled at same millisecond')
}
