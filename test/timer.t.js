require('proof')(6, async (okay) => {
    const latch = {}
    const { Scheduler, Timer } = require('..')
    {
        const set = new Promise(resolve => latch.set = resolve)
        const test = []
        const scheduler = new Scheduler
        scheduler.on('set', when => test.push('set'))
        scheduler.on('unset', () => test.push('unset'))
        scheduler.on('data', data => test.push(data.key))
        scheduler.on('unset', () => {
            okay(test, [ 'set', 'x', 'unset' ], 'set timer')
            latch.set.call()
        })
        const timer = new Timer(scheduler)
        scheduler.schedule(Date.now() + 1, 'x', 'X')
        await set
    }
    {
        const test = []
        const scheduler = new Scheduler
        scheduler.on('set', when => test.push('set'))
        scheduler.on('unset', () => test.push('unset'))
        scheduler.on('data', data => test.push(data.key))
        scheduler.on('unset', () => {
            okay(test, [ 'set', 'unset' ], 'unset timer')
        })
        const timer = new Timer(scheduler)
        scheduler.schedule(Date.now() + 1, 'x', 'X')
        scheduler.unschedule('x')
    }
    {
        const scheduler = new Scheduler
        const timer = new Timer(scheduler)
        okay(scheduler.listenerCount('set'), 1, 'one set listener')
        okay(scheduler.listenerCount('unset'), 1, 'one unset listener')
        timer.destroy()
        okay(scheduler.listenerCount('set'), 0, 'no set listeners')
        okay(scheduler.listenerCount('unset'), 0, 'no unset listeners')
    }
})
