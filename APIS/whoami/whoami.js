
module.exports = (req,res) => {
  let obj = {};
  console.log(req.headers);
  obj['browser'] = req.headers['user-agent'];
  obj['language'] = ((req.headers['accept-language']).split(','))[0];
  obj['ip'] = req.headers['x-real-ip']; 
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(obj));
}
