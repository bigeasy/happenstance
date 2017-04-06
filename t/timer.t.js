require('proof')(2, prove)

function prove (assert, callback) {
    var Timer = require('..').Timer

    var now = 0
    var timer = new Timer({
        check: function (now) {
            assert(true, 'called')
            callback()
        }
    })
    var shifter = timer.events.shifter()

    timer.push({
        module: 'happenstance',
        method: 'event',
        body: 1
    })

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

    assert(shifter.shift(), {
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
