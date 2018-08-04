let fs = require('fs');
const fse = require('fs-extra');
var mkdirp = require('mkdirp');
let folderPath = 'output/';
let projectName, numberOfFiles;
let jsonObj;

async function CloneFiles() {
  try {
    await fse.copy('./input/', './output/')
    console.log('Files cloned to output -> ok!');
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
async function MakeJSON_HTMLFileNames(newPath, projectName) {
  fs.readdirSync(newPath).forEach((file, index) => {
    if (!(index == 0)) {
      jsonObj += `,`;
    }
    jsonObj += `{\"path\":\"${newPath}${file}\"}`;

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

async function init() {
  await CloneFiles();
  jsonObj ='[';
  await GetProjectName();
  jsonObj +=']';
  await WriteJSON();
}

init();