var express = require('express');
var router = express.Router();



router.post('/', function(req, res){
  console.log(req.body)
  var name=req.body.name;
  var age=req.body.age;
  let msg = {name,age}
  console.log(msg);
  res.send(msg);
})

module.exports = router;
