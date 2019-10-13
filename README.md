[![Actions Status](https://github.com/bigeasy/happenstance/workflows/Node%20CI/badge.svg)](https://github.com/bigeasy/happenstance/actions)
[![codecov](https://codecov.io/gh/bigeasy/happenstance/branch/master/graph/badge.svg)](https://codecov.io/gh/bigeasy/happenstanchappenstance
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Happenstance is a scheduler. You put values in it. They come back out when the
time is right. It doesn't set timers, so you'll need to check with it at regular
intervals.

| What          | Where                                             |
| --- | --- |
| Discussion    | https://github.com/bigeasy/happenstance/issues/1  |
| Documentation | https://bigeasy.github.io/happenstance            |
| Source        | https://github.com/bigeasy/happenstance           |
| Issues        | https://github.com/bigeasy/happenstance/issues    |
| CI            | https://travis-ci.org/bigeasy/happenstance        |
| Coverage:     | https://codecov.io/gh/bigeasy/happenstance        |
| License:      | MIT                                               |


```
npm install happenstance
```

TK: All out dated! Ugh!
TK: Why isn't it setting timers itself. Kind of a silly spearation. Oh, because
we want to ignore timers in Paxos sometimes. Right.


```
var Scheduler = require('happenstance')

var scheduler = new Scheduler

scheduler.schedule('a', 1, Date.now() + 30000)
scheduler.schedule('b', 1, Date.now() + 30000)
scheduler.schedule('c', 3, Date.now() + 120000)

scheduler.unschedule('b')

setTimeout(function () {
    console.log('after one minute')
    console.log(scheduler.check(Date.now()).pop())
    setTimeout(function () {
        console.log('after two and a half minutes')
        console.log(scheduler.check(Date.now()).pop())
    }, 90000)
}, 60000)
```

The above program will print the following.

```
$ node schedule.js
after one minute
1
after two and a half minutes
3
```

#### `new Scheduler`

Createa  new `Scheduler` object.

#### `scheduler.schedule(key, value, when)`

Options are:

 * `key` an key that you can use to remove the event using `unschedule`.
 * `value` the value returned when the event is due.
 * `when` time time after which the event is due.

#### `scheduler.unschedule(key)`

Unschedule the event with the given key.

#### `scheduler.check(now)`

Return any events currently due.

#### `scheduler.clear()`

Clear all scheduled events.

## Diary

This is all seeming very dubious now. It seems like it would be better to have a
clock rather than a range for a delay.

```javascript
console.log(scheduler.tick())
scheduler.schedule(key, value, 1, 4)
scheduler.check().forEach(doWork)
```

The above would pull a random number from the random number generator that would
be used for all delays in the next series of ticks.

The only immediate downstream is Paxos, and it doesn't really need to stagger
its events, since events going to eminate out from the core of the algorithm,
there is no point in providing back-off logic.

Okay, so it is not here, I've removed delay ranges, because that's back-off
stuff and it doesn't belong here, it should be just external so you can record
it for replaying.
