
const Indexer = require('./indexer')
const FileSink = require('file-sink')
const fs = require('fs')
const path = require('path')
const extensionFileFinder = require('./lib/extension-file-finder')
const commingle = require('commingle')
const triExtractor = require('./lib/tripartite-content-extractor')

/*
	options: {
		fileRoots: ['pages'],
		extensions: ['tri'],
		projectRoot: <string>,
		indexLocation: <string>,
		indexer: Indexer
	}
}
*/
class IndexerManager {
	constructor(options) {
		
		options = options || {}
		
		this.fileRoots = options.fileRoots || ['pages']
		this.extensions = options.extensions || ['tri']
		this.projectRoot = options.projectRoot
		this.indexer = options.indexer || new Indexer()
		this.indexLocation = options.indexLocation || 'page-index.json'
		
		this.projectSink = new FileSink(this.projectRoot)
	}
	
	
	indexFiles(callback) {
		let self = this
		let findFunctions = []
		let fullPartialMappings = {}
		
		let newIndexer = new Indexer()
		
		this.getSearchFilePaths().forEach(p => {
			
			this.extensions.forEach(e => {
				findFunctions.push((one, two, next) => {
					extensionFileFinder(p, e, function(err, found) {
						if(err) {
							console.error(err)
						}
						found.forEach(fon => {
							fullPartialMappings[fon] = fon.substring(p.length + 1)
							one.push(fon)
						})
						next()
					})
				})
			})
		})
		
		let results = []
		let extractor = () => {
			if (results.length > 0) {
				let cur = results.pop()
				let str
				let exor
				if(cur.endsWith('.tri')) {
					str = fs.createReadStream(cur)
					exor = triExtractor
				}
				
				if(str && exor) {
					exor(str, (err, content) => {
						newIndexer.indexDocument(fullPartialMappings[cur] , content)
						extractor()
					})
				}
				else {
					extractor()
				}
			}
			else {
				self.indexer = newIndexer
				if(callback) {
					callback(null, this)
				}
			}
		}

		commingle([findFunctions])(results, null, () => {
			extractor()
		})
	}
	
	addProjectRootIfNeeded(pathname) {
		let finalPath
		if(pathname.indexOf('/') == 0) {
			finalPath = pathname
		}
		else {
			finalPath = path.join(this.projectRoot, pathname)
		}
		return finalPath
	}
	
	getIndexFilePath() {
		return this.addProjectRootIfNeeded(this.indexLocation)
	}

	getSearchFilePaths() {
		let filePaths = []
		this.fileRoots.forEach((dir) => {
			filePaths.push(this.addProjectRootIfNeeded(dir))
		})
		return filePaths
	}
	
	load(callback) {
		this.indexer.loadFromFile(this.getIndexFilePath(), callback)
	}
	
	save(callback) {
		this.indexer.saveToFile(this.getIndexFilePath(), callback)
	}
	
}

module.exports = IndexerManager