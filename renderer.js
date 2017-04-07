// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.


const fs = require('fs');
const path = require('path');
const walk = require('walk')

const {dialog} = require('electron').remote;
console.log(dialog);

var dirSelection = dialog.showOpenDialog({properties: ['openDirectory']});




var inputDir = dirSelection ? dirSelection[0] : '/Users/chenxusani/Google Drive/Design/Inspiration';

var imageView = document.querySelector('.js-image-view');

function onImageClick(event) {
  console.log(event.target.src);
  var imageSrc = event.target.src;

  imageView.innerHTML = `<img src="${imageSrc}" />`;
  document.body.classList.add('is-showing-image');
}

imageView.addEventListener('click', function() {
  document.body.classList.remove('is-showing-image');
});


// var files = fs.readdirSync(inputDir)
//   .map(function(file) {
//       var filePath = `${inputDir}/${file}`;
//       var fileStat = fs.statSync(filePath);
//
//       if(fileStat.isDirectory()) return;
//       if(file === '.DS_Store') return;
//       if(file.indexOf('.gif') >= 0) return;
//
//
//       return {
//         name: file,
//         path: filePath,
//         time: fileStat.mtime.getTime()
//        };
//    })
//    .filter(x => x)
//    .sort(function(a, b) { return b.time - a.time; })
//
//
// var allFiles = [];

const flatten = arr => arr.reduce((acc, val) =>
      acc.concat(Array.isArray(val) ? flatten(val) : val), []);

Array.prototype.flatten = function() {return flatten(this)};

const walkSync = (dir) => {
  return fs.readdirSync(dir)
  .map((file) => {
    var filePath = path.join(dir, file);
    var fileStat = fs.statSync(filePath);

    if(file === '.DS_Store') return;
    if(file.indexOf('.gif') >= 0) return;

    if(fileStat.isDirectory()) {
      return walkSync(filePath);
    } else {
      return {
        name: file,
        path: filePath.replace(/\\/g, '/'),
        time: fileStat.mtime.getTime()
      };
    }
  })
  .flatten()
  .filter(x => x)
  .sort(function(a, b) { return b.time - a.time; });
}



files = walkSync(inputDir);



var images = files.map(file => {
 return `<li><img src="${file.path}"/></li>`
});

document.querySelector('.js-images').innerHTML = images.join('');

document.querySelectorAll('.image-list img').forEach(function(item) {
 item.addEventListener('click', onImageClick);
});
