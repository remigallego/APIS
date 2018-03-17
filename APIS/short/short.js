const mongodb    = require('mongodb');
var shortid = require('shortid');
const url = 'mongodb://localhost:27017/'

const MongoClient = mongodb.MongoClient;

exports.shorten = (req,res) => {

  if(!ValidURL(req.query.new))
  {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({error: "URL is not valid"}));
  }
  else
  {
    console.log(req.headers);
    let obj = {};
    let absoluteURL = req.protocol + '://' + req.get('host');
    let date = new Date();
    obj['url'] = req.query.new;
    obj['short'] = absoluteURL + '/demos/api/short?id=' + shortid.generate();
    obj['created'] = date.toUTCString();

    MongoClient.connect(url, (error, client) => {
      let db = client.db("test")
      if(error) throw error;

      const collec = db.collection('short_url');

      collec.insert(obj, (error, result) => {
        if(error) throw error
        client.close();

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({url: result.ops[0].url, short: result.ops[0].short}));

      });
    });
  }
}

exports.redirect_short =  (req,res) => {
  let id = req.query.id;

  MongoClient.connect(url, (error, client) => {
      let db = client.db("test")
      if(error) throw error;

      const collec = db.collection('short_url');
      let absoluteURL = req.protocol + '://' + req.get('host');

      console.log(absoluteURL+'/demos/api/short/'+id);

      let result = collec.find({'short': absoluteURL+'/demos/api/short?id='+id}).toArray((err,doc) => {
        if(error) throw error;
        console.log(doc)
        if(doc.length > 0)
            {
            res.redirect(doc[0]['url'])
            }
        else
          {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({error: 'This url is not on the database'}));
          }
        client.close();
      })
  })
}

exports.drop = (req,res) => {
  MongoClient.connect(url, (error, client) => {
      if(error) throw error;
      let db = client.db("test")

      const collec = db.collection('short_url');

      res.setHeader('Content-Type', 'application/json');
      if(db.collection('short_url').drop())
        res.send(JSON.stringify({result: 'Drop successful'}));
      else
        res.send(JSON.stringify({error: 'Drop failed'}));
      });
    }

exports.print = (req,res) => {
  MongoClient.connect(url, (error, client) => {
   if(error) throw error;
   let arr = [];
   let db = client.db("test")
   const collec = db.collection('short_url');

   let result = collec.find({}).sort({ created: -1 }).limit(+req.query.print).toArray((err,doc) => {
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
   })
})}


function ValidURL(str) {
  var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
  if(!regex .test(str)) {
    return false;
  } else {
    return true;
  }
}
