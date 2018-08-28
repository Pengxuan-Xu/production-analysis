const sqlString = (data)=>{
    // this.state = {
    //     loading: true,
    //     product: 'MTBX',
    //     bin:1,
    //     rangeOption:"Lots",
    //     from:0,
    //     to:0,
    //     lots:'',
    // }
    let row=data.product==='MTBX'?4:6; //special parameter for the query
    let range;
    if(data.rangeOption === "Date"){
        range =`select dataconout.WIPID
        from [dbo].[WTTXN_OUT] dataconout
        where dataconout.OUTSTEPNAME = 'Functional Testing'
        and dataconout.SYSTEMDATETIME between '${data.from}' and '${data.to}'
        and dataconout.PRODUCTCATEGORY = 'MTBX'
        `
    } else {
        range = "'"+data.lots.split("\n").join("','")+"'"
    }
    

    return `SELECT a.FLEX_2D,a.PANEL_ROW,a.PANEL_COL,a.LENS_2D,isnull(a.TEST_RESULT,0) as Test_Results,
        testresult.ERROR_CODE,isnull(a.FINAL_AOI,0) as AOI_results,a.NEW_INTEGRATED_LOT,
        b.panel_lot_id,a.LAST_UPDATE,
        c.waferID,(c.FX+1) as [col],(32-c.fy) as [row],c.panelID,  
        d.InfoValue as [IR1 Batch #],dd.InfoValue as [IR2 Batch #], ddd.infovalue as [Diffuser 1 Batch],
        h.obj_id as [pcba lot],g.PCBA_ID,e.LENS_ROW,e.LENS_COL
    FROM [FISREPORT].[dbo].[SMS_PANEL_DETAIL_${data.product}] a

    inner JOIN [FISREPORT].[dbo].[OUTPUT_FILE_LOG] b
    ON a.KEY_ID = b.key_id

    inner JOIN [FISREPORT].[dbo].[HPTG_Transfers] c
    ON a.PANEL_ROW = (${row} - c.TY) and a.PANEL_COL = (c.TX + 1) and b.obj_id = c.panelID

    inner JOIN (
        SELECT * FROM [FISREPORT].[dbo].[WTTXN_IN] aa
        inner JOIN [FISREPORT].[dbo].[WTTXN_IN_END] bb
        ON aa.UNIQUEID = bb.fromId
        WHERE InfoName = 'IR1 Batch #'
    ) d 
    ON d.WIPID = c.waferID

    inner JOIN (
        SELECT * FROM [FISREPORT].[dbo].[WTTXN_IN] aa
        inner JOIN [FISREPORT].[dbo].[WTTXN_IN_END] bb
        ON aa.UNIQUEID = bb.fromId
        where INSTEPNAME = 'IR2 Stack-IR2 Stacking'
            and InfoName = 'IR2 Batch #'
    ) dd
    ON dd.WIPID = c.waferID

    inner JOIN (
        SELECT * FROM [FISREPORT].[dbo].[WTTXN_IN] aa
        inner JOIN [FISREPORT].[dbo].[WTTXN_IN_END] bb
        ON aa.UNIQUEID = bb.fromId
            where INSTEPNAME = 'D1 Stack-PSA Measure_MTBX'
            and InfoName = 'Diffuser 1 Batch #'
    ) ddd
    ON ddd.WIPID = c.waferID

    inner join [dbo].[SMS_LENS_DETAIL_MTBX] e
    on a.LENS_2D = e.LENS_2D
    inner JOIN [FISREPORT].[dbo].[OUTPUT_FILE_LOG] h
    ON e.KEY_ID = h.key_id

    inner join SMS_PROD_PCBA g
    on g.LOT_ID=h.obj_id

    inner join [dbo].[TEST_SUMMARY_MTBX] testresult
    on a.flex_2d = testresult.lens_id

    where a.NEW_INTEGRATED_LOT in (
        ${range}
    )`

}

exports.sqlString = sqlString;