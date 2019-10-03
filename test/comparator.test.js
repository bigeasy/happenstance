require('proof')(5, (okay) => {
    const comparator = require('../comparator')
    okay(comparator({ when: 0, key: 'a' }, { when: 1, key: 'a' }) < 0, 'when less than')
    okay(comparator({ when: 1, key: 'a' }, { when: 0, key: 'a' }) > 0, 'when greater than')
    okay(comparator({ when: 0, key: 'a' }, { when: 0, key: 'b' }) < 0, 'key less than')
    okay(comparator({ when: 0, key: 'b' }, { when: 0, key: 'a' }) > 0, 'key greater than')
    okay(comparator({ when: 0, key: 'a' }, { when: 0, key: 'a' }) == 0, 'equal')
})
