import React, { Component } from 'react';
import { connect } from 'react-redux';
import Node from './Node';
import Link from './Link';

class Canvas extends Component {

  handleDoubleClick = (e) => {
    this.props.dispatch({
      type: 'ADD_NODE',
      payload: {
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY
      }
    })
  };

  render() {
    const { nodes, links, children } = this.props;

    return (
      <svg onDoubleClick={this.handleDoubleClick}>
        <defs>
          <filter id="dropshadow" height="130%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/> 
            <feOffset dx="2" dy="2" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.1"/>
            </feComponentTransfer>
            <feMerge> 
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/> 
            </feMerge>
          </filter>
        </defs>

        {Object.keys(links).map(linkId => <Link id={linkId} key={`link-${linkId}`} {...links[linkId]} />)}
        {Object.keys(nodes).map(nodeId => <Node id={nodeId} key={`node-${nodeId}`} {...nodes[nodeId]} />)}
        {children}
      </svg>
    )
  }
}

export default connect(state => {
  return {
    nodes: state.nodes.items,
    links: state.links.items
  }
})(Canvas);