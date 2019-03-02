require('proof')(2, prove)

function prove (okay, callback) {
    var Timer = require('..').Timer

    var now = 0
    var timer = new Timer({
        check: function (now) {
            okay('called')
            callback()
        },
        calendar: function () {
            return {}
        }
    })
    var shifter = timer.events.shifter()

    timer.enqueue({
        module: 'happenstance',
        method: 'event',
        body: 1
    }, function () {})

    timer.push({
        module: 'happenstance',
        method: 'set',
        body: { when: Date.now() + 5000 }
    })

    timer.push({
        module: 'happenstance',
        method: 'unset',
        body: null
    })

    okay(shifter.shift(), {
        module: 'happenstance',
        method: 'event',
        body: 1
    }, 'pass through')

    timer.push({
        module: 'happenstance',
        method: 'set',
        body: { when: Date.now() - 5000 }
    })
}
