describe('timer', () => {
    const assert = require('assert')
    const { Scheduler, Timer } = require('..')
    it('can set a timer', () => {
        const test = []
        const scheduler = new Scheduler
        scheduler.on('set', when => test.push('set'))
        scheduler.on('unset', () => test.push('unset'))
        scheduler.on('data', data => test.push(data.key))
        scheduler.on('unset', () => {
            assert.deepStrictEqual(test, [ 'set', 'x', 'unset' ], 'test')
        })
        const timer = new Timer(scheduler)
        scheduler.schedule(Date.now() + 1, 'x', 'X')
    })
    it('can unset a timer', () => {
        const test = []
        const scheduler = new Scheduler
        scheduler.on('set', when => test.push('set'))
        scheduler.on('unset', () => test.push('unset'))
        scheduler.on('data', data => test.push(data.key))
        scheduler.on('unset', () => {
            assert.deepStrictEqual(test, [ 'set', 'unset' ], 'test')
        })
        const timer = new Timer(scheduler)
        scheduler.schedule(Date.now() + 1, 'x', 'X')
        scheduler.unschedule('x')
    })
    it('can be destroyed', () => {
        const scheduler = new Scheduler
        const timer = new Timer(scheduler)
        assert.equal(scheduler.listenerCount('set'), 1, 'one set listener')
        assert.equal(scheduler.listenerCount('unset'), 1, 'one unset listener')
        timer.destroy()
        assert.equal(scheduler.listenerCount('set'), 0, 'no set listeners')
        assert.equal(scheduler.listenerCount('unset'), 0, 'no unset listeners')
    })
})
