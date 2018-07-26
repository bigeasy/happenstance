var Procession = require('procession')

function Timer (scheduler) {
    this.events = new Procession
    this._timeout = null
    this._scheduler = scheduler
}

Timer.prototype.push = function (event) {
    switch (event && event.method) {
    case 'set':
        var now = Date.now()
        this._unset()
        this._timeout = setTimeout(this._check.bind(this), Math.max(event.body.when - now, 0))
        break
    case 'unset':
        this._unset()
        break
    default:
        this.events.push(event)
        break
    }
}

Timer.prototype.enqueue = function (event, callback) {
    this.push(event)
    callback()
}

Timer.prototype._check = function () {
    var now = Date.now()
    this._timeout = null
    this._scheduler.check(now)
}

Timer.prototype._unset = function () {
    if (this._timeout != null) {
        clearTimeout(this._timeout)
        this._timeout = null
    }
}

module.exports = Timer
