import React, { Component } from 'react';
import Canvas from './Canvas';
import Node from './Node';
import Link from './Link';
import './App.css';

class App extends Component {
  render() {
    return (
      <Canvas> 
        {/*<Link start={{x: 200, y: 300}} end={{x: 300, y: 400}} />*/}
        <Node x={100} y={100} />
        <Node x={500} y={200} />
      </Canvas> 
    )
  }
}

export default App;
