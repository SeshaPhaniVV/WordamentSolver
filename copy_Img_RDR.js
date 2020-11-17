const Jimp = require('jimp');

var Tesseract = require('tesseract.js')

const screenshot = require('desktop-screenshot');

const orange_color = {r: 240, g: 150, b: 9};
const blue_min = {r: 0, g: 48, b: 117};
const blue_max = {r: 0, g: 82, b: 157};

// const shade_color = {r: 0, g: 82, b: 157};

let edge_positions = {};

let orange_visited = false;

let blue_visited = false;

let y_coordinates = [];

let x_coordinates = [];

let final_array = [];

let box_width = 0;

let box_height = 0;

screenshot("screenshot.png", function(error, complete) {
  if(error) {
      console.log("Screenshot failed", error);
    return
  } else {
      console.log("Screenshot succeeded");
	}
});

async function stichPictures(image, x = 0, y = 0) {
	// console.log("image", image)
	const src = 'test' + [x,y] + '.png'
	// console.log("src", src)
	return await Jimp.read(src).then(async overlay => { 
		// console.log("overlay", overlay);
		// console.log("x, y", x, y)
		await image.blit(overlay, box_width * y, box_height * x) 
		if (y < 3) y += 1 
		else {
			y = 0;

			if (x < 3) x += 1;
			else return image;
		}

		return await stichPictures(image, x, y)
	});
}

async function getArrayRequired() {

	await Jimp.read('wordament-screenshot.png').then(async function (image) {
  	const width = image.bitmap.width;
  	const height = image.bitmap.height; 
  	const data = image.bitmap.data;
  	console.log('data', data);

  	console.log(width);
  	console.log('height', height);


  	for(let x = 0; x < width; x++) {
  		for(let y = 0; y < height; y++) {
  			let hex = image.getPixelColor(x, y)
  			let rgba = Jimp.intToRGBA(hex)
  			// console.log(rgba)
  			// console.log(y)
  			getPixelCoordinates(rgba, x, y);
  		}
  	}

  	await getNodePoints(width, height, image)
    // return pic
    //   .resize(256, 256) // resize
    //   .quality(60) // set JPEG quality
    //   .greyscale() // set greyscale
    //   .write('lena-small-bw.jpg'); // save
  })
	.catch(err => {
	  console.error(err);
	});
}

function getPixelCoordinates(rgba, x, y) {
	if(rgba.r === orange_color.r && rgba.g === orange_color.g && rgba.b === orange_color.b && !orange_visited) {
		edge_positions = { boxStart: [x, y] }
		// console.log(edge_positions)
		orange_visited = true
	}

	if(edge_positions["boxStart"] && (rgba.r <= blue_max.r && rgba.r >= blue_min.r) && (rgba.g <= blue_max.g && rgba.g >= blue_min.g) && (rgba.b <= blue_max.b && rgba.b >= blue_min.b) && !blue_visited && y >= edge_positions["boxStart"][1]) {
		edge_positions["boxEnd"] = [x, y-1]
		console.log(edge_positions)
		blue_visited = true
 	}
 };

 const isOrangeColor = (rgba) => {
		return rgba.r === orange_color.r && rgba.g === orange_color.g && rgba.b === orange_color.b
	}

	const isBlueColor = (rgba) => {
		return ((rgba.r <= blue_max.r && rgba.r >= blue_min.r) && (rgba.g <= blue_max.g && rgba.g >= blue_min.g) && (rgba.b <= blue_max.b && rgba.b >= blue_min.b))
	}

	// function getWidthAndHeight(edge_positions) {
	// 		else if (isOrangeColor(prevRgba) && isBlueColor(rgba)) {
	// 			x_coordinates.push(prevX);
	// 		// console.log("x_coordinates", x_coordinates)
	// }

	// }


async function getNodePoints(width, height, image) {
	// console.log("aaaaaaaaa")
	for(let x = edge_positions["boxStart"][0]; x < width; x++) {
		let newY = edge_positions["boxStart"][1]
		let hex = image.getPixelColor(x, edge_positions["boxStart"][1])
		let rgba = Jimp.intToRGBA(hex)
		// console.log(rgba)
		// console.log("x", x)
		// console.log("newY", newY)
  prevX = x - 1;
		let prevHex = image.getPixelColor(prevX, newY)
		let prevRgba = Jimp.intToRGBA(prevHex);

		// if (rgba.r != 240 || rgba.r != 0) {
		//  prevX = x - 2;
		//  continue; 
		// }

	if(isBlueColor(prevRgba) && isOrangeColor(rgba)) {
		x_coordinates.push(x);
		// console.log("x_coordinates",x_coordinates)
	}
	// else if (isOrangeColor(prevRgba) && isBlueColor(rgba)) {
	// 	x_coordinates.push(prevX);
	// 	// console.log("x_coordinates", x_coordinates)
	// }
	}




		for(let y = edge_positions["boxStart"][1]; y < height; y++) {
			let newX = edge_positions["boxStart"][0]
			let hex = image.getPixelColor(newX, y)
			let rgba = Jimp.intToRGBA(hex)

  		prevY = y - 1;

		// if (rgba.r != 240 || rgba.r != 0) {
		//  nextY = y + 1;
		//  continue; 
		// }

		let prevHex = image.getPixelColor(newX, prevY)
		let prevRgba = Jimp.intToRGBA(prevHex);

		if (rgba.r != 240 && rgba.r != 0) {
		  nextY = y + 1;
			let nextHex = image.getPixelColor(newX, nextY)
			let nextRgba = Jimp.intToRGBA(nextHex);
			if(isBlueColor(prevRgba) && isOrangeColor(nextRgba)) {
				y_coordinates.push(y);
				// console.log("y_coordinates", y_coordinates)
			}
			// else if (isOrangeColor(prevRgba) && isBlueColor(nextRgba)) {
			// 	y_coordinates.push(prevY);
			// 	// console.log("y_coordinates", y_coordinates)
			// }
		}

		// console.log(rgba)
		// console.log("y", y)
		// console.log("newX", newX)


	if(isBlueColor(prevRgba) && isOrangeColor(rgba)) {
		y_coordinates.push(y);
		// console.log("y_coordinates", y_coordinates)
	}
	// else if (isOrangeColor(prevRgba) && isBlueColor(rgba)) {
	// 	y_coordinates.push(prevY);
	// 	// console.log("y_coordinates", y_coordinates)
	// }
}

		// console.log("x_coordinates",x_coordinates)
		// console.log("y_coordinates", y_coordinates)

			box_height = box_width = edge_positions["boxEnd"][1] - edge_positions["boxStart"][1];



		// getBoxCoordinates(x_coordinates, y_coordinates)

		// let new_image = new Jimp(width, height, (err, image) => {
			// console.log("image", image)

			for(let x = 0; x < x_coordinates.length; x++) {
				for(let y = 0; y < y_coordinates.length; y++) {
					// console.log("[x,y]", [x_coordinates[x], y_coordinates[y]])
					let dup_image = image.clone()
					// console.log("2222222222", dup_image)
					let file = 'test' + [y, x] + '.' + image.getExtension();
					// console.log("33333333", file)

					// let new_image = dup_image.crop( 959, 141, box_width, box_height );
					dup_image = dup_image.crop( x_coordinates[x], y_coordinates[y], box_width, box_height );

					// console.log("color", Jimp.intToRGBA(0xf09609ff))

					for(let i = 0; i < 18; i++) {
							for(let j = 0; j < 18; j++) {
		            dup_image.setPixelColor(0xf09609ff, j, i)
						}
					}

					
					// console.log("7777777", dup_image)

					dup_image.write(file);

					// if (x === 0 && y === 3) console.log("HHAJHDKHAKFHPFISYFPAI==========================================")
					await Tesseract.recognize('test' + [x,y] + '.png')
						.then(function(result){
							// console.log("result.text", result.text)
							let text = result.text.trim().toLowerCase()
							// console.log("text", text)
							// if (text === "|") text = "i"
							// final_array.push(text)
							// console.log(final_array)
					});
				}
			}

			let new_file = "newImage.png";
			// console.log("START STICHING")
      let newImage = await new Jimp(box_width * 4, box_height * 4, async (err, image) => {
      	// console.log("HERERERERERE")
    		let stitchedImage = await stichPictures(image);
    		// console.log("stitchedImage", stitchedImage)
    		await stitchedImage.write(new_file);
    	})
      console.log("newImage", newImage)
      let array = [];
      Tesseract.recognize(new_file)
						.then(function(result){
							let lines = result.lines

							array = lines.map(line => line.text.replace(/\n/g, "").replace(/\|/g, "I").split(" "));
							console.log("array", array)
							// let row = [];	
							// for(let i = 0; i < text.length; i++) {
							// 	// console.log("text", text[i] === '|')
							// 	let char = text[i]
							// 	if(text[i] === '|') char = 'i'

							// 	if(text[i] === ' ')
							// 		continue

							// 	if(text[i] === '\n' && text[text.length - 1] === '\n'){

							// 		array.push(row)
							// 		row = []
							// 	}
							// 	row.push(char)
	    					
	      				
	      // 				final_array.push(text[i].toLowerCase())
    			// 		}
    					// let array = [];

    					// for(let i = 0; i < 3; i++) {
    					// 	for (let j = 0; j < 3; j ++) {
    					// 		array.push([final_array[i+j]])
    					// 	}
    					// }
    					// console.log("array", array)
      			// 	console.log('final_array', final_array)
						// final_array.push(result.text.trim().toLowerCase())
						// console.log(final_array)
					});
			// const that = this;
			// for(let x = 0; x < x_coordinates.length; x++) {
			// 	for(let y = 0; y < y_coordinates.length; y++) {
			// 		Jimp.read('test' + [x,y] + '.png').then(image => { 
			// 			console.log('test' + [x,y] + '.png')
			// 			console.log("image", image);
			// 			newImage.blit(image, box_width * y, box_height * x) })
			// 	}
			// }
			
			// newImage

  		// this image is 256 x 256, every pixel is set to 0x00000000
			// let dup_image = image.clone()
			// console.log("2222222222", dup_image)
			// let file = 'test' + '.' + image.getExtension();
			// console.log("33333333", file)

			// // let new_image = dup_image.crop( 959, 141, box_width, box_height );
			// dup_image = dup_image.crop( 959, 394, box_width, box_height );

			// console.log("color", Jimp.intToRGBA(0xf09609ff))

			// for(let i = 0; i < 18; i++) {
			// 		for(let j = 0; j < 18; j++) {
   //          dup_image.setPixelColor(0xf09609ff, j, i)
			// 	}
			// }

			
			// console.log("7777777", dup_image)

			// dup_image.write(file);

		// };

// 		// let dup_image = image.clone()

// 		// let new_image = dup_image.crop( 959, 141, box_width, box_height );

// 		// console.log(new_image)

// Tesseract.recognize('test.png')
// 	.then(function(result){
// 	final_array.push(result.text.trim().toLowerCase())
//   console.log(result)
// })
		// getEachBox(x_coordinates, y_coordinates)

 };

 // function getBoxCoordinates(xcoords, ycoords) {
	// const width
 // 	let boxcoords = []
 // }

getArrayRequired();

console.log(final_array)




