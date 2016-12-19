import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { DraggableCore } from 'react-draggable';

class Port extends Component {

  static contextTypes = {
    node: PropTypes.object
  }
  
  handleStart = (e, coords) => {
    e.stopPropagation();

    // Capture Id to be given to the link being added as it will be used while being dragged out of connector
    this.newLinkId = this.props.nextLinkId;

    this.props.dispatch({
      type: 'ADD_LINK',
      payload: {
        id: this.newLinkId,
        start: coords,
        end: coords
      }
    })
  };

  handleDrag = (name, { deltaX, deltaY }) => {
    this.props.dispatch({
      type: 'MOVE_LINK',
      payload: {
        id: this.newLinkId,
        start: {
          deltaX: name === 'start' || name === 'line' ? deltaX : 0,
          deltaY: name === 'start' || name === 'line' ? deltaY : 0,
        },
        end: {
          deltaX: name === 'end' || name === 'line' ? deltaX : 0,
          deltaY: name === 'end' || name === 'line' ? deltaY : 0,
        }
      }
    });
  };

  handleStop = () => {
    this.props.dispatch({
      type: 'ATTACH_LINK',
      payload: {
        id: this.newLinkId
      }
    });
  };

  render() {
    const { x, y, type, children } = this.props;
    const { node } = this.context;

    const styles = {
      position: 'absolute',
      left: x,
      top: y
    };

    const coords = {
      x: node.props.x + x,
      y: node.props.y + y
    };

    return (
      <DraggableCore
        onStart={(e) => this.handleStart(e, coords)}
        onDrag={(e, data) => this.handleDrag(type === 'input' ? 'start' : 'end', data)}
        onStop={this.handleStop}
      >
        <div style={styles}>
          {children}
        </div>
      </DraggableCore>
    );
  }
}

export default connect(state => {
  return {
    nextLinkId: state.links.meta.nextId,
  }
})(Port);