require('proof/redux')(2, prove)

function prove (assert) {
    var Timer = require('../timer')

    var now = 0
    var timer = new Timer({
        check: function (now) {
            assert(true, 'called')
        }
    })
    var shifter = timer.events.shifter()

    timer.push({
        module: 'happenstance',
        method: 'set',
        body: { when: Date.now() - 5000 }
    })

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
}
