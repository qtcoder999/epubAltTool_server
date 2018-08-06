var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors')
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var router = express.Router();

var fs = require('fs');

var projectStart = require('./app.js');

router.post('/iframeData', function (req, res) { req.setTimeout(0); getData(req, res); });
router.post('/start', function (req, res) { req.setTimeout(0); projectStart.start1(req, res); });
router.post('/end', function (req, res) { req.setTimeout(0); projectStart.end1(req, res); });

//app.get('/', (req, res) => res.send('Hello World!'))

app.use('/', router);

var port = 3000;
app.listen(port);
app.timeout = -1;

console.log('Server listening @ localhost:' + port);


getData = async function (req, res) {
    res.send('ok');
    var DOM1 = unescape(req.body.DOM);
    //console.log(unescape(req.body.path));
    var pathToWrite = req.body.path.split("/") ;
    //console.log(pathToWrite);
    pathToWrite = pathToWrite.splice(2);
    pathToWrite = pathToWrite.join('/');

    pathToWrite = "./" + decodeURIComponent(pathToWrite);
    //console.log(pathToWrite);
    await writeHTMLFile(pathToWrite,DOM1);
}
writeHTMLFile = async function(pathToWrite, DOM1){
    fs.writeFile(pathToWrite.trim(), DOM1, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("Contents written to : " + pathToWrite);
    });
}