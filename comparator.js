module.exports = function (left, right) {
    var compare = left.when - right.when
    if (compare != 0) {
        return compare
    }
    if (left.key < right.key) {
        return -1
    }
    if (left.key > right.key) {
        return 1
    }
    return 0
}
