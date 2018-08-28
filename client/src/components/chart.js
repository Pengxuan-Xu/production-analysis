var dc =require('dc');
var crossfilter = require('crossfilter2');
var d3 = require('d3')

export const plotChart = (setting)=>{
    return fetch('http://localhost:3001/', {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(setting),
    })
    .then(response => {
        console.log(response.status);
        return response.json()})
    .then(data => {
        console.log(data)
        let lotFailRateChart = dc.barChart('#lotFailRateChart');
        let totalDefectChart = dc.pieChart('#totalDefectChart');
        let iR1MaterialChart = dc.barChart('#IR1MaterialChart');
        let testdata = crossfilter(data.recordsets[0]);
        
        //Lot Yield 
        let lotDimension = testdata.dimension((d)=>d.NEW_INTEGRATED_LOT);
        let lotYieldGroup = lotDimension.group();
        lotYieldGroup.reduce(
            //add
            (p,v)=>{
                p.total=p.total+1;
                if (parseInt(v.ERROR_CODE,10) === parseInt(setting.bin,10)){
                    p.binFail = p.binFail+1;
                }
                p.failRate=p.binFail/p.total;
                return p;
            },
            //remove
            (p,v)=>{
                p.total=p.total-1;
                if (parseInt(v.ERROR_CODE,10) === parseInt(setting.bin,10)){
                    p.binFail = p.binFail-1;
                }
                p.failRate=p.binFail/p.total;
                return p;
            },
            //init
            (p,v)=>{
                return {
                    total: 0,
                    binFail: 0,
                    failRate:0,
                }
            })

            lotFailRateChart
            .width(800)
            .height(300)
            .margins({top: 10, right: 40, bottom: 20, left: 80})
            .dimension(lotDimension)
            .group(lotYieldGroup)
            .gap(4)
            .brushOn(false)
            .valueAccessor( (p)=>p.value.failRate)
            .elasticY(true) 
            .x(d3.scaleBand())
            .xUnits(dc.units.ordinal)
            .y(d3.scaleLinear().domain([0, 1]))
            .xAxisLabel('Lot ID')
            .yAxisLabel('Defect Rate')
            .yAxis().tickFormat(
                function (v) { return parseFloat(v)*100 + '%'; });
            
            //total defect rate
            let totalDefectDimension = testdata.dimension((d)=>d.ERROR_CODE === setting.bin?"Defect":"Pass");
            let totalDefectGroup = totalDefectDimension.group();

            totalDefectChart
            .width(180)
            .height(180)
            .radius(80)
            .dimension(totalDefectDimension)
            .group(totalDefectGroup)
            .innerRadius(40);

            //IR1 Material Chart
            let iR1Dimension = testdata.dimension((d)=>d['IR1 Batch #']);
            let iR1YieldGroup = iR1Dimension.group();
            iR1YieldGroup.reduce(
                //add
                (p,v)=>{
                    p.total=p.total+1;
                    if (parseInt(v.ERROR_CODE,10) === parseInt(setting.bin,10)){
                        p.binFail = p.binFail+1;
                    }
                    p.failRate=p.binFail/p.total;
                    return p;
                },
                //remove
                (p,v)=>{
                    p.total=p.total-1;
                    if (parseInt(v.ERROR_CODE,10) === parseInt(setting.bin,10)){
                        p.binFail = p.binFail-1;
                    }
                    p.failRate=p.binFail/p.total;
                    return p;
                },
                //init
                (p,v)=>{
                    return {
                        total: 0,
                        binFail: 0,
                        failRate:0,
                    }
                });
    
                iR1MaterialChart
                .width(800)
                .height(300)
                .dimension(iR1Dimension)
                .group(iR1YieldGroup)
                .valueAccessor( (p)=>p.value.failRate)
                .elasticY(true) 
                .x(d3.scaleBand())
                .xUnits(dc.units.ordinal)
                .y(d3.scaleLinear().domain([0, 1]))
                .xAxisLabel('IR1 Batch')
                .yAxisLabel('Defect Rate')
                .yAxis().tickFormat(
                    function (v) { return parseFloat(v)*100 + '%'; });
            
            
            
            
           
        
    }).then(()=>{
    
    setTimeout(
        ()=> dc.renderAll(),5000
    )
    })
}
