module.exports = function (string) {
    return string.replace(/(?:\r\n|\r|\n)/g, "\u2063\n")
}