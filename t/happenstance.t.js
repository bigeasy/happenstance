require('proof/redux')(16, prove)

function prove (assert) {
    var Scheduler = require('..')

    var time = 0, scheduler

    var scheduler = new Scheduler()

    var shifter = scheduler.events.shifter()

    assert(scheduler.next(), null, 'nothing scheduled')
    assert(scheduler.when('x'), null, 'not scheduled')

    scheduler.schedule(time + 1, 'x', 'X')

    assert(scheduler.next(), 1, 'something scheduled')

    assert(shifter.shift(), {
        module: 'happenstance',
        method: 'set',
        body: { when: 1 }
    }, 'schedule')

    assert(scheduler.when('x'), 1, 'scheduled')

    scheduler.schedule(time + 1, 'y', 'Y')

    scheduler.schedule(time + 2, 'z', 'Z')

    assert(shifter.shift(), null, 'no timer resets')

    assert(scheduler.when('y'), 1, 'both scheduled')

    scheduler.unschedule('x')

    assert(scheduler.when('x'), null, 'unscheduled')

    scheduler.unschedule('y')
    assert(scheduler.when('y'), null, 'both unscheduled')

    assert(shifter.shift(), {
        module: 'happenstance',
        method: 'set',
        body: { when: 2 }
    }, 'timer moved forward')

    scheduler.unschedule('z')
    assert(scheduler.when('z'), null, 'all unscheduled')

    assert(shifter.shift(), {
        module: 'happenstance',
        method: 'unset',
        body: null
    }, 'timer unset')

    scheduler.schedule(time + 1, 'x', 'X')
    scheduler.schedule(time + 1, 'y', 'Y')
    scheduler.schedule(time + 2, 'z', 'Z')

    assert(shifter.shift(), {
        module: 'happenstance',
        method: 'set',
        body: { when: 1 }
    }, 'timer set again')

    scheduler.check(1)

    assert([ shifter.shift(), shifter.shift(), shifter.shift(), shifter.shift() ], [{
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

    scheduler.check(3)

    assert([ shifter.shift(), shifter.shift(), shifter.shift() ], [{
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

    assert(shifter.shift(), {
        module: 'happenstance',
        method: 'unset',
        body: null
    }, 'cleared')
}
