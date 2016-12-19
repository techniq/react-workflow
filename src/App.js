import React, { Component } from 'react';
import Workflow from './Workflow';
import Node from './Node';
import Link from './Link';
import Port from './Port';
import './App.css';

const nodeWidth = 200;
const nodeHeight = 50;
const nodeStyles = {
  width: 200,
  height: 50,
  backgroundColor: '#474B51',
  borderRadius: 5,
  boxShadow: '0 1px 10px rgba(0,0,0,.2)',
  color: 'white',
  fontFamily: 'arial',
  lineHeight: `${50}px`,
  paddingLeft: 20,
};

const radius = 5;
const portTop = (nodeHeight / 2)
const portStyles = {
  borderRadius: '50%',
  width: radius * 2,
  height: radius * 2,
  top: -radius,
  left: -radius,
  position: 'relative',
};

const InputPort = () => (
  <Port type="input" x={0} y={portTop}>
    <div style={{ ...portStyles,  backgroundColor: '#8BC34A'}} />
  </Port>
)

const OutputPort = () => (
  <Port type="output" x={nodeWidth} y={portTop} style={portStyles}>
    <div style={{ ...portStyles,  backgroundColor: '#F44336'}} />
  </Port>
)

class App extends Component {
  render() {
    return (
      <Workflow> 
      
        <Node label="node 1" x={100} y={100} width={nodeWidth} height={nodeHeight} id={1}>
          <div style={nodeStyles}>
            Node 1a
            <InputPort />
            <OutputPort />
          </div>
        </Node>
        
        <Node label="node 2" x={500} y={200} width={nodeWidth} height={nodeHeight} id={2}>
          <div style={nodeStyles}>
            Node 2a
            <InputPort />
            <OutputPort />
          </div>
        </Node>
        
        <Node label="node 3" x={900} y={300}  width={nodeWidth} height={nodeHeight}id={3}>
          <div style={nodeStyles}>
            Node 3a
            <InputPort />
            <OutputPort />
          </div>
        </Node>
        
        <Link start={{x: 300, y: 125, node: 1}} end={{x: 500, y: 225, node: 2}} id={1} />
        <Link start={{x: 700, y: 225, node: 2}} end={{x: 900, y: 325, node: 3}} id={2} />
      </Workflow>
    )
  }
}

export default App;
