const Jimp = require('jimp');

var Tesseract = require('tesseract.js')

const screenshot = require('desktop-screenshot');

const orange_color = {
  r: 240,
  g: 150,
  b: 9
};
const blue_min = {
  r: 0,
  g: 48,
  b: 117
};
const blue_max = {
  r: 0,
  g: 82,
  b: 157
};

let edge_positions = {};

let orange_visited = false;

let blue_visited = false;

let y_coordinates = [];

let x_coordinates = [];

let final_array = [];

let box_width = 0;

let box_height = 0;

function takeScreenshot() {
  return new Promise((resolve, reject) => {
    screenshot("screenshot.png", function(error, complete) {
      if (error) {
        console.log("Screenshot failed", error);
        reject(error)
      } else {
        console.log("Screenshot succeeded");
        resolve()
      }
    });
  });
}



async function stichPictures(image, x = 0, y = 0) {
  const src = 'test' + [x, y] + '.png'
  return await Jimp.read(src).then(async overlay => {
    console.log("overlay in stichPictures", overlay)

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

  return await Jimp.read('screenshot.png').then(async function(image) {
      const width = image.bitmap.width;
      const height = image.bitmap.height;
      const data = image.bitmap.data;
      console.log('data', data);

      console.log(width);
      console.log('height', height);


      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          let hex = image.getPixelColor(x, y)
          let rgba = Jimp.intToRGBA(hex)

          getPixelCoordinates(rgba, x, y);
        }
      }

      return await getNodePoints(width, height, image)

    })
    .catch(err => {
      console.error(err);
    });
}

function getPixelCoordinates(rgba, x, y) {
  if (rgba.r === orange_color.r && rgba.g === orange_color.g && rgba.b === orange_color.b && !orange_visited) {
    edge_positions = {
      boxStart: [x, y]
    }
    // console.log(edge_positions)
    orange_visited = true
  }

  if (edge_positions["boxStart"] && (rgba.r <= blue_max.r && rgba.r >= blue_min.r) && (rgba.g <= blue_max.g && rgba.g >= blue_min.g) && (rgba.b <= blue_max.b && rgba.b >= blue_min.b) && !blue_visited && y >= edge_positions["boxStart"][1]) {
    edge_positions["boxEnd"] = [x, y - 1]
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


async function getNodePoints(width, height, image) {
  return new Promise((resolve, reject) => {
    console.log("aaaaaaaaa")
    for (let x = edge_positions["boxStart"][0]; x < width; x++) {
      let newY = edge_positions["boxStart"][1]
      let hex = image.getPixelColor(x, edge_positions["boxStart"][1])
      let rgba = Jimp.intToRGBA(hex)

      prevX = x - 1;
      let prevHex = image.getPixelColor(prevX, newY)
      let prevRgba = Jimp.intToRGBA(prevHex);

      if (isBlueColor(prevRgba) && isOrangeColor(rgba)) {
        x_coordinates.push(x);
      }
    }

    x_coordinates.push(x_coordinates[x_coordinates.length - 1] + 85);

    for (let y = edge_positions["boxStart"][1]; y < height; y++) {
      let newX = edge_positions["boxStart"][0]
      let hex = image.getPixelColor(newX, y)
      let rgba = Jimp.intToRGBA(hex)

      prevY = y - 1;

      let prevHex = image.getPixelColor(newX, prevY)
      let prevRgba = Jimp.intToRGBA(prevHex);

      if (rgba.r != 240 && rgba.r != 0) {
        nextY = y + 1;
        let nextHex = image.getPixelColor(newX, nextY)
        let nextRgba = Jimp.intToRGBA(nextHex);
        if (isBlueColor(prevRgba) && isOrangeColor(nextRgba)) {
          y_coordinates.push(y);
        }
      }


      if (isBlueColor(prevRgba) && isOrangeColor(rgba)) {
        y_coordinates.push(y);
      }
    }


    console.log("x_coordinates", x_coordinates)
    console.log("y_coordinates", y_coordinates)

    box_height = box_width = edge_positions["boxEnd"][1] - edge_positions["boxStart"][1];

    for (let x = 0; x < x_coordinates.length; x++) {
      for (let y = 0; y < y_coordinates.length; y++) {
        let dup_image = image.clone()
        let file = 'test' + [y, x] + '.' + image.getExtension();

        dup_image = dup_image.crop(x_coordinates[x], y_coordinates[y], box_width, box_height);

        for (let i = 0; i < 18; i++) {
          for (let j = 0; j < 18; j++) {
            dup_image.setPixelColor(0xf09609ff, j, i)
          }
        }

        dup_image.write(file);

        // await Tesseract.recognize('test' + [x, y] + '.png')
        //   .then(function(result) {
        //     let text = result.text.trim().toLowerCase()
        //   });
      }
    }

    let new_file = "newImage.png";
    console.log("START STICHING")
    new Promise((resolve, reject) => {
        new Jimp(box_width * 4, box_height * 4, async (err, image) => {
          // console.log("HERERERERERE")
          let stitchedImage = await stichPictures(image);
          console.log("stitchedImage", stitchedImage)
          await stitchedImage.write(new_file);
          console.log("done writing stitchedImage")
          resolve(new_file)
        })
      }).then(recognize)
      .then(grid => resolve(grid))
  })
};

async function recognize(filename) {
  console.log("===START recognizing the stitchedImage", filename)
  let array = [];
  await Tesseract
    .recognize(filename)
    .then(result => {
      let lines = result.lines
      console.log("lines", lines[0])

      console.log("==================")
      console.log("==================")
      console.log("==================")
      // console.log("result")
      // console.log(result)

      console.log("==================")
      console.log("==================")

      array = lines.map(line => line.text.replace(/\n/g, "").replace(/\|/g, "I").replace(/ /g, "").split(""));
      console.log("array", array)
    })
  Tesseract.terminate()
  console.log("hehawehalkhf array", array)
  let grid = []
  for (let i = 0; i < array.length; i++) {
    let row = []
    for (let j = 0; j < array.length; j++) {
      let box = {
        value: array[i][j],
        coordinates: [x_coordinates[j] + parseInt(box_height / 2), y_coordinates[i] + parseInt(box_height / 2)]
      }
      row.push(box)
    }
    grid.push(row)
  }
  console.log("*******", JSON.stringify(grid))
  return grid;
}

function init(recurse) {
  takeScreenshot()
    .then(getArrayRequired)
    .then(grid => {
      console.log("result", grid)
      return recurse(grid)
      // console.log("arguments", arguments)
    })
    .then(console.log)
}

// getArrayRequired()

// getArrayRequired().then(answer => {console.log("answer",answer)	;grid = answer; console.log("grid", grid)});

// getArrayRequired().then(result => {
//   console.log("result", result)
//   // console.log("arguments", arguments)
// })

module.exports = {
  init
}