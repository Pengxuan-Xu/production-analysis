var dc =require('dc');
var crossfilter = require('crossfilter2');
var d3 = require('d3')

export const plotChart = (setting,chart)=>{


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
        let testdata = crossfilter(data.recordsets[0]);
        let lotFailRateChart = dc.barChart('#lotFailRateChart');
        let totalDefectChart = dc.pieChart('#totalDefectChart');
        let IR1MaterialChart = dc.barChart('#IR1MaterialChart');
        let IR2MaterialChart = dc.barChart('#IR2MaterialChart');
        let panelHeatMap = dc.heatMap("#panelHeatMap");
        let timeChart = dc.lineChart("#timeChart")



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
            .width(1000)
            .height(300)
            .margins({top: 10, right: 40, bottom: 60, left: 60})
            .dimension(lotDimension)
            .group(lotYieldGroup)
            .barPadding(0.4)
            .brushOn(true)
            .valueAccessor( (p)=>p.value.failRate)
            .elasticY(true) 
            .turnOnControls(true)
            .x(d3.scaleBand())
            .xUnits(dc.units.ordinal)
            .y(d3.scaleLinear().domain([0, 1]))
            .xAxisLabel('Lot ID')
            .yAxisLabel('Defect Rate')
            .yAxis().tickFormat(
                function (v) { return parseFloat(v*100).toFixed(1) + '%'; });
            
            //total defect rate
            let totalDefectDimension = testdata.dimension((d)=>d.ERROR_CODE === setting.bin?"Defect":"Pass");
            let totalDefectGroup = totalDefectDimension.group();

            totalDefectChart
            .width(200)
            .height(200)
            .radius(90)
            .dimension(totalDefectDimension)
            .group(totalDefectGroup)
            .turnOnControls(true)
            .innerRadius(40);


            //IR1 Material Chart
            let IR1Dimension = testdata.dimension((d)=>d['IR1 Batch #']);
            let IR1YieldGroup = IR1Dimension.group();
            IR1YieldGroup.reduce(
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
    
                IR1MaterialChart
                .width(400)
                .height(250)
                .margins({top: 10, right: 40, bottom: 60, left: 60})
                .dimension(IR1Dimension)
                .group(IR1YieldGroup)
                .valueAccessor( (p)=>p.value.failRate)
                .elasticY(true) 
                .brushOn(true)
                .barPadding(0.1)
                .turnOnControls(true)
                .x(d3.scaleBand())
                .xUnits(dc.units.ordinal)
                .y(d3.scaleLinear().domain([0, 1]))
                .xAxisLabel('IR1 Batch')
                .yAxisLabel('Defect Rate')
                .yAxis().tickFormat(
                    function (v) { return parseFloat(v*100).toFixed(1) + '%'; });
            
            //IR2 Material Chart 
            let IR2Dimension = testdata.dimension((d)=>d['IR2 Batch #']);
            let IR2YieldGroup = IR2Dimension.group();
            IR2YieldGroup.reduce(
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
    
                IR2MaterialChart
                .width(400)
                .height(250)
                .margins({top: 10, right: 40, bottom: 60, left: 60})
                .dimension(IR2Dimension)
                .group(IR2YieldGroup)
                .valueAccessor( (p)=>p.value.failRate)
                .elasticY(true) 
                .brushOn(true)
                .barPadding(0.3)
                .turnOnControls(true)
                .x(d3.scaleBand())
                .xUnits(dc.units.ordinal)
                .y(d3.scaleLinear().domain([0, 1]))
                .xAxisLabel('IR1 Batch')
                .yAxisLabel('Defect Rate')
                .yAxis().tickFormat(
                    function (v) { return parseFloat(v*100).toFixed(1) + '%'; });
            
            //Panel Heat Map
            let panelDimension = testdata.dimension((d)=>[+d.PANEL_COL,+d.PANEL_ROW]);
            let panelGroup = panelDimension.group();
            panelGroup.reduce(
                //add
                (p,v)=>{
                    if (parseInt(v.ERROR_CODE,10) === parseInt(setting.bin,10)){
                        p=p+1;
                    }
                    return p;
                },
                //remove
                (p,v)=>{
                    if (parseInt(v.ERROR_CODE,10) === parseInt(setting.bin,10)){
                        p=p-1;
                    }
                    return p;
                },
                //init
                (p,v)=>{
                    return p=0;
                });
            
            
            let heatColorMapping = d3.scaleLinear()
            .range(["#e5e5e5", "coral"]);
            
            panelHeatMap
            .width(45 * 16 + 80)
            .height(60 * 4 + 40)
            .dimension(panelDimension)
            .group(panelGroup)
            .keyAccessor(function(d) { return +d.key[0]; })
            .valueAccessor(function(d) { return +d.key[1]; })
            .colorAccessor(function(d) { return +d.value; })
            .colors(heatColorMapping)
            .calculateColorDomain();

            //time chart
            let timeDimension = testdata.dimension((d)=>{
                let time=new Date(Date.parse(d.LAST_UPDATE));
                // time.setFullYear(2018,0,1);
                return time;
            }
            );
            let timeGroup = timeDimension.group();
            timeGroup.reduce(
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

                timeChart
                .renderArea(true)
                .width(1000)
                .height(200)
                .transitionDuration(1000)
                .margins({top: 30, right: 50, bottom: 25, left: 40})
                .dimension(timeDimension)
                .mouseZoomable(true)
                .x(d3.scaleTime())
                .round(d3.timeMonth.round)
                .xUnits(d3.timeMonths)
            
                .elasticY(true)
                .renderHorizontalGridLines(true)
                .legend(dc.legend().x(800).y(10).itemHeight(13).gap(5))
                .brushOn(false)
                .group(timeGroup, 'Total Qty')
                .valueAccessor(function (d) {
                    return d.binFail;
                })
        
    }).then(()=>{
        dc.renderAll()
    })
}
