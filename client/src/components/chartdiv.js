import React from 'react';


export class ChartDiv extends React.Component{
    constructor(props){
        super(props)
    }
 

    render(){
        return (
        <div className = 'chart-plot'>
        <button className = 'btn btn-default' onClick = {()=>this.props.resetFilter()}>Reset</button>
            
            <div id='lotFailRateChart' className='clearfix'>
                <span className='chart-title'>Lot Fail Rate Chart</span>
                <br/>
                <span>Current Filter:</span>
                <span className="filter"></span>
                <br/>
            </div>

            <div id='panelHeatMap'>
                <span>Panel Heap Map</span>
                <br/>
                <span>Current Filter:</span>
                <span className="filter"></span>
                <br/>
            </div>
            
            <div id='totalDefectChart'>
                <span className='chart-title'>Total Defect Rate</span>
                <br/>
                <span>Current Filter:</span>
                <span className="filter"></span>
                <br/>
            </div>
            
            <div id='IR1MaterialChart'>
                <span>IR1 Material Chart</span>
                <br/>
                <span>Current Filter:</span>
                <span className="filter"></span>
                <br/>
            </div>

            <div id='IR2MaterialChart'>
                <span>IR2 Material Chart</span>
                <br/>
                <span>Current Filter:</span>
                <span className="filter"></span>
                <br/>
            </div>

            <div id='timeChart'>
                <span>Day Time Chart</span>
                <br/>
                <span>Current Filter:</span>
                <span className="filter"></span>
                <br/>
            </div>

            
        </div>

        )
    }
}


