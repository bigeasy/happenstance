require('proof')(6, prove)

function prove (okay) {
    var RBTree = require('bintrees').RBTree
    var comparator = require('../comparator')
    okay(comparator({ when: 0, key: 'a' }, { when: 1, key: 'a' }) < 0, 'when less than')
    okay(comparator({ when: 1, key: 'a' }, { when: 0, key: 'a' }) > 0, 'when greater than')
    okay(comparator({ when: 0, key: 'a' }, { when: 0, key: 'b' }) < 0, 'key less than')
    okay(comparator({ when: 0, key: 'b' }, { when: 0, key: 'a' }) > 0, 'key greater than')
    okay(comparator({ when: 0, key: 'a' }, { when: 0, key: 'a' }) == 0, 'equal')
    var tree = new RBTree(comparator)
    tree.insert({ when: 0, key: 'c' })
    tree.insert({ when: 0, key: 'b' })
    tree.insert({ when: 0, key: 'a' })
    tree.insert({ when: 0, key: 'e' })
    tree.insert({ when: 0, key: 'd' })
    tree.insert({ when: 5, key: 'c' })
    tree.insert({ when: 2, key: 'b' })
    tree.insert({ when: 3, key: 'a' })
    tree.insert({ when: 4, key: 'e' })
    tree.insert({ when: 1, key: 'd' })
    var gather = []
    tree.each(gather.push.bind(gather))
    okay(gather, [{
        when: 0, key: 'a'
    }, {
        when: 0, key: 'b'
    }, {
        when: 0, key: 'c'
    }, {
        when: 0, key: 'd'
    }, {
        when: 0, key: 'e'
    }, {
        when: 1, key: 'd'
    }, {
        when: 2, key: 'b'
    }, {
        when: 3, key: 'a'
    }, {
        when: 4, key: 'e'
    }, {
        when: 5, key: 'c'
    }], 'gather')
}
