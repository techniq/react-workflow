import React, { Component, PropTypes } from 'react';
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

        {Object.keys(links).map(linkId => {
          const link = links[linkId];
          return (
            <Link
              id={linkId}
              start={link.start}
              end={link.end}
              key={`link-${linkId}`} />
          )
        })}

        {Object.keys(nodes).map(nodeId => {
          const node = nodes[nodeId];
          return (
            <Node
              id={nodeId}
              x={node.x} y={node.y}
              key={`node-${nodeId}`} />
          )
        })}

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