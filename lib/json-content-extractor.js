
const isStream = require('./is-stream')


function textOnly(raw) {
	try {
		let content = ''
		
		let obj
		
		if(typeof raw === 'string') {
			obj = JSON.parse(raw)
		}
		else if(typeof raw === 'object'){
			obj = raw
		}
		
		if(obj) {
			Object.values(obj).forEach((val) => {
				if(val && typeof val === 'string') {
					content += val.toString() + ' '
				}
				else if(val && typeof val === 'object') {
					content += textOnly(val) + ' '
				}
			})
		}
		return content
	}
	catch(e) {
		return raw
	}
}

function extract(contents, callback) {
	if(isStream(contents)) {

		let chunks = []
		let readStream = contents
		readStream.on("data", function(chunk) {
			chunks.push(chunk);
		})

		readStream.on("end", function() {
			callback(null, textOnly(Buffer.concat(chunks).toString()))
		})
	}
	else {
		callback(null, textOnly(contents))
	}
}


module.exports = extract