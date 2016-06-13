require('proof')(13, prove)

function prove (assert) {
    var Scheduler = require('..')

    var time = 0, scheduler

    scheduler = new Scheduler({ setTimeout: false })
    scheduler = new Scheduler
    scheduler = new Scheduler({ Date: { now: function () { return time } } })
    assert(!scheduler.timerless, 'timerless')

    assert(scheduler.next(), null, 'nothing happening')
    assert(scheduler.scheduled('a'), null, 'specific event not scheduled')

    scheduler.schedule(time + 1, 'a', function () {})
    scheduler.schedule(time + 1, 'b', function () {})

    assert(scheduler.scheduled('a'), time + 1, 'scheduled')

    assert(scheduler.next(), 1, 'next')

    assert(scheduler.what.a.when, 1, 'delay a')
    assert(scheduler.what.b.when, 1, 'delay b')

    scheduler.unschedule('a')
    scheduler.unschedule('b')

    assert(scheduler.what, {}, 'empty')

    scheduler.schedule(time + 1, 'a', function () {})
    scheduler.schedule(time + 1, 'b', function () {})

    assert(scheduler.check(time), 0, 'nothing happening')
    time++
    assert(scheduler.check(time), 2, 'something happening')

    scheduler.schedule(time + 1, 'a', function () {})
    scheduler.schedule(time + 1, 'b', function () {})

    scheduler.schedule(time, 'a', function () {
        assert(true, 'immediate')
    })

    scheduler.shutdown()
    assert(scheduler.what, {}, 'clear')
    assert(!scheduler.setTimeout, 'shutdown')
}
