import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { DraggableCore } from 'react-draggable';
import Port from './Port';

class Node extends Component {

  static childContextTypes = {
    node: PropTypes.object.isRequired
  }

  getChildContext() {
    return {
      node: this
    }
  }

  handleDrag = (e, { deltaX, deltaY }) => {
    this.props.dispatch({
      type: 'MOVE_NODE',
      payload: {
        id: this.props.id,
        deltaX,
        deltaY
      }
    })
  };

  handleDoubleClick = (e) => {
    e.stopPropagation();
    this.props.dispatch({
      type: 'REMOVE_NODE',
      payload: {
        id: this.props.id,
      }
    });
  };

  render() {
    const { x, y, children } = this.props;

    const style = {
      position: 'absolute',
      left: 0,
      top: 0,
      transform: `translate(${x}px, ${y}px)`
    };

    return (
      <DraggableCore onDrag={this.handleDrag}>
        <div style={style} onDoubleClick={this.handleDoubleClick}>
          {children}
        </div>
      </DraggableCore>
    )
  }
}

export default connect()(Node);