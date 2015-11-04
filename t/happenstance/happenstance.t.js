require('proof')(7, prove)

function prove (assert) {
    var Scheduler = require('../..')

    var time = 0
    var _Date = {
        now: function () { return time }
    }

    var scheduler = new Scheduler
    assert(Date.now() - scheduler._Date.now() < 250, 'default clock')

    var scheduler = new Scheduler({ Date: _Date })

    scheduler.schedule({
        key: 'a',
        delay: 1,
        value: 'a'
    })
    scheduler.schedule({
        key: 'b',
        delay: [ 1, 1 ],
        value: 'b'
    })

    assert(scheduler.what.a.when, 1, 'delay a')
    assert(scheduler.what.b.when, 1, 'delay b')

    scheduler.unschedule('a')
    scheduler.unschedule('b')

    assert(scheduler.what, {}, 'empty')

    scheduler.schedule({
        key: 'a',
        delay: 1,
        value: 'a'
    })
    scheduler.schedule({
        key: 'b',
        delay: [ 1, 1 ],
        value: 'b'
    })

    assert(scheduler.check(), [], 'nothing happening')
    time++
    assert(scheduler.check(), [ 'a', 'b' ], 'something happening')

    scheduler.schedule({
        key: 'a',
        delay: 1,
        value: 'a'
    })
    scheduler.schedule({
        key: 'b',
        delay: [ 1, 1 ],
        value: 'b'
    })

    scheduler.clear()
    assert(scheduler.what, {}, 'clear')
}
