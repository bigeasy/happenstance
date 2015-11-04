[![Build Status](https://travis-ci.org/bigeasy/happenstance.svg?branch=master)](https://travis-ci.org/bigeasy/happenstance) [![Coverage Status](https://coveralls.io/repos/bigeasy/happenstance/badge.svg?branch=master&service=github)](https://coveralls.io/github/bigeasy/happenstance?branch=master) [![Stories in Ready](https://badge.waffle.io/bigeasy/happenstance.png?label=ready&title=Ready)](https://waffle.io/bigeasy/happenstance)

Happenstance is a scheduler. You put values in it. They come back out when the
time is right. It doesn't set timers, so you'll need to check with it at regular
intervals.

```
var Scheduler = require('happenstance')

var scheduler = new Scheduler

scheduler.schedule({
    key: 'a',
    delay: [ 30000, 45000 ],
    value: 1
})

scheduler.schedule({
    key: 'b',
    delay: [ 30000, 45000 ],
    value: 2
})

scheduler.schedule({
    key: 'c',
    delay: [ 120000 ],
    value: 3
})

scheduler.unschedule('b')

setTimeout(function () {
    console.log('after one minute')
    console.log(scheduler.check())
    setTimeout(function () {
        console.log('after two and a half minutes')
    }, 90000)
}, 60000)
```

The above program will print the following.

```
$ node schedule.js
after one minute
a
after two and a half minutes
c
```

### new Scheduler(options)

Createa  new `Scheduler` object. The only option is `Date` which lets you
specify an implementation of `Date.now` so you can control the `Scheduler`
during testing.

```javascript
// Create a scheduler with a dummy clock.
var time = 0
var scheduler = new Scheduler({
    Date: { now: function () { return time } }
})

// Schedule something.
scheduler.schedule({ key: 'a', value: 1, delay: 1 })

// Advance the clock and check the result.
time += 2
assert(scheduler.check()[0], 1)
```

This is the reason I created this library, to test scheduled events and the
passage of time.

### scheduler.schedule(options)

Options are:

 * `key` an key that you can use to remove the event using `unschedule`.
 * `value` the value returned when the event is due.
 * `delay` the amount of time to wait, either an exact value or a range if
 you're trying to stagger events.

### scheduler.unschedule(key)

Unschedule the event with the given key.


### scheduler.clear()

Clear all scheduled events.
