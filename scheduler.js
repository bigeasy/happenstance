// Common utilities.
var assert = require('assert')
var util = require('util')

// Ordered map implemented as a red-black tree.
var RBTree = require('bintrees').RBTree

// An evented message queue used for events and timer events.
var Procession = require('procession')

// Our scheduler emits two types of events through its `events` queue. It does
// not maintain a timer itself, nor does it check the system clock, but instead
// emits events based on timestamps given to it. This allows you to have a timer
// whose events can be recorded and replayed.

//
function Scheduler () {
    this._what = {}
    this._when = new RBTree(function (a, b) { return a.when - b.when })
    this.events = new Procession
}

Scheduler.prototype.calendar = function () {
    var iterator = this._when.iterator(),  moment
    var events = []
    while ((moment = iterator.next()) != null) {
        events.push.apply(events, moment.events)
    }
    return events
}

Scheduler.prototype.when = function (key) {
    var scheduled = this._what[key]
    return scheduled ? scheduled.when : null
}

Scheduler.prototype.next = function () {
    return this._when.size ? this._when.min().when : null
}

Scheduler.prototype.schedule = function (when, key, body) {
    this._unschedule(this._what[key])

    var event = this._what[key] = {
        module: 'happenstance',
        method: 'event',
        when: when,
        key: key,
        body: body
    }

    var min = this._when.min()
    var set = min == null || when < min.when

    var date = this._when.find({ when: event.when })
    if (date == null) {
        date = { when: event.when, events: [] }
        this._when.insert(date)
    }
    date.events.push(event)

    if (set) {
        this.events.push({ module: 'happenstance', method: 'set', body: { when: when } })
    }
}

Scheduler.prototype.unschedule = function (key) {
    var scheduled = this._what[key]

    this._unschedule(scheduled)

    var min = this._when.min()

    if (min == null) {
        this.events.push({ module: 'happenstance', method: 'unset', body: null })
    } else if (scheduled != null && scheduled.when < min.when) {
        this.events.push({ module: 'happenstance', method: 'set', body: { when: min.when } })
    }
}

Scheduler.prototype._unschedule = function (scheduled) {
    if (scheduled) {
        delete this._what[scheduled.key]
        var date = this._when.find({ when: scheduled.when })
        var index = date.events.indexOf(scheduled)
        assert(~index, 'cannot find scheduled event')
        date.events.splice(index, 1)
        if (date.events.length == 0) {
            this._when.remove(date)
        }
    }
}

Scheduler.prototype.check = function (now) {
    var events = 0
    for (;;) {
        var min = this._when.min()
        if (!min || min.when > now) {
            break
        }
        while (min.events.length != 0) {
            events++
            var event = min.events.shift()
            delete this._what[event.key]
            this.events.push({
                module: 'happenstance',
                method: 'event',
                now: now,
                key: event.key,
                when: event.when,
                body: event.body
            })
        }
        this._when.remove(min)
    }
    if (min == null) {
        this.events.push({ module: 'happenstance', method: 'unset', body: null })
    } else {
        this.events.push({ module: 'happenstance', method: 'set', body: { when: min.when } })
    }
    // TODO Maybe shouldn't return, but I use it for testing in Paxos. Why not
    // just return the array of events? Why not just link a queue to the events
    // queue to test presence?
    return events
}

Scheduler.prototype.clear = function () {
    this._what = {}
    this._when.clear()
    this.events.push({ module: 'happenstance', method: 'unset', body: null })
}

module.exports = Scheduler
