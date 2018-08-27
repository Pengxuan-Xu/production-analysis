var express = require('express');
var router = express.Router();
const sql = require('mssql')


const config = {
  user: 'mes_fis_admin',
  password: 'mes$fisadmin',
  server: 'AMK-ODS-SQL01', // You can use 'localhost\\instance' to connect to named instance
  database: 'FISREPORT',

  options: {
      encrypt: true // Use this if you're on Windows Azure
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {

  sql.connect(config).then(()=>{
    
    return sql.query ` WITH CTE AS
    (
       SELECT [AUTO_ID], ERROR_CODE,
              RN = ROW_NUMBER() OVER (PARTITION BY lens_id 
                                      ORDER BY [AUTO_ID] DESC)
       FROM FISREPORT..TEST_SUMMARY_MTBX
       where last_update > '2018-08-24'
    ),
    tst_data as
    (select
      tst.STACK_LOT_ID as [Integrated_lot_ID],
      count(*)  as [TD_Total_QTY],
      Cast (Count(CASE WHEN ( ERROR_CODE = 91) THEN 1 end) AS Float)/ Cast (count(*)AS Float) as [TD_Defect_Rate],
      tst.MACHINE_ID as [TD_TesterID]
    from [dbo].[TEST_SUMMARY_MTBX] tst
    where  tst.AUTO_ID in (SELECT [AUTO_ID] FROM CTE WHERE RN = 1 )
    group by tst.STACK_LOT_ID,tst.MACHINE_ID
    ) 
    select tst_data.*, ilot.*, substring(tst_data.Integrated_lot_ID,6,1) as [Config] 
    from firefish2_INTEGRATED_LOT ilot
    inner join Tst_Data 
    on tst_data.Integrated_lot_ID = ilot.LOT_ID`;
  }).then( (results)=>{
    res.send(results);
    sql.close();
  })
  
 
});

module.exports = router;
