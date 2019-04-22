const isDev = (process.env.NODE_ENV !== 'production')

const christianMemeHashtags = [
    'biblememes',
    'christianmemes',
    'christianmemesdaily',
    'christianmemeserver',
    'churchmemes',
    'dankchristianmemes',
    'edgychristianmemes',
    'epicchristianmemes',
    'godsmemesquad',
    'holymeme',
    'jesusmeme',
    'jesusmemes',
    'memesforjesus',
    'religiousmemes'
]

const memeHashtags = [
    'dankest',
    'dankmeme',
    'dankmemedaily',
    'juicymemes',
    'memed',
    'mememachine',
    'memes2good',
    'memes4you',
    'memes4life',
    'memesbelike',
    'memeslivesmatter',
    'memester',
    'memeo',
    'memeteam',
    'qualitymemes'
]

module.exports = function () {
    const randomChristianHashtags = christianMemeHashtags.sort(() => .5 - Math.random()).slice(0,15)

    const randomMemeHashtags = memeHashtags.sort(() => .5 - Math.random()).slice(0,10)

    const combinedHashtags = [
        ...randomChristianHashtags,
        ...randomMemeHashtags
    ]

    if (isDev) return combinedHashtags.join(' ')

    return combinedHashtags.map(hashtag => `#${hashtag}`).join(' ')
}