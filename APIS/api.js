// -- FREECODECAMP'S APIs HTTP SERVER --
// https://github.com/remigallego/APIS
const DEFAULT_PORT = 3000;

let express      = require('express');
var shortid      = require('shortid');
const mongodb    = require('mongodb');
const morgan     = require('morgan');

let app = express();
let router = express.Router({});

let port = process.env.PORT || DEFAULT_PORT;
const url = 'mongodb://localhost:27017/'
const MongoClient = mongodb.MongoClient;

let timestamp                               = require('./timestamp-api/timestamp.js')
let whoami                                  = require('./whoami/whoami.js')
let {redirect_short, shorten, drop, print}  = require('./short/short.js');
let ImageSearch                             = require('./imagesearch/imagesearch.js')

app.use(morgan('dev'))

// Serve static files (like CSS files)
app.use(express.static('./public'));

// Main index
router.get('/api', (req,res) =>{
  res.sendFile(__dirname + '/index.html');
});

// Timestamp
router.get('/api/timestamp-api', (req,res) =>{res.sendFile(__dirname + '/timestamp-api/index.html');});
router.get('/api/timestamp-api/:string', (req,res) => timestamp(req,res))

// whoami
router.get('/api/whoami', (req,res) => whoami(req,res));

// URL shortener service
router.get('/api/short', (req,res) =>{
  if(req.query.new)
    shorten(req,res)
  else if(req.query.id)
    redirect_short(req,res)
  else if(req.query.drop)
    drop(req,res);
  else if(req.query.print)
    print(req,res);
  else
  res.sendFile(__dirname + '/short/index.html'); });

// Image search
router.get('/api/imagesearch', (req,res) =>{
  if(req.query.search)
    ImageSearch.test(req,res)
  else
    res.sendFile(__dirname + '/imagesearch/index.html');
  }
);
//router.get('/api/imagesearch/test', (req,res) =>{ ImageSearch.test(req,res) });

// 404
router.get('/api/*', (req,res) => {
  console.log(__dirname);
  res.status(404).sendFile(__dirname+'/404.html');
})

app.use('/', router);
app.listen(port);
console.log("Listening on " + port);
