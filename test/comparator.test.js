describe('comparator', () => {
    const assert = require('assert')
    const comparator = require('../comparator')
    it('can compare when less than', () => {
        assert(comparator({ when: 0, key: 'a' }, { when: 1, key: 'a' }) < 0, 'when less than')
    })
    it('can compare when greater than', () => {
        assert(comparator({ when: 1, key: 'a' }, { when: 0, key: 'a' }) > 0, 'when greater than')
    })
    it('can compare key less than', () => {
        assert(comparator({ when: 0, key: 'a' }, { when: 0, key: 'b' }) < 0, 'key less than')
    })
    it('can compare key grater than', () => {
        assert(comparator({ when: 0, key: 'b' }, { when: 0, key: 'a' }) > 0, 'key greater than')
    })
    it('can compare equal', () => {
        assert(comparator({ when: 0, key: 'a' }, { when: 0, key: 'a' }) == 0, 'equal')
    })
})
