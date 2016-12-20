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

const InputPort = (props) => (
  <Port type="input" x={0} y={portTop} {...props}>
    <div style={{ ...portStyles,  backgroundColor: '#8BC34A'}} />
  </Port>
)

const OutputPort = (props) => (
  <Port type="output" x={nodeWidth} y={portTop} style={portStyles} {...props}>
    <div style={{ ...portStyles,  backgroundColor: '#F44336'}} />
  </Port>
)

class App extends Component {
  render() {
    return (
      <Workflow> 
      
        <Node x={100} y={100} id={1}>
          <div style={nodeStyles}>
            Node 1a
            <InputPort id="node1-input" />
            <OutputPort id="node1-output" />
          </div>
        </Node>
        
        <Node x={500} y={200} id={2}>
          <div style={nodeStyles}>
            Node 2a
            <InputPort id="node2-input" />
            <OutputPort id="node2-output" />
          </div>
        </Node>
        
        <Node x={900} y={300} id={3}>
          <div style={nodeStyles}>
            Node 3a
            <InputPort id="node3-input" />
            <OutputPort id="node3-output" />
          </div>
        </Node>
        
        {/*<Link start={{x: 300, y: 125, node: 1}} end={{x: 500, y: 225, node: 2}} id={1} />*/}
        {/*<Link start={{x: 700, y: 225, node: 2}} end={{x: 900, y: 325, node: 3}} id={2} />*/}
      </Workflow>
    )
  }
}

export default App;
