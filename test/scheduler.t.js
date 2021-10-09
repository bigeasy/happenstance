require('proof')(26, (okay) => {
    const { Calendar } = require('..')
    {
        const calendar = new Calendar
        okay(calendar.next(), null, 'nothing scheduled')
        okay(calendar.when('x'), null, 'not scheduled')
    }
    {
        const calendar = new Calendar
        const test = []
        calendar.on('set', when => test.push(when))
        calendar.schedule(1, 'x', 'X')
        okay(calendar.next(), 1, 'something scheduled')
        okay(calendar.when('x'), 1, 'x scheduled')
        okay(calendar.calendar(), [{
            when: 1,
            key: 'x',
            body: 'X'
        }], 'calendar')
        okay(test, [ 1 ], 'schedule an event')
    }
    {
        const test = []
        const calendar = new Calendar
        calendar.on('set', when => test.push(when))
        calendar.schedule(1, 'x', 'X')
        calendar.schedule(1, 'y', 'Y')
        calendar.schedule(2, 'z', 'Z')
        okay(calendar.next(), 1, 'something scheduled')
        okay(test, [ 1 ], 'dot not reset the timer on schedule if not necessary')
    }
    {
        const test = []
        const calendar = new Calendar
        calendar.on('set', when => test.push(when))
        calendar.on('unset', () => test.push('unset'))
        calendar.schedule(1, 'x', 'X')
        okay(calendar.next(), 1, 'something scheduled')
        calendar.unschedule('x')
        okay(calendar.next(), null, 'nothing scheduled')
        okay(test, [ 1, 'unset' ], 'unschedule an event')
    }
    {
        const test = []
        const calendar = new Calendar
        calendar.on('set', when => test.push(when))
        calendar.on('unset', () => test.push('unset'))
        calendar.schedule(1, 'x', 'X')
        calendar.schedule(2, 'y', 'Y')
        okay(calendar.next(), 1, 'something scheduled')
        calendar.unschedule('x')
        okay(calendar.next(), 2, 'rescheduled')
        okay(test, [ 1, 2 ], 'reset time on unschedule')
    }
    {
        const test = []
        const calendar = new Calendar
        calendar.on('set', when => test.push(when))
        calendar.on('unset', () => test.push('unset'))
        calendar.schedule(1, 'x', 'X')
        calendar.schedule(2, 'y', 'Y')
        okay(calendar.next(), 1, 'something scheduled')
        calendar.unschedule('y')
        okay(calendar.next(), 1, 'same schedule')
        okay(test, [ 1 ], 'dot not reset timer on unschedule')
    }
    {
        const test = []
        const calendar = new Calendar
        calendar.on('set', when => test.push(when))
        calendar.on('unset', () => test.push('unset'))
        calendar.on('data', data => test.push(data))
        calendar.schedule(1, 'x', 'X')
        calendar.schedule(2, 'y', 'Y')
        okay(calendar.next(), 1, 'something scheduled')
        calendar.check(1)
        okay(calendar.next(), 2, 'new schedule')
        okay(test, [
            1, { key: 'x', body: 'X', now: 1, when: 1 }, 2
        ], 'check for events')
    }
    {
        const test = []
        const calendar = new Calendar
        calendar.on('set', when => test.push(when))
        calendar.on('unset', () => test.push('unset'))
        calendar.on('data', data => test.push(data))
        calendar.schedule(1, 'x', 'X')
        calendar.schedule(2, 'y', 'Y')
        okay(calendar.next(), 1, 'something scheduled')
        calendar.check(2)
        okay(calendar.next(), null, 'no schedule')
        okay(test, [
            1,
            { key: 'x', body: 'X', now: 2, when: 1 },
            { key: 'y', body: 'Y', now: 2, when: 2 },
            'unset'
        ], 'unset timer when check consumes all events')
    }
    {
        const test = []
        const calendar = new Calendar
        calendar.on('set', when => test.push(when))
        calendar.on('unset', () => test.push('unset'))
        calendar.on('data', data => test.push(data))
        calendar.schedule(1, 'x', 'X')
        calendar.schedule(2, 'y', 'Y')
        okay(calendar.next(), 1, 'something scheduled')
        calendar.clear()
        okay(calendar.next(), null, 'no schedule')
        okay(test, [ 1, 'unset' ], 'clear all events')
    }
})
