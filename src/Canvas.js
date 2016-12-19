import React, { Component } from 'react';
import { connect } from 'react-redux';
import Node from './Node';
import Link from './Link';

class Canvas extends Component {

  handleDoubleClick = (e) => {
    this.props.dispatch({
      type: 'ADD_NODE',
      payload: {
        id: this.props.nextNodeId,
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY
      }
    })
  };

  render() {
    const { nodes, links } = this.props;
    const nodeElements = [];
    const linkElements = [];

    // Create new child elements with props updatable from redux state
    React.Children.forEach(this.props.children, child => {
      if (child.type.WrappedComponent.name === Node.WrappedComponent.name) {
        nodeElements.push(React.cloneElement(child, { ...nodes[child.props.id], key: child.props.id }));
      } else if (child.type.WrappedComponent.name === Link.WrappedComponent.name) {
        linkElements.push(React.cloneElement(child, { ...links[child.props.id], key: child.props.id }));
      }
    })

    // Add node elements not provided as children of <Workflow />
    const childrenNodeKeys = nodeElements.map(ne => ne.key);
    const nonChildrenNodeKeys = Object.keys(nodes).filter(key => !childrenNodeKeys.includes(key));
    Array.prototype.push.apply(nodeElements, nonChildrenNodeKeys.map(key => (
      <Node { ...nodes[key] } width={200} height={50} id={key} key={key}>
        TODO: What would be rendered here
      </Node>
    )))

    // Add link elements not provided as children of <Workflow />
    const childrenLinkKeys = linkElements.map(le => le.key);
    const nonChildrenLinkKeys = Object.keys(links).filter(key => !childrenLinkKeys.includes(key));
    Array.prototype.push.apply(linkElements, nonChildrenLinkKeys.map(key => (
      <Link { ...links[key] } key={key} />
    )))

    return (
      <div>
        <svg onDoubleClick={this.handleDoubleClick}>
          {linkElements}
        </svg>
        {nodeElements}
      </div>
    )
  }
}

export default connect(state => {
  return {
    nextNodeId: state.nodes.meta.nextId,
    nodes: state.nodes.items,
    links: state.links.items
  }
})(Canvas);