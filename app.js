let fs = require('fs');
const fse = require('fs-extra');
var mkdirp = require('mkdirp');
var formidable = require('formidable');
let folderPath = 'input/';
let projectName;
let jsonObj;
var path = require('path');
var gm = require('gm').subClass({ imageMagick: true });
async function MkdirInput() {
  await mkdirp('./input/', function (err) {
    if (err) console.error(err)
    else console.log('input directory created!')
  });
}
// async function CloneFiles() {
//   try {
//     await fse.copy('./input/', './input/')
//     console.log('Files cloned -> ok!');
//   } catch (err) {
//     console.error(err)
//   }
// }
async function GetProjectName() {
  await fs.readdirSync(folderPath).forEach((file, index) => {
    projectName = file;
    if (index != 0) {
      jsonObj += `,`;
    }
    jsonObj += '{\"projectName\":\"';
    jsonObj += file;
    jsonObj += '\",\"paths\":[';
    console.log(projectName);
    var newPath = folderPath + projectName + '/trunk/s9ml/cards/';
    (async function () {
      await MakeJSON_HTMLFileNames(newPath, projectName);
    })()
  });
}
module.exports.start1 = async function (req, res) {
  console.log("reached start");
  var clientProjectName = unescape(req.body.path);
  var newPath = folderPath + clientProjectName + '/trunk/s9ml/cards/';
  fs.readdirSync(newPath).forEach((file, index) => {
    var ext = path.extname(file);
    if (ext.trim() == '.html') {
      let xhtml_filename = file.substr(0, file.lastIndexOf(".")) + ".xhtml";
      console.log(newPath + xhtml_filename);
      fs.rename(newPath + file, newPath + xhtml_filename, function (err) {
        //console.log(newPath + xhtml_filename);
        if (err) throw err;
        //console.log('renamed complete');
      });
      //jsonObj += `{\"path\":\"${newPath}${xhtml_filename}\"}`;
    }
  });
  res.send('ok');
}
module.exports.end1 = async function (req, res) {
  console.log("reached end");
  var clientProjectName = unescape(req.body.path);
  var newPath = folderPath + clientProjectName + '/trunk/s9ml/cards/';
  fs.readdirSync(newPath).forEach((file, index) => {
    var ext = path.extname(file);
    if (ext.trim() == '.xhtml') {
      let html_filename = file.substr(0, file.lastIndexOf(".")) + ".html";
      console.log(newPath + html_filename);
      //console.log(xhtml_filename);
      fs.rename(newPath + file, newPath + html_filename, function (err) {
        //console.log(newPath + html_filename);
        if (err) throw err;
        //console.log('renamed complete');
      });
      //jsonObj += `{\"path\":\"${newPath}${xhtml_filename}\"}`;
    }
  });
  res.send('ok');
}
async function MakeJSON_HTMLFileNames(newPath, projectName) {
  fs.readdirSync(newPath).forEach((file, index) => {
    if (!(index == 0)) {
      jsonObj += `,`;
    }
    var ext = path.extname(file);
    //console.log(ext);
    if (ext.trim() == '.html') {
      let xhtml_filename = file.substr(0, file.lastIndexOf(".")) + ".xhtml";
      console.log(xhtml_filename);
      fs.rename(newPath + file, newPath + xhtml_filename, function (err) {
        if (err) throw err;
        //console.log('renamed complete');
      });
      jsonObj += `{\"path\":\"${newPath}${xhtml_filename}\"}`;
    }
    else if (ext.trim() == '.xhtml') {
      jsonObj += `{\"path\":\"${newPath}${file}\"}`;
    }
  });
  jsonObj += "]}";
}
async function WriteJSON() {
  await mkdirp('../front/json/', function (err) {
    if (err) console.error(err)
    else console.log('JSON directory created!')
  });
  await fs.writeFile('../front/json/data.json', jsonObj.toString(), (err) => {
    if (err) throw err;
    console.log('JSON saved!');
  });
}
module.exports.init = async function () {
  await MkdirInput();
  //await CloneFiles();
  jsonObj = '[';
  await GetProjectName();
  jsonObj += ']';
  await WriteJSON();
}
module.exports.getData = async function (req, res) {
  res.send('ok');
  var DOM1 = unescape(req.body.DOM);
  //console.log(unescape(req.body.path));
  var pathToWrite = req.body.path.split("/");
  //console.log(pathToWrite);
  pathToWrite = pathToWrite.splice(2);
  pathToWrite = pathToWrite.join('/');

  pathToWrite = "./" + decodeURIComponent(pathToWrite);
  //console.log(pathToWrite);
  await module.exports.writeHTMLFile(pathToWrite, DOM1);
}
module.exports.writeHTMLFile = async function (pathToWrite, DOM1) {
  fs.writeFile(pathToWrite.trim(), DOM1, function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("Contents written to : " + pathToWrite);
  });
}
module.exports.crop = async function (req, res) {
  console.log(req.body);
  gm("." + decodeURIComponent(req.body.srcPath))
    .crop(req.body.width, req.body.height, req.body.x, req.body.y)
    .write("." + decodeURIComponent(req.body.srcPath), function (err) {
      if (!err) {
        console.log('Cropping done!');
        res.send('ok');
      }
      else {
        console.log(err);
      }
    });
}

module.exports.uploadProject = async function (req, res) {
  
  var form = new formidable.IncomingForm();

  form.parse(req);

  form.on('fileBegin', function (name, file){
      file.path = __dirname + '/uploads/' + file.name;
  });

  form.on('file', function (name, file){
      res.send("OK");
  });
}

module.exports.init();