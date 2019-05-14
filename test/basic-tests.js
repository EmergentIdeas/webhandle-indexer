require('mocha')
var expect = require('chai').expect
var assert = require('chai').assert
const Path = require('path')
const extensionFileFinder = require('../lib/extension-file-finder')

describe("basic tests for functionality", function() {
	it("simplest whole test", function(done) {
		let IndexerManager = require('../indexer-manager')
	
		let parentPath = Path.resolve('.')
		let indMgr = new IndexerManager({
			fileRoots: ['test-data'],
			projectRoot: parentPath,
			indexLocation: 'test-data/index-test.json'
		})
	
		indMgr.indexFiles(() => {
			let found = indMgr.indexer.search('hello')
			if(found[0] != 'folder-1/file-1.tri') {
				return done(new Error("couldn't find 'hello'"))
			}
			
			found = indMgr.indexer.search('world')
			if(found[0] != 'folder-1/file-2.tri') {
				return done(new Error("couldn't find 'world'"))
			}
			
			done()
		})
	})

	it("finder test", function(done) {
		let parentPath = Path.resolve('.')
		// console.log('parent path: ' + parentPath)
		extensionFileFinder(Path.join(parentPath, 'test-data'), 'tri', (err, found) => {
			// console.log(JSON.stringify(found))
			done()
		})
	})


	
})