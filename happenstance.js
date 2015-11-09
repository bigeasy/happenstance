var RBTree = require('bintrees').RBTree
var assert = require('assert')

function Scheduler (seed) {
    this.what = {}
    this.when = new RBTree(function (a, b) { return a.when - b.when })
}

Scheduler.prototype.schedule = function (key, value, when) {
    var event = { key: key, value: value, when: when }

    this.unschedule(event.key)

    var date = this.when.find({ when: event.when })
    if (date == null) {
        date = { when: event.when, events: [] }
        this.when.insert(date)
    }
    date.events.push(event)
    this.what[event.key] = event

    return event
}

Scheduler.prototype.unschedule = function (key) {
    var scheduled = this.what[key]
    if (scheduled) {
        delete this.what[key]
        var date = this.when.find({ when: scheduled.when })
        var index = date.events.indexOf(scheduled)
        assert(~index, 'cannot find scheduled event')
        date.events.splice(index, 1)
        if (date.events.length == 0) {
            this.when.remove(date)
        }
    }
}

Scheduler.prototype.check = function (now) {
    var happening = []
    for (;;) {
        var date = this.when.min()
        if (!date || date.when > now) {
            break
        }
        this.when.remove(date)
        date.events.forEach(function (event) {
            delete this.what[event.key]
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
