class Timer {
    constructor (scheduler) {
        this._listeners = {
            set: (when) => {
                const now = Date.now()
                this._unset()
                this._timeout = setTimeout(() => this._check(), Math.max(when - now, 0))
            },
            unset: () => this._unset()
        }
        for (const listener in this._listeners) {
            scheduler.on(listener, this._listeners[listener])
        }
        this._timeout = null
        this._scheduler = scheduler
    }

    destroy () {
        this._unset()
        for (const listener in this._listeners) {
            this._scheduler.removeListener(listener, this._listeners[listener])
        }
    }

    _check () {
        var now = Date.now()
        this._timeout = null
        this._scheduler.check(now)
    }

    _unset () {
        if (this._timeout != null) {
            clearTimeout(this._timeout)
            this._timeout = null
        }
    }
}

module.exports = Timer
