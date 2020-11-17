'use strict';

const Trie = require('./Trie.js');

const robot = require("robotjs");

const fs = require('fs');

const text = fs.readFileSync("./wordList.txt", "utf-8");

const ggwp = text.split("\n")

const imageReader = require("./imageReader.js")

let trie = new Trie();

robot.setMouseDelay(25)

ggwp.forEach(word => {
	if (word.length > 2) trie.insertWordInTrie(word)
})

// const array = [
// 	['S', 'U', 'A', 'B'],
// 	['A', 'R', 'G', 'R'],
// 	['D', 'G', 'F', 'Y'],
// 	['E', 'E', 'R', 'D']
// ]


let possibleWords = [];

const ARRAY_SIZE = 4;

const DIRECTION = {
	NORTH: [0, -1],
	SOUTH: [0, 1],
	EAST: [1, 0],
	WEST: [-1, 0],
	NORTHEAST: [-1, 1],
	NORTHWEST: [-1, -1],
	SOUTHWEST: [1, -1],
	SOUTHEAST: [1, 1]
}

const directions = Object.keys(DIRECTION);

const isPointNotVisited = (currentPoint, visitedPoints) => {
	const visitedPointsCount = visitedPoints.filter(point => point[0] == currentPoint[0] && point[1] == currentPoint[1]);
	return visitedPointsCount.length === 0;
}

const isPointValid = (point) => {
	const x = point[0];
	const y = point[1];
	if (x < 0 || y < 0 || x >= ARRAY_SIZE || y >= ARRAY_SIZE) return false;

	return true;
}

const getNewPoint = (prevPoint, delta) => {
	let newPoint = [];
	newPoint.push(prevPoint[0] + delta[0]);
	newPoint.push(prevPoint[1] + delta[1]);

	return newPoint;
}

function DFS(array, point = [0, 0], prevWord = "", visitedPoints = []) {
	let thisPoint = point.slice(0);
	const x = thisPoint[1];
	const y = thisPoint[0];
	const nextChar = array[x][y].value;
	let currentWord = prevWord + nextChar;

	// 	// console.log('visitedPoints', visitedPoints)
	// 	console.log('point', point)
	// console.log(currentWord)
	let newVisitedPoints = visitedPoints.slice(0)
	// console.log("newVisitedPoints", newVisitedPoints);
	newVisitedPoints.push(thisPoint)
	// console.log('newVisitedPoints', newVisitedPoints)


	// if (currentWord === "DRAG") {
	// 	// console.log("DIRECTION[direction]", DIRECTION[direction], "diretion", direction)
	// 	console.log("==========================")
	// 	console.log('newVisitedPoints', newVisitedPoints)
	// 	console.log('thisPoint', thisPoint)	
	// 	console.log('currentWord', currentWord)
	//  	console.log('visitedPoints', visitedPoints)

	// }
	// possibleWords.push(prevWord);
	// console.log('possibleWords', prevWord)
	currentWord = currentWord.toLowerCase();
	if (trie.search(currentWord)) {
		if (!possibleWords.includes(currentWord)) {
			possibleWords.push(currentWord);
			let robots_array = [];
		console.log("currentWord", currentWord)
			newVisitedPoints.forEach(point => {
				// console.log("point", point)
				robots_array.push(array[point[1]] [point[0]].coordinates)
			})
				console.log("==========================================================================================")
				// console.log("robots_array", robots_array)
			robotMovement(robots_array)
		// console.log('newVisitedPoints', newVisitedPoints)
			// console.log("FOUND ONE UNIQ")
		}
	}


	directions.forEach(direction => {

		let newPoint = getNewPoint(thisPoint, DIRECTION[direction]);
		// console.log("newPoint", newPoint)

		// console.log('point', point, '=>', nextChar, 'direction', direction, 'newPoint', newPoint)
		const isValid = isPointValid(newPoint)
		const isNotVisited = isPointNotVisited(newPoint, newVisitedPoints)
		// console.log('visitedPoints', visitedPoints, 'valid', valid, 'visited', visited)
		if (isValid && isNotVisited) {

			// console.log("prevWord", prevWord)
			// console.log("nextChar", nextChar)
			// console.log("currentWord", currentWord)
			// console.log('newPoint', newPoint)
			DFS(array, newPoint, currentWord, newVisitedPoints)
		};
	});
}


function recurse(array) {
	// console.log("array", array)
	for (let i = 0; i < ARRAY_SIZE; i++) {
		for (let j = 0; j < ARRAY_SIZE; j++) {
			DFS(array, [i, j]);
		}
	}
	return possibleWords;
}

function robotMovement(pixelCoordinates) {
	console.log("pixelCoordinates", pixelCoordinates)	
	// robot.moveMouse(pixelCoordinates[0], pixelCoordinates[1])
	robot.moveMouse(pixelCoordinates[0][0], pixelCoordinates[0][1])
	// console.log("THERERERERE")
	robot.mouseToggle("down");
	for(let i = 1; i < pixelCoordinates.length; i++) {
		robot.moveMouse(pixelCoordinates[i][0], pixelCoordinates[i][1]);
	}
	robot.mouseToggle("up");
}

// ['A', 'B', 'C', 'D'],
// ['H', 'G', 'F', 'E'],
// ['Y', 'O', 'E', 'N'],
// ['R', 'S', 'T', 'S']

// recurse(array)

// DFS(array, [0, 2], "DR", [[2, 0], [1, 1]])
// DFS(array, [2, 0], "", [])

// console.log(trie.search("womankind"))

// console.log(getNewPoint([0, -1], [0, 1]))

// console.log(p(ossibleWords)

// console.log(possibleWords.length)


//     }
// });
console.log("ssssssss", JSON.stringify(imageReader))
imageReader.init(recurse)