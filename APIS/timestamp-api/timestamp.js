
module.exports = (req,res) => {
  let date = new Date(isNaN(req.params.string) ? req.params.string : Number(req.params.string)*1000);
  let obj = {};

  let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  let dd = date.getDate();
  let mm = months[date.getMonth()];
  let yyyy = date.getFullYear();

  obj['unix'] = (date.getTime()/1000);
  obj['natural'] = mm+' '+dd+', '+yyyy;
  
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(obj));
}
