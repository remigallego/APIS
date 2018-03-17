// -- FREECODECAMP'S APIs HTTP SERVER --
// https://github.com/remigallego/APIS
const DEFAULT_PORT = 3000;

let express      = require('express');
const morgan     = require('morgan');

let app = express();
let router = express.Router({});

let port = process.env.PORT || DEFAULT_PORT;

let timestamp                               = require('./APIS/timestamp-api/timestamp.js')
let whoami                                  = require('./APIS/whoami/whoami.js')
let {redirect_short, shorten, drop, print}  = require('./APIS/short/short.js');
let ImageSearch                             = require('./APIS/imagesearch/imagesearch.js')

app.use(morgan('dev'))

// Serve static files (like CSS files)
console.log(__dirname + '/APIS/public/');
router.use(express.static(__dirname + '/APIS/public/'));

router.get('/', (req,res) => {
  res.sendFile(__dirname + '/index.html');
})

// Main index
router.get('/api', (req,res) =>{
  res.sendFile(__dirname + '/APIS/index.html');
});

// Timestamp
router.get('/api/timestamp-api', (req,res) =>{res.sendFile(__dirname + '/APIS/timestamp-api/index.html');});
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
  res.sendFile(__dirname + '/APIs/short/index.html'); });

// Image search
router.get('/api/imagesearch', (req,res) =>{
  if(req.query.search)
    ImageSearch.search(req,res)
  else if(req.query.latest)
    ImageSearch.latest(req,res)
  else
    res.sendFile(__dirname + '/APIS/imagesearch/index.html');
  }
);

// 404
router.get('/api/*', (req,res) => {
  res.status(404).sendFile(__dirname + '/APIS/404.html');
});

app.use('/', router);
app.listen(port);
console.log("Listening on " + port);
