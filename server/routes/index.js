var express = require('express');
var router = express.Router();
const sql = require('mssql')
const {sqlString} = require('../sql.js')

//MS sql server config
const config = {
  user: 'mes_fis_admin',
  password: 'mes$fisadmin',
  server: 'AMK-ODS-SQL01', 
  database: 'FISREPORT',
  connectionTimeout: 300000,
  requestTimeout: 300000,
  options: {
      encrypt: true 
  }
}

let flag = 0;
let dataresults;

router.post('/', function(req, res, next) {
  if(flag == 0){
  let queryString = sqlString(req.body);
  sql.connect(config).then((pool)=>{
    return pool.request().query(queryString)
  }).then((results)=>{
    dataresults=results
    res.send(dataresults);
    sql.close();
    flag=1;
  })
  } else{
    res.send(dataresults);
  }
});

module.exports = router;
