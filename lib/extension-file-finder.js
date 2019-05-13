
const { exec } = require('child_process')

function findFiles(root, extension, callback) {
	exec('find ' + root + ' -iname "*.' + extension + '"', (err, stdout, stderr) => {
		if(err) {
			callback(err)
		}
		else {
			let fileList = stdout.toString()
			docsToIndex = fileList.split('\n')
			docsToIndex = docsToIndex.filter((item) => {
				return !!item
			})
			callback(null, docsToIndex)
		}
	})
	
}

module.exports = findFiles