import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {plotChart} from './components/chart.js'
import {ChartDiv} from './components/chartdiv.js'

var dc =require('dc');
// var crossfilter = require('crossfilter2');
// var d3 = require('d3')

// MTBXMG18700106
// MTBXMG18700111
// MTBXMG18700230
// MTBXMG18700115
// MTBXMG18700109

class Commonality extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            product: 'MTBX',
            bin:61,
            rangeOption:"Lots",
            from:0,
            to:0,
            lots:'',
        }
    }

    changeProduct(e){
        this.setState({product:e.target.value})
    }   
    changeBin(e){
        this.setState({bin: parseInt(e.target.value,10)})
    }
    changeRangeOption(e){
        this.setState({rangeOption:e.target.value})
    }
    changeLots(e){
        this.setState({lots:e.target.value})
    }
    changeFrom(e){
        this.setState({from:e.target.value})
    }
    changeTo(e){
        this.setState({to:e.target.value})
    }


    renderAll(){
        dc.renderAll();
    }

    plotChart(setting){
        this.setState({loading:true});
        plotChart(setting)
        .then (()=>{
            this.setState({loading:false})
        })
    }

    render (){
        let loading = this.state.loading&&<p>Loading Data from Server...</p>;
  

        return (
        <div className = "container">

            <div className = "input">
                <h1>Input Parameters</h1>
                <div className="form-group">  
                    <div className ="row">
                        <label className="control-label col-sm-2">Product Category:</label>
                        <div className = "col-sm-6">
                            <div className="radio-inline">
                                <label><input type="radio" value="MTBX" name="product" 
                                    checked ={this.state.product ==="MTBX"}
                                    onChange= {(e)=>this.changeProduct(e)}/>X1167-MTBX</label>
                            </div>
                            <div className="radio-inline">
                                <label><input type="radio" value="MTCX" name="product"
                                    checked ={this.state.product ==="MTCX"}
                                    onChange= {(e)=>this.changeProduct(e)}/> X1282-MTCX</label>
                            </div>
                            <div className="radio-inline">
                                <label><input type="radio" value="MTDX" name="product"
                                    checked ={this.state.product ==="MTDX"}
                                    onChange= {(e)=>this.changeProduct(e)}/>X1282-MTDX</label>
                            </div>
                        </div>
                    </div>
                    
                    <div className = "row">
                        <label className="control-label col-sm-2">Testing Fail Bin:</label>
                        <div className="col-sm-2">
                            <input type="text" className="form-control" id="testBin" placeholder="61"
                                value = {this.state.bin} onChange={(e)=>this.changeBin(e)}/>
                        </div>
                    </div>

                    <div className = "row">
                        <label className="control-label col-sm-2">Range Option:</label>
                        <div className = "col-sm-2">
                            <div className="radio-inline">
                                <label><input type="radio" value="Date" name="rangeOption" 
                                    checked ={this.state.rangeOption ==="Date"}
                                    onChange= {(e)=>this.changeRangeOption(e)}/>Date</label>
                                </div>
                            <div className="radio-inline">
                                <label><input type="radio" value="Lots" name="rangeOption"
                                    checked ={this.state.rangeOption ==="Lots"}
                                    onChange= {(e)=>this.changeRangeOption(e)}/>Lots</label>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <label className="control-label col-sm-1" >Range:</label>

                    </div>

                    <div className="row">
                        <div className="col-sm-2">
                            <label>From</label>
                            <br />
                            <input type="date" name="dateFrom" 
                                disabled={this.state.rangeOption==="Lots"}
                                onChange={(e)=>this.changeFrom(e)}/>
                            <br />
                            <label>To</label>
                            <br />
                            <input type="date" name="dateTo" 
                                disabled={this.state.rangeOption==="Lots"}
                                onChange={(e)=>this.changeTo(e)}/>
                        </div>

                        <div className="col-sm-3">
                            <textarea className="form-control" rows="5" id="testBin" 
                                placeholder="Lots ID, one lot each row"
                                onChange={(e)=>this.changeLots(e)} 
                                disabled={this.state.rangeOption==="Date"}
                                value={this.state.lots}/>
                        </div>
                    </div>

                    <div className ="row">
                        <div className="col-sm-offset-3 col-sm-2">
                        <button type="button" className="btn btn-default btn-block" 
                            onClick={()=>this.plotChart(this.state)}>Submit</button>
                        </div>
                        
                    </div>

                    <div className="row">
                        {loading}
                    </div>
                </div>
                    
            </div>   
        </div>
        )
    }
}

class App extends React.Component{
    
    resetFilter(){
        dc.filterAll();
        dc.renderAll()
    }

    render(){
    
        return(
            <div>
                <Commonality />
                <ChartDiv resetFilter={()=>this.resetFilter()}/>
            </div>
        )
    }
        
    
}

ReactDOM.render(<App />, document.getElementById('root'));

