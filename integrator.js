const IndexerManager = require('./indexer-manager')
const Path = require('path')

let integrator = {
	indexer: null,
	manager: null,
	getDefaultOptions: function(options) {
		options = options || {}
		
		return {
			fileRoots: ['pages'],
			projectRoot: options.projectRoot || Path.resolve('.'),
			indexLocation: 'pages-index.json'
		}
	},
	init: function(options, callback) {
		if(!options) {
			options = this.getDefaultOptions()
		}
		this.manager = new IndexerManager(options)
		this.indexer = this.manager.indexer
		this.manager.load(() => {
			this.manager.indexFiles(() => {
				this.manager.save(() => {
					if(callback) {
						callback(null, integrator)
					}
				})
			})
		})
	}
}


module.exports = integrator