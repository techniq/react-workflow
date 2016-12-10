import React, { Component, PropTypes } from 'react';
import Node from './Node';
import Link from './Link';

class Canvas extends Component {
  state = {
    nodes: [],
    links: []
  }

  static childContextTypes = {
    canvas: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.subscribers = [];
  }

  getChildContext() {
    return {
      canvas: {
        addLink: (link) => {
          this.setState({
            links: [
              ...this.state.links,
              link
            ]
          }) 
        }
      }
    }
  }

  handleDoubleClick = (e) => {
    this.setState({
      nodes: [
        ...this.state.nodes,
        {
          x: e.nativeEvent.offsetX,
          y: e.nativeEvent.offsetY
        }
      ]
    })
  };

  render() {
    const { children } = this.props;
    const { nodes, links } = this.state;

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

        {links.length && links.map((link, i) => (
          <Link start={link.start} end={link.end} key={i} />
        ))}

        {nodes.length && nodes.map((node, i) => (
          <Node x={node.x} y={node.y} key={i} />
        ))}

        {children}
      </svg>
    )
  }
}

export default Canvas;