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
      <div>
        <svg onDoubleClick={this.handleDoubleClick}>
          {Object.keys(links).map(linkId => <Link id={linkId} key={`link-${linkId}`} {...links[linkId]} />)}
        </svg>
        {Object.keys(nodes).map(nodeId => <Node id={nodeId} key={`node-${nodeId}`} {...nodes[nodeId]} />)}
        {children}
      </div>
    )
  }
}

export default connect(state => {
  return {
    nodes: state.nodes.items,
    links: state.links.items
  }
})(Canvas);