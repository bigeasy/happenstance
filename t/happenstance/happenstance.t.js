require('proof')(6, prove)

function prove (assert) {
    var Scheduler = require('../..')

    var time = 0

    var scheduler = new Scheduler

    scheduler.schedule('a', 'a', time + 1)
    scheduler.schedule('b', 'b', time + 1)

    assert(scheduler.what.a.when, 1, 'delay a')
    assert(scheduler.what.b.when, 1, 'delay b')

    scheduler.unschedule('a')
    scheduler.unschedule('b')

    assert(scheduler.what, {}, 'empty')

    scheduler.schedule('a', 'a', time + 1)
    scheduler.schedule('b', 'b', time + 1)

    assert(scheduler.check(time), [], 'nothing happening')
    time++
    assert(scheduler.check(time), [ 'a', 'b' ], 'something happening')

    scheduler.schedule('a', 'a', time + 1)
    scheduler.schedule('b', 'b', time + 1)

    scheduler.clear()
    assert(scheduler.what, {}, 'clear')
}
