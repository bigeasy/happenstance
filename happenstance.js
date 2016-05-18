var RBTree = require('bintrees').RBTree
var assert = require('assert')
var Operation = require('operation')
var slice = [].slice
var events = require('events')
var util = require('util')

function Scheduler (options) {
    options || (options = {})
    this.what = {}
    this.when = new RBTree(function (a, b) { return a.when - b.when })
    this._timeout = null
    this._Date = options.Date || Date
    this._timer = !('timer' in options) || options.timer
    events.EventEmitter.call(this)
}
util.inherits(Scheduler, events.EventEmitter)

Scheduler.prototype._clear = function () {
    if (this._timer && this._timeout != null) {
        clearTimeout(this._timeout)
        this._timeout = null
    }
}

Scheduler.prototype._set = function () {
    if (this._timer && this._timeout == null && this.next() != null) {
        var now = this._Date.now()
        var timeout = Math.max(0, this.next() - now)
        if (timeout == 0) {
            this._onTimeout()
        } else {
            this._timeout = setTimeout(this._onTimeout.bind(this), timeout)
            this._timeout.unref()
        }
    }
}

Scheduler.prototype._onTimeout = function () {
    this._timeout = null
    var now = this._Date.now()
    this.check(now)
    this.emit('timeout', now)
    this._set()
}

Scheduler.prototype.scheduled = function (key) {
    var scheduled = this.what[key]
    return scheduled ? scheduled.when : null
}

Scheduler.prototype.schedule = function (when, key, operation) {
    this._clear()

    var operation = new Operation(operation, slice.call(arguments, 3))
    var event = { when: when, key: key, operation: operation }

    this.unschedule(event.key)

    var date = this.when.find({ when: event.when })
    if (date == null) {
        date = { when: event.when, events: [] }
        this.when.insert(date)
    }
    date.events.push(event)
    this.what[event.key] = event

    this._set()
}

Scheduler.prototype.unschedule = function (key) {
    this._clear()

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

    this._set()
}

Scheduler.prototype.check = function (now) {
    var events = 0
    for (;;) {
        var date = this.when.min()
        if (!date || date.when > now) {
            break
        }
        this.when.remove(date)
        date.events.forEach(function (event) {
            events++
            delete this.what[event.key]
            event.operation.apply([ now ], [])
        }, this)
    }
    return events
}

Scheduler.prototype.clear = function () {
    this._clear()
    this.what = {}
    this.when.clear()
}

Scheduler.prototype.next = function () {
    return this.when.size ? this.when.min().when : null
}

module.exports = Scheduler
