const cheerio = require('cheerio')

const isStream = require('./is-stream')


function textOnly(raw) {
	return cheerio.load(raw).text()
}

function extract(contents, callback) {
	if(isStream(contents)) {

		let chunks = []
		let readStream = contents
		readStream.on("data", function(chunk) {
			chunks.push(chunk);
		})

		readStream.on("end", function() {
			callback(null, textOnly(Buffer.concat(chunks)))
		})
	}
	else {
		callback(null, textOnly(contents))
	}
}


module.exports = extract