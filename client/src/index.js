import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
var dc =require('dc');
var crossfilter = require('crossfilter2');
var d3 = require('d3')



  class MyChat extends React.Component{
      constructor(props){
          super(props);
      }

    componentDidMount() {
        fetch('http://localhost:3001/')
        .then(response => {
            console.log(response.status);
            return response.json()})
        .then(data => {
            let testchart = dc.barChart('#testchart');
            var testdata = crossfilter(data.recordsets[0]);
            var testDataDimension = testdata.dimension((d)=>d.LOT_ID);
            // var defectDimension = testdata.dimension((d)=>d.TD_Defect_Rate);
            // defectDimension.filter(d=>d>0.05);
            let testgroup = testDataDimension.group();
            testgroup.reduce((p,v)=>p+v.TD_Total_QTY,
            (p,v)=>p-v.TD_Total_QTY,
            ()=>0)
            console.log(testDataDimension.top(10));
            let groupdata = testgroup.all();
            let xaxis=[];
            console.log(groupdata);
            for(let n =0 ; n<groupdata.length;n++){
                xaxis.push(groupdata[n].key);
            }
            console.log(xaxis);
            

            testchart
            .width(500)
            .height(220)
            .margins({top: 10, right: 50, bottom: 80, left: 40})
            .dimension(testDataDimension)
            .group(testgroup)
            .elasticY(true) 
            .x(d3.scaleBand())
            .xUnits(dc.units.ordinal)
            .turnOnControls(true)
            
            dc.renderAll();
            
        })
    }

    renderAll(){
        dc.renderAll();
    }

    render (){
        return (
        <div>
            <p>Total Chart</p>
            <div id='testchart'></div>
        </div>
        )
    }
  }

    ReactDOM.render(<MyChat />, document.getElementById('root'));

