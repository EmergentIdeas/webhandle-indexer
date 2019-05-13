
class BiDiMap {
	constructor(startMap) {
		this.forMap = {}
		this.backMap = {}
		
		if(startMap) {
			this.init(startMap)
		}
	}
	
	init(startMap) {
		for(let key of Object.keys(startMap)) {
			this.set(key, startMap[key])
		}
	}
	
	set(left, right) {
		this.forMap[left] = right
		this.backMap[right] = left
	}
	
	getRight(left) {
		return this.forMap[left]
	}
	
	getLeft(right) {
		return this.backMap[right]
	}
	
}

module.exports = BiDiMap