describe('scheduler', () => {
    const assert = require('assert')
    const Scheduler = require('..').Scheduler
    it('can report nothing scheduled', () => {
        const scheduler = new Scheduler
        assert.equal(scheduler.next(), null, 'nothing scheduled')
        assert.equal(scheduler.when('x'), null, 'not scheduled')
    })
    it('can schedule an event', () => {
        const scheduler = new Scheduler
        const test = []
        scheduler.on('set', when => test.push(when))
        scheduler.schedule(1, 'x', 'X')
        assert.equal(scheduler.next(), 1, 'something scheduled')
        assert.equal(scheduler.when('x'), 1, 'x scheduled')
        assert.deepStrictEqual(scheduler.calendar(), [{
            when: 1,
            key: 'x',
            body: 'X'
        }], 'calendar')
        assert.deepStrictEqual(test, [ 1 ], 'test')
    })
    it('will not reset the timer on schedule if not necessary', () => {
        const test = []
        const scheduler = new Scheduler
        scheduler.on('set', when => test.push(when))
        scheduler.schedule(1, 'x', 'X')
        scheduler.schedule(1, 'y', 'Y')
        scheduler.schedule(2, 'z', 'Z')
        assert.equal(scheduler.next(), 1, 'something scheduled')
        assert.deepStrictEqual(test, [ 1 ], 'test')
    })
    it('can unschedule an event', () => {
        const test = []
        const scheduler = new Scheduler
        scheduler.on('set', when => test.push(when))
        scheduler.on('unset', () => test.push('unset'))
        scheduler.schedule(1, 'x', 'X')
        assert.equal(scheduler.next(), 1, 'something scheduled')
        scheduler.unschedule('x')
        assert.equal(scheduler.next(), null, 'nothing scheduled')
        assert.deepStrictEqual(test, [ 1, 'unset' ], 'test')
    })
    it('will reset the timer an unscheduleed event is the earliest', () => {
        const test = []
        const scheduler = new Scheduler
        scheduler.on('set', when => test.push(when))
        scheduler.on('unset', () => test.push('unset'))
        scheduler.schedule(1, 'x', 'X')
        scheduler.schedule(2, 'y', 'Y')
        assert.equal(scheduler.next(), 1, 'something scheduled')
        scheduler.unschedule('x')
        assert.equal(scheduler.next(), 2, 'rescheduled')
        assert.deepStrictEqual(test, [ 1, 2 ], 'test')
    })
    it('will not reset the timer an unscheduleed event not is the earliest', () => {
        const test = []
        const scheduler = new Scheduler
        scheduler.on('set', when => test.push(when))
        scheduler.on('unset', () => test.push('unset'))
        scheduler.schedule(1, 'x', 'X')
        scheduler.schedule(2, 'y', 'Y')
        assert.equal(scheduler.next(), 1, 'something scheduled')
        scheduler.unschedule('y')
        assert.equal(scheduler.next(), 1, 'same schedule')
        assert.deepStrictEqual(test, [ 1 ], 'test')
    })
    it('can check for events', () => {
        const test = []
        const scheduler = new Scheduler
        scheduler.on('set', when => test.push(when))
        scheduler.on('unset', () => test.push('unset'))
        scheduler.on('data', data => test.push(data))
        scheduler.schedule(1, 'x', 'X')
        scheduler.schedule(2, 'y', 'Y')
        assert.equal(scheduler.next(), 1, 'something scheduled')
        scheduler.check(1)
        assert.equal(scheduler.next(), 2, 'new schedule')
        assert.deepStrictEqual(test, [
            1, { key: 'x', body: 'X', now: 1, when: 1 }, 2
        ], 'test')
    })
    it('can unset the timer when a check consumes all events', () => {
        const test = []
        const scheduler = new Scheduler
        scheduler.on('set', when => test.push(when))
        scheduler.on('unset', () => test.push('unset'))
        scheduler.on('data', data => test.push(data))
        scheduler.schedule(1, 'x', 'X')
        scheduler.schedule(2, 'y', 'Y')
        assert.equal(scheduler.next(), 1, 'something scheduled')
        scheduler.check(2)
        assert.equal(scheduler.next(), null, 'no schedule')
        assert.deepStrictEqual(test, [
            1,
            { key: 'x', body: 'X', now: 2, when: 1 },
            { key: 'y', body: 'Y', now: 2, when: 2 },
            'unset'
        ], 'test')
    })
    it('can clear all events', () => {
        const test = []
        const scheduler = new Scheduler
        scheduler.on('set', when => test.push(when))
        scheduler.on('unset', () => test.push('unset'))
        scheduler.on('data', data => test.push(data))
        scheduler.schedule(1, 'x', 'X')
        scheduler.schedule(2, 'y', 'Y')
        assert.equal(scheduler.next(), 1, 'something scheduled')
        scheduler.clear()
        assert.equal(scheduler.next(), null, 'no schedule')
        assert.deepStrictEqual(test, [ 1, 'unset' ], 'test')
    })
})
