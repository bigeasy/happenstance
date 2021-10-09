require('proof')(6, async (okay) => {
    const latch = {}
    const { Calendar, Timer } = require('..')
    {
        const set = new Promise(resolve => latch.set = resolve)
        const test = []
        const calendar = new Calendar
        calendar.on('set', when => test.push('set'))
        calendar.on('unset', () => test.push('unset'))
        calendar.on('data', data => test.push(data.key))
        calendar.on('unset', () => {
            okay(test, [ 'set', 'x', 'unset' ], 'set timer')
            latch.set.call()
        })
        const timer = new Timer(calendar)
        calendar.schedule(Date.now() + 1, 'x', 'X')
        await set
    }
    {
        const test = []
        const calendar = new Calendar
        calendar.on('set', when => test.push('set'))
        calendar.on('unset', () => test.push('unset'))
        calendar.on('data', data => test.push(data.key))
        calendar.on('unset', () => {
            okay(test, [ 'set', 'unset' ], 'unset timer')
        })
        const timer = new Timer(calendar)
        calendar.schedule(Date.now() + 1, 'x', 'X')
        calendar.unschedule('x')
    }
    {
        const calendar = new Calendar
        const timer = new Timer(calendar)
        okay(calendar.listenerCount('set'), 1, 'one set listener')
        okay(calendar.listenerCount('unset'), 1, 'one unset listener')
        timer.destroy()
        okay(calendar.listenerCount('set'), 0, 'no set listeners')
        okay(calendar.listenerCount('unset'), 0, 'no unset listeners')
    }
})
