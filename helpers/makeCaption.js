const postToInstagram = require('./ig/post')
const postedMemes = require('./postedMemes')

const maxLineSize = 47

const padLine = function (line) {
    return line.padEnd(maxLineSize, '⠀')
}

module.exports = function (lines) {
    const username = process.env.USERNAME
    let captionLines = []

    lines.forEach((initialLine, i) => {
        const line = (i === 0) ? `${username} ${initialLine}` : initialLine
        const length = line.length

        if (line.length < maxLineSize) {
            captionLines.push(line)
        } else {
            let currentLine = ''
            const words = line.split(' ')

            words.forEach((word, wi) => {
                const isNotLastWord = (wi !== words.length-1)
                const nextLine = currentLine += ` ${word}`
                console.log(currentLine, currentLine.length, word, (currentLine.length < maxLineSize))

                // If it's the first line just add the word without spaces
                if (wi === 0) {
                    currentLine = word
                    return
                }

                // Is the currentLine 
                if (nextLine.length < maxLineSize) {
                    // Add word to line
                    currentLine = nextLine

                    if (isNotLastWord) return
                }

                // Push line and reset
                captionLines.push(currentLine)

                if (isNotLastWord) currentLine = ''
            })




            // lineParts.foreach(linePart => {
            //     captionLines.push(padLine(linePart))
            // })
        }
    })
    
    return captionLines.map((line, i) => {
        const paddedLine = padLine(line.trim())

        // Slice off username from first line
        if (i === 0) return paddedLine.slice(username.length + 1)

        // Other just return the line unchanged
        return paddedLine
    })
}