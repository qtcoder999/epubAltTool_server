let fs = require('fs');
const fse = require('fs-extra');
var mkdirp = require('mkdirp');
let folderPath = 'output/';
let projectName, numberOfFiles;
let jsonObj;
var path = require('path');

async function MkdirOutput() {
  await mkdirp('./output/', function (err) {
    if (err) console.error(err)
    else console.log('Output directory created!')
  });
}

async function CloneFiles() {
  try {
    await fse.copy('./input/', './output/')
    console.log('Files cloned -> ok!');
  } catch (err) {
    console.error(err)
  }
}

async function GetProjectName() {
  await fs.readdirSync(folderPath).forEach((file,index) => {
    projectName = file;
    if (index != 0) {
      jsonObj += `,`;
    }
    jsonObj +='{\"projectName\":\"';
    jsonObj += file;
    jsonObj += '\",\"paths\":[';
    console.log(projectName);
    var newPath = folderPath + projectName + '/trunk/s9ml/cards/' ;
    (async function() {
      await MakeJSON_HTMLFileNames(newPath, projectName);
    })()
    
  });
  
}

module.exports.start1 = async function (req , res){
  console.log("reached start");
  var clientProjectName = unescape(req.body.path);
  var newPath = folderPath + clientProjectName + '/trunk/s9ml/cards/';
  fs.readdirSync(newPath).forEach((file, index) => {
    var ext = path.extname(file);
    if(ext.trim() == '.html')
    {
      let xhtml_filename = file.substr(0, file.lastIndexOf(".")) + ".xhtml";
      console.log(newPath + xhtml_filename);
    
      fs.rename(newPath+file, newPath + xhtml_filename, function (err) {
        //console.log(newPath + xhtml_filename);
        if (err) throw err;
        //console.log('renamed complete');
      });
  
      //jsonObj += `{\"path\":\"${newPath}${xhtml_filename}\"}`;

    }
  });
  res.send('ok');
}

module.exports.end1 = async function (req,res){
  console.log("reached end");
  var clientProjectName = unescape(req.body.path);
  var newPath = folderPath + clientProjectName + '/trunk/s9ml/cards/';
  fs.readdirSync(newPath).forEach((file, index) => {
    var ext = path.extname(file);
    if(ext.trim() == '.xhtml')
    {
      let html_filename = file.substr(0, file.lastIndexOf(".")) + ".html";
      console.log(newPath + html_filename);
      //console.log(xhtml_filename);
    
      fs.rename(newPath+file, newPath + html_filename, function (err) {
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
    if(ext.trim() == '.html')
    {
      let xhtml_filename = file.substr(0, file.lastIndexOf(".")) + ".xhtml";
      console.log(xhtml_filename);
    
      fs.rename(newPath+file, newPath + xhtml_filename, function (err) {
        if (err) throw err;
        //console.log('renamed complete');
      });
  
      jsonObj += `{\"path\":\"${newPath}${xhtml_filename}\"}`;

    }
    else if(ext.trim() == '.xhtml'){
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
module.exports.init = async function (){
  await MkdirOutput();
  await CloneFiles();
  jsonObj ='[';
  await GetProjectName();
  jsonObj +=']';
  await WriteJSON();
}

module.exports.init();