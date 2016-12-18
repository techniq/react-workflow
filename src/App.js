import React, { Component } from 'react';
import Workflow from './Workflow';
import Node from './Node';
import Link from './Link';
import './App.css';

class App extends Component {
  render() {
    return (
      <Workflow> 
        <Node label="node 1" x={100} y={100} />
        <Node label="node 2" x={500} y={200} />
        <Node label="node 3" x={900} y={300} />
        <Link start={{x: 300, y: 125, node: 1}} end={{x: 500, y: 225, node: 2}} />
        <Link start={{x: 700, y: 225, node: 2}} end={{x: 900, y: 325, node: 3}} />
      </Workflow>
    )
  }
}

export default App;
