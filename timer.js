var Procession = require('procession')
var coalesce = require('nascent.coalesce')

function Timer (scheduler, options) {
    options || (options = {})
    this.events = new Procession
    this._timeout = null
    this._scheduler = scheduler
}

Timer.prototype.push = function (event) {
    switch (event.method) {
    case 'set':
        this._unset()
        var now = Date.now()
        if (event.body.when <= now) {
            this._check(now)
        } else {
            this._timeout = setTimeout(this._check.bind(this), event.body.when - now)
        }
        break
    case 'unset':
        this._unset()
        break
    default:
        this.events.push(event)
        break
    }
}

Timer.prototype._check = function () {
    this._scheduler.check(Date.now())
}

Timer.prototype._unset = function () {
    if (this._timeout != null) {
        clearTimeout(this._timeout)
        this._timeout = null
    }
}

module.exports = Timer
