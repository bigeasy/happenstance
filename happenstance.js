var RBTree = require('bintrees').RBTree
var assert = require('assert')

function Scheduler (clock) {
    this.clock = clock || function () { return Date.now() }
    this.what = {}
    this.when = new RBTree(function (a, b) { return a.when - b.when })
}

Scheduler.prototype.delay = function (delay) {
    if (typeof delay == 'number') {
        delay = [ delay, delay ]
    }
    return Math.floor(Math.random() * (delay[1] - delay[0])) + delay[0]
}

Scheduler.prototype.schedule = function (event) {
    this.unschedule(event.id)

    event.when = this.clock() + this.delay(event.delay)
    var date = this.when.find({ when: event.when })
    if (date == null) {
        date = { when: event.when, events: [] }
        this.when.insert(date)
    }
    date.events.push(event)
    this.what[event.id] = event

    return event
}

Scheduler.prototype.unschedule = function (id) {
    var scheduled = this.what[id]
    if (scheduled) {
        delete this.what[id]
        var date = this.when.find({ when: scheduled.when })
        var index = date.events.indexOf(scheduled)
        assert(~index, 'cannot find scheduled event')
        date.events.splice(index, 1)
        if (date.events.length == 0) {
            this.when.remove(date)
        }
    }
}

Scheduler.prototype.check = function () {
    var happening = []
    for (;;) {
        var date = this.when.min()
        if (!date || date.when > this.clock()) {
            break
        }
        this.when.remove(date)
        date.events.forEach(function (event) {
            delete this.what[event.id]
            happening.push(event.value)
        }, this)
    }
    return happening
}

Scheduler.prototype.clear = function () {
    this.what = {}
    this.when.clear()
}

module.exports = Scheduler
