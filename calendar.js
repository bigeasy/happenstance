// Common utilities.
const assert = require('assert')
const events = require('events')

// Ordered map implemented as a red-black tree.
const RBTree = require('bintrees').RBTree

const comparator = require('./comparator')

// Our calendar emits two types of events through its `events` queue. It does
// not maintain a timer itself, nor does it check the system clock, but instead
// emits events based on timestamps given to it. This allows you to have a timer
// whose events can be recorded and replayed.

//
class Calendar extends events.EventEmitter {
    constructor () {
        super()
        this._what = {}
        this._when = new RBTree(comparator)
    }

    calendar () {
        let iterator = this._when.iterator(),  event
        const events = []
        while ((event = iterator.next()) != null) {
            events.push({ ...event })
        }
        return events
    }

    when (key) {
        const scheduled = this._what[key]
        return scheduled ? scheduled.when : null
    }

    what (key) {
        const scheduled = this._what[key]
        return scheduled ? scheduled.body : null
    }

    get (key) {
        return this._what[key] || null
    }

    next () {
        return this._when.size ? this._when.min().when : null
    }

    schedule (when, key, body) {
        this._unschedule(this._what[key])

        const event = this._what[key] = {
            when: when,
            key: key,
            body: body
        }

        const min = this._when.min()
        const set = min == null || when < min.when

        this._when.insert(event)

        if (set) {
            this.emit('set', when)
        }
    }

    unschedule (key) {
        const scheduled = this._what[key]

        this._unschedule(scheduled)

        const min = this._when.min()

        if (min == null) {
            this.emit('unset')
        } else if (scheduled != null && scheduled.when < min.when) {
            this.emit('set', min.when)
        }
    }

    _unschedule (scheduled) {
        if (scheduled) {
            delete this._what[scheduled.key]
            const found = this._when.remove({ when: scheduled.when, key: scheduled.key })
            assert(!! found, 'cannot find scheduled event')
        }
    }

    check (now) {
        let min
        for (;;) {
            min = this._when.min()
            if (!min || min.when > now) {
                break
            }
            this._when.remove(min)
            delete this._what[min.key]
            this.emit('data', { now, ...min })
        }
        if (min == null) {
            this.emit('unset')
        } else {
            this.emit('set', min.when)
        }
    }

    clear () {
        this._what = {}
        this._when.clear()
        this.emit('unset')
    }
}

module.exports = Calendar
