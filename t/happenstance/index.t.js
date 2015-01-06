
require('proof')(6, prove)

function prove (assert) {
    var Scheduler = require('../..')

    var time = 0
    var clock = function () { return time }

    var scheduler = new Scheduler
    assert(Date.now() - scheduler.clock() < 250, 'default clock')

    var scheduler = new Scheduler(clock)

    scheduler.schedule({
        id: 'a',
        delay: 1,
        value: 'a'
    })
    scheduler.schedule({
        id: 'b',
        delay: [ 1, 1 ],
        value: 'b'
    })

    assert(scheduler.what.a.when, 1, 'delay a')
    assert(scheduler.what.b.when, 1, 'delay b')

    scheduler.unschedule('a')
    scheduler.unschedule('b')

    assert(scheduler.what, {}, 'empty')

    scheduler.schedule({
        id: 'a',
        delay: 1,
        value: 'a'
    })
    scheduler.schedule({
        id: 'b',
        delay: [ 1, 1 ],
        value: 'b'
    })

    assert(scheduler.check(), [], 'nothing happening')
    time++
    assert(scheduler.check(), [ 'a', 'b' ], 'something happening')
}
