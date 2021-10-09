// [![Actions Status](https://github.com/bigeasy/happenstance/workflows/Node%20CI/badge.svg)](https://github.com/bigeasy/happenstance/actions)
// [![codecov](https://codecov.io/gh/bigeasy/happenstance/branch/master/graph/badge.svg)](https://codecov.io/gh/bigeasy/happenstance)
// [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
//
// An event scheduler to manage multiple timed events using a single `setTimeout`.
//
// | What          | Where                                             |
// | --- | --- |
// | Discussion    | https://github.com/bigeasy/happenstance/issues/1  |
// | Documentation | https://bigeasy.github.io/happenstance            |
// | Source        | https://github.com/bigeasy/happenstance           |
// | Issues        | https://github.com/bigeasy/happenstance/issues    |
// | CI            | https://travis-ci.org/bigeasy/happenstance        |
// | Coverage:     | https://codecov.io/gh/bigeasy/happenstance        |
// | License:      | MIT                                               |

// ## Living `README.md`
//
// This `README.md` is also a unit test using the
// [Proof](https://github.com/bigeasy/proof) unit test framework. We'll use the
// Proof `okay` function to assert out statements in the readme. A Proof unit test
// generally looks like this.

require('proof')(13, async okay => {
    // ## About

    {
        // Happenstance is an event calendar. Rather than managing many different
        // `setTimeout` handles for different timed events, or checking a list of things to
        // do in a `setInterval` function, Happenstance schedules a heterogeneous
        // collection of events in a calendar of events and emits those events as they
        // arise using a single, internally managed `setTimeout` handle.
        //
        // Happenstance implements the `EventEmitter` interface. You schedule an event for
        // a unique key at a specific time with an event message body. When you check the
        // calendar with a POSIX timestamp, the event calendar will emit the events that
        // were scheduled at or before the timestamp.
        //
        // The timer is separate from the calendar and optional. The motivation for
        // Happenstance was to have the ability to run an algorithm (Paxos) that has timed
        // events, recording the timestamps of calendar checks so that the exact same run
        // of the algorithm could be replayed for debugging.
        //
        // Note to self: You forget about Happenstance because of your motivation for
        // writing it, the replay ability, but rediscover it after fussing around with
        // `setInterval` for too long. The calendar model is itself very valuable.
        //
        // Note to self: In Paxos replay you schedule events but you do not call check.
        // Instead you replay the emitted events. You could also record the checks and
        // replay those into the calendar. This would be necessary if you depend on `what`,
        // `when` or `get`, but you don't use them in Paxos and you haven't found a
        // subsequent use for the replay.
        //
        // ## Overview
        //
        // Happenstance is an event calendar. You schedule an event using a POSIX
        // timestamp. You call `check` with a POSIX timestamp of the current time and if
        // there are any events whose scheduled timestamp is at or before the check
        // timestamp those events are emitted from the `'data'` event.

        const { Calendar } = require('..')

        // Create a new calendar.
        const calendar = new Calendar

        // Schedule an event.
        calendar.schedule(7, 'x', { value: 1 })

        // A once listener for the sake of the unit test.
        calendar.once('data', ({ now, when, key, body }) => {
            okay({ now, when, key, body }, {
                now: 11,
                when: 7,
                key: 'x',
                body: { value: 1 }
            }, 'event emitted')
        })

        // Timestamp is before the scheduled event, no event emitted.
        calendar.check(4)

        // Timestamp is after the scheduled event, event emitted.
        calendar.check(11)

        // You can get properties for a scheduled event using `what`, `when` and `get`.

        calendar.schedule(14, 'y', { value: 1 })

        // Get all the properties for the event.
        okay(calendar.get('y'), {
            when: 14, key: 'y', body: { value: 1 }
        }, 'get')

        // Get the scheduled time for the event.
        okay(calendar.when('y'), 14, 'when')

        // Get the message body for the event.
        okay(calendar.what('y'), { value: 1 }, 'what')

        // A once listener for the sake of the unit test.
        calendar.once('data', ({ now, when, key, body }) => {
            okay({ now, when, key, body }, {
                now: 19,
                when: 14,
                key: 'y',
                body: { value: 1 }
            }, 'second event emitted')
        })

        // Will emit a the scheduled event.
        calendar.check(19)

        // Now all the property inspectors return `null`.
        okay(calendar.get('y'), null, 'get null')
        okay(calendar.when('y'), null, 'when null')
        okay(calendar.what('y'), null, 'what null')

        // We can schedule multiple events. The events will be emitted in the order in
        // which they scheduled. Events scheduled for the same timestamp are emitted in the
        // sort order of the keys.

        // Create a listener to gather events into an array.
        const events = [], multiple = event => {
            events.push(event)
        }
        calendar.on('data', multiple)

        // Schedule multiple events.
        calendar.schedule(28, 'z', { value: 1 })
        calendar.schedule(28, 'y', { value: 2 })
        calendar.schedule(29, 'x', { value: 3 })

        // Send all the events prior to the given timestamp.
        calendar.check(35)

        // They are all consumed and will not be emitted again.
        calendar.check(35)

        okay(events, [{
            now: 35, when: 28, key: 'y', body: { value: 2 }
        }, {
            now: 35, when: 28, key: 'z', body: { value: 1 }
        }, {
            now: 35, when: 29, key: 'x', body: { value: 3 }
        }], 'multiple events')

        // Remove the listener for further unit tests.
        calendar.removeListener('data', multiple)

        // Events can be rescheduled using the key.

        // A once listener for the sake of the unit test.
        calendar.once('data', ({ now, when, key, body }) => {
            okay({ now, when, key, body }, {
                now: 35,
                when: 35,
                key: 'z',
                body: { value: 1 }
            }, 'third event emitted')
        })

        // Schedule an event.
        calendar.schedule(29, 'z', { value: 1 })

        // Schedule an event with the same key, the event gets rescheduled.
        calendar.schedule(35, 'z', { value: 1 })

        // Will not emit an event.
        calendar.check(30)

        // Rescheuled event emitted.
        calendar.check(35)

        // Events can be unscheduled using the key.

        // Regsiter a listener that could respond to multiple events.
        const listener = ({ now, when, key, body }) => {
            okay({ now, when, key, body }, {
                now: 42,
                when: 40,
                key: 'y',
                body: { value: 1 }
            }, 'fourth event emitted')
        }
        calendar.on('data', listener)

        // Schedule two events.
        calendar.schedule(38, 'x', { value: 1 })
        calendar.schedule(40, 'y', { value: 1 })

        // We unscheudle one of the events.
        calendar.unschedule('x')

        // Event has been removed.
        okay(calendar.what('x'), null, 'event unscheduled')

        // Trigger the remaining event.
        calendar.check(42)

        // Remove the listener for further unit tests.
        calendar.removeListener('data', listener)

        // The event calendar does not have a timer built into it. There is a `Timer` class
        // that will set a single `setTimeout` to check the calendar at the precise moment
        // that the next scheduled event is due.

        // Require the `Timer` class.
        const { Timer } = require('..')

        // Create a timer that will `setTimeout` for the next event in the given
        // calendar.
        const timer = new Timer(calendar)

        // A once listener for the sake of the unit test.
        calendar.once('data', ({ key, body }) => {
            okay({
                key, body
            }, {
                key: 'x', body: { value: 1 }
            }, 'timer triggered event')
        })

        // Schedule an event 50ms into the future.
        calendar.schedule(Date.now() + 50, 'x', { value: 1 })

        // Wait for the above event to fire.
        await new Promise(resolve => setTimeout(resolve, 100))

        // Destroy the timer, clears any `setTimeout` stops listening to calendar.
        timer.destroy()
    }
})

// You can run this unit test yourself to see the output from the various
// code sections of the readme.

// As noted the motivation for the separate `Timer` class was to allow for
// recording and replaying timer events for debugging.
