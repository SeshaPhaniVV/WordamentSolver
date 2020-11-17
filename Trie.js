// 

// const array = ["abc", "ade", "pieeeee", "raasdfasedf", "ggwp", "ggpl", "raasdfasedl"]

// const fs  = require('fs');

// const text = fs.readFileSync("./wordList.txt", "utf-8");

// console.log('text', text);

// const array = text.split("\n")

// console.log('array', array);

// class Trie {
//   constructor() {
//     this.name = name;
//   }
// }
// var e = new myObject("hello");

// function InsertWordInTrie(word) {
// 	level = Trie.root.children
// 	for(var i = 0; i < word.length; i++){
// 		char = word.charAt(i)
// 		// console.log('char', char)
// 		// console.log('Trie', Trie)
// 		// console.log('Level', level)
// 		isLastWord = i == (word.length - 1)
// 		// console.log('isLastWord', isLastWord)
// 		let variable = !Object.keys(level).includes(char)
// 		// console.log('variable', variable)
// 		if(variable) {
// 			addKeysToChildren(char, isLastWord, level)
// 			level = level[char].children
// 		}
// 		else {
// 			level = level[char].children;
// 		}
// 	}
// }


// function addKeysToChildren(char, isLastWord, level) {
// 		// console.log('Level11111', level)
// 		// console.log('char111111', char)

// 	level[char] = {EOW: isLastWord, children: {}}
// 		// console.log('Level2222', level)

// }

// function search(word) {
// 	level = Trie.root.children
// 	for(var i = 0; i < word.length; i++){
// 		// console.log('level', level)

// 		char = word.charAt(i)
// 		if (!Object.keys(level).includes(char)) {
// 			return false;
// 		}
// 		else if((i == word.length - 1) && level[char].EOW){
// 			// console.log('555555', level)
// 			return true
// 		}
// 		// console.log('level', level)
// 		// console.log('level', level[char])
// 		// console.log('char', char)

// 		level = level[char].children
// 	}
// 	return false
// }


// array.forEach(InsertWordInTrie);

	// console.log(search("viability"));


	// console.log(JSON.stringify(Trie));
class Trie {
	constructor() {
		this.root = {
			EOW: false,
			children: {}
		}
		// this.trie = {root: {EOW: false, children: {}}}

		this.insertWordInTrie = this.insertWordInTrie.bind(this);
		this.addKeysToChildren = this.addKeysToChildren.bind(this);
		this.search = this.search.bind(this);
	}

	insertWordInTrie(word) {
		let level = this.root.children
		for(var i = 0; i < word.length; i++){
			let char = word.charAt(i)
			// console.log('char', char)
			// console.log('Trie', Trie)
			// console.log('Level', level)
			let isLastWord = i == (word.length - 1)
			// console.log('isLastWord', isLastWord)
			let variable = !Object.keys(level).includes(char)
			// console.log('variable', variable)
			if(variable) {
				this.addKeysToChildren(char, isLastWord, level)
				level = level[char].children
			}
			else {
				level = level[char].children;
			}
		}
	}

	addKeysToChildren(char, isLastWord, level) {
		// console.log('Level11111', level)
		// console.log('char111111', char)

		level[char] = {EOW: isLastWord, children: {}}
			// console.log('Level2222', level)

	}

	search(word) {
		let level = this.root.children
		for(var i = 0; i < word.length; i++) {
			// console.log('level', level)

			let char = word.charAt(i)
			if (!Object.keys(level).includes(char)) {
				return false;
			}
			else if((i == word.length - 1) && level[char].EOW){
				// console.log('555555', level)
				return true
			}
			// console.log('level', level)
			// console.log('level', level[char])
			// console.log('char', char)

			level = level[char].children
		}
		return false
	}
}

module.exports = Trie;