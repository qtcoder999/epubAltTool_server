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

router.post('/iframeData', function (req, res) { req.setTimeout(0); projectStart.getData(req, res); });
router.post('/start', function (req, res) { req.setTimeout(0); projectStart.start1(req, res); });
router.post('/end', function (req, res) { req.setTimeout(0); projectStart.end1(req, res); });
router.post('/init', function (req, res) { req.setTimeout(0); projectStart.init(); res.send('ok'); });
router.post('/crop', function (req, res) { req.setTimeout(0); projectStart.crop(req, res); res.send('ok'); });

//app.get('/', (req, res) => res.send('Hello World!'))

app.use('/', router);

var port = 3000;
app.listen(port);
app.timeout = -1;

console.log('Server listening @ localhost:' + port);