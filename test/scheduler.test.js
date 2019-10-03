require('proof')(26, (okay) => {
    const Scheduler = require('..').Scheduler
    {
        const scheduler = new Scheduler
        okay(scheduler.next(), null, 'nothing scheduled')
        okay(scheduler.when('x'), null, 'not scheduled')
    }
    {
        const scheduler = new Scheduler
        const test = []
        scheduler.on('set', when => test.push(when))
        scheduler.schedule(1, 'x', 'X')
        okay(scheduler.next(), 1, 'something scheduled')
        okay(scheduler.when('x'), 1, 'x scheduled')
        okay(scheduler.calendar(), [{
            when: 1,
            key: 'x',
            body: 'X'
        }], 'calendar')
        okay(test, [ 1 ], 'schedule an event')
    }
    {
        const test = []
        const scheduler = new Scheduler
        scheduler.on('set', when => test.push(when))
        scheduler.schedule(1, 'x', 'X')
        scheduler.schedule(1, 'y', 'Y')
        scheduler.schedule(2, 'z', 'Z')
        okay(scheduler.next(), 1, 'something scheduled')
        okay(test, [ 1 ], 'dot not reset the timer on schedule if not necessary')
    }
    {
        const test = []
        const scheduler = new Scheduler
        scheduler.on('set', when => test.push(when))
        scheduler.on('unset', () => test.push('unset'))
        scheduler.schedule(1, 'x', 'X')
        okay(scheduler.next(), 1, 'something scheduled')
        scheduler.unschedule('x')
        okay(scheduler.next(), null, 'nothing scheduled')
        okay(test, [ 1, 'unset' ], 'unschedule an event')
    }
    {
        const test = []
        const scheduler = new Scheduler
        scheduler.on('set', when => test.push(when))
        scheduler.on('unset', () => test.push('unset'))
        scheduler.schedule(1, 'x', 'X')
        scheduler.schedule(2, 'y', 'Y')
        okay(scheduler.next(), 1, 'something scheduled')
        scheduler.unschedule('x')
        okay(scheduler.next(), 2, 'rescheduled')
        okay(test, [ 1, 2 ], 'reset time on unschedule')
    }
    {
        const test = []
        const scheduler = new Scheduler
        scheduler.on('set', when => test.push(when))
        scheduler.on('unset', () => test.push('unset'))
        scheduler.schedule(1, 'x', 'X')
        scheduler.schedule(2, 'y', 'Y')
        okay(scheduler.next(), 1, 'something scheduled')
        scheduler.unschedule('y')
        okay(scheduler.next(), 1, 'same schedule')
        okay(test, [ 1 ], 'dot not reset timer on unschedule')
    }
    {
        const test = []
        const scheduler = new Scheduler
        scheduler.on('set', when => test.push(when))
        scheduler.on('unset', () => test.push('unset'))
        scheduler.on('data', data => test.push(data))
        scheduler.schedule(1, 'x', 'X')
        scheduler.schedule(2, 'y', 'Y')
        okay(scheduler.next(), 1, 'something scheduled')
        scheduler.check(1)
        okay(scheduler.next(), 2, 'new schedule')
        okay(test, [
            1, { key: 'x', body: 'X', now: 1, when: 1 }, 2
        ], 'check for events')
    }
    {
        const test = []
        const scheduler = new Scheduler
        scheduler.on('set', when => test.push(when))
        scheduler.on('unset', () => test.push('unset'))
        scheduler.on('data', data => test.push(data))
        scheduler.schedule(1, 'x', 'X')
        scheduler.schedule(2, 'y', 'Y')
        okay(scheduler.next(), 1, 'something scheduled')
        scheduler.check(2)
        okay(scheduler.next(), null, 'no schedule')
        okay(test, [
            1,
            { key: 'x', body: 'X', now: 2, when: 1 },
            { key: 'y', body: 'Y', now: 2, when: 2 },
            'unset'
        ], 'unset timer when check consumes all events')
    }
    {
        const test = []
        const scheduler = new Scheduler
        scheduler.on('set', when => test.push(when))
        scheduler.on('unset', () => test.push('unset'))
        scheduler.on('data', data => test.push(data))
        scheduler.schedule(1, 'x', 'X')
        scheduler.schedule(2, 'y', 'Y')
        okay(scheduler.next(), 1, 'something scheduled')
        scheduler.clear()
        okay(scheduler.next(), null, 'no schedule')
        okay(test, [ 1, 'unset' ], 'clear all events')
    }
})
