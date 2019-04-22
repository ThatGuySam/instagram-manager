let currentDomain = ''

module.exports.set = function (domain) {
    currentDomain = domain
}

module.exports.get = () => currentDomain