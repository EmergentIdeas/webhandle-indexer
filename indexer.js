const BiDiMap = require('./lib/bidimap')
const _ = require('underscore')

let allowedCharMap = Array.from('abcdefghijklmnopqrstuvwxyz1234567890 ').reduce((acc, cur) => {
	acc[cur] = cur
	return acc
}, {})

class Indexer {
	constructor(options) {
		options = options || {}
		this.loadData(options)
	}
	
	loadData(data) {
		this.docMap = new BiDiMap(data.docList)
		this.wordList = data.wordList || {}
		
		this.nextIndex = Object.values(this.docMap.forMap).reduce((max, cur) => max > cur ? max : cur, 0) + 1
	}
	
	loadFromFile(indexFileName, callback) {
		fs.readFile(serializedIndexName, (err, data) => {
			if(err) {
				console.log(err)
				if(callback) {
					callback(err)
				}
			}
			else {
				this.loadData(JSON.parse(data))
				if(callback) {
					callback()
				}
			}
		})
	}
	
	saveToFile(indexFileName, callback) {
		fs.createWriteStream(indexFileName).end(
			JSON.stringify({
				docList: this.docMap.forMap,
				wordList: this.wordList
			})			
		)
	}
	
	findDocNum(name) {
		let num = this.docMap.getRight(name)
		if(!num) {
			num = this.nextIndex++
			this.docMap.set(name, num)
		}
		return num
	}
	
	cleanTextOnly(content) {
		content = content.toLowerCase()
		let b = []
		b[content.length] = null
		let a = Array.from(content)
		let length = 0;
		
		for(let c of a) {
			if(allowedCharMap[c]) {
				b[length++] = c
			}
		}
		
		return b.slice(0, length).join('')
	}
	
	indexDocument(name, content) {
		let docNum = this.findDocNum(name)
		
		let wordIndex = {}
		
		let words = this.cleanTextOnly(content).split(' ')
		for(let word of words) {
			word = word.trim()
			if(word) {
				wordIndex[word] = word
			}
		}
		
		for(let word of Object.keys(wordIndex)) {
			let docNums = this.wordList[word]
			if(!docNums) {
				docNums = []
				this.wordList[word] = docNums
			}
			docNums.push(docNum)
		}
	}
	
	search(query) {
		let docNums
		let words = query.toLowerCase().split(' ')
		for(let word of words) {
			word = word.trim()
			if(word) {
				let l = this.wordList[word]
				if(l && l.length > 0) {
					if(!docNums) {
						docNums = l
					}
					else {
						docNums = _.intersection(docNums, l)
					}
				}
			}
		}
		
		for(let word of words) {
			word = word.trim()
			if(word) {
				for(let key of Object.keys(this.docMap.forMap)) {
					if(key.indexOf(word) > -1) {
						docNums.unshift(this.docMap.getRight(key))
					}
				}
			}
		}
		
		docNums = _.unique(docNums)
		
		let docNames = []
		for(let id of docNums) {
			docNames.push(this.docMap.getLeft(id))
		}
		
		return docNames
	}
	
}

module.exports = Indexer