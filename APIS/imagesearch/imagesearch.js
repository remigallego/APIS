const mongodb    = require('mongodb');
var getJSON = require('get-json');

const url = 'mongodb://localhost:27017/';

const MongoClient = mongodb.MongoClient;

exports.search = (req,res) => {

  let apiKey = 'AIzaSyCIQb5cUyIcoETwi4-q5xw31Cx6aa8IzEk';
  let searchId = '013952521983790035067:-7kbdti9xhm';
  let query = req.query.search;
  let searchType = "image";
  let json_url = "https://www.googleapis.com/customsearch/v1?key=" + apiKey + "&cx=" + searchId + "&searchType=" + searchType + "&q=" + query;

  //GET https://www.googleapis.com/customsearch/v1?key=INSERT_YOUR_API_KEY&cx=017576662512468239146:omuauf_lfve&q=lectures
  getJSON(json_url, (err, response) => {
    if(err) console.log('Error: ' + err);

    let arr = [];
    let items = response.items;

    for(let i = 0 ; i < items.length ; i++)
    {
      let obj = {};
      obj['link'] = items[i].link
      obj['snippet'] = items[i].snippet;
      obj['context'] = items[i].image.contextLink;
      obj['thumbnail'] = items[i].image.thumbnailLink;
      arr.push(obj);
    }

    MongoClient.connect(url, (error, client) => {
      let db = client.db("test")
      if(error) throw error;
      let obj = {};
      let date = new Date();
      obj['query'] = query;
      obj['date'] = date.toUTCString();
      const collec = db.collection('imagesearch');

      collec.insert(obj, (error, result) => {
        if(error) throw error
        client.close();
      });

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(arr));
  });

  });
};

exports.latest = (req,res) => {
  MongoClient.connect(url, (error, client) => {
    let db = client.db("test")
    if(error) throw error;
    const collec = db.collection('imagesearch');
    collec.find({}).sort({ date: -1 }).limit(+req.query.latest).toArray((err, doc) => {
      if(error) throw error;
      if(doc.length > 0)
          {
          res.setHeader('Content-Type', 'application/json');
          res.send(doc)
          }
      else
        {
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({error: 'Print failed'}));
        }
      client.close();
    });
  });
}
