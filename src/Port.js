import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DraggableCore } from 'react-draggable';

class Port extends Component {
  
  handleStart = (e, coords) => {
    e.stopPropagation();

    // Capture Id to be given to the link being added as it will be used while being dragged out of connector
    this.newLinkId = this.props.nextLinkId;

    this.props.dispatch({
      type: 'ADD_LINK',
      payload: {
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
    const { type, nodeBox } = this.props;
    const radius = 5;
    const isInput = type === 'input';
    const styles = {
      position: 'absolute',
    };

    // TODO: These will be set as part by user's child component
    const additionalStyles = {
      backgroundColor: isInput ? '#8BC34A' : '#F44336',
      borderRadius: '50%',
      width: radius * 2,
      height: radius * 2,
      left: isInput ? -radius : nodeBox.width - radius,
      top: (nodeBox.height / 2) - radius,
    }

    const coords = {
      x: isInput ? nodeBox.x : nodeBox.x + nodeBox.width,
      y: nodeBox.y + (nodeBox.height / 2)
    };

    return (
      <DraggableCore
        onStart={(e) => this.handleStart(e, coords)}
        onDrag={(e, data) => this.handleDrag(isInput ? 'start' : 'end', data)}
        onStop={this.handleStop}
      >
        <div style={{...styles, ...additionalStyles}} />
      </DraggableCore>
    );
  }
}

export default connect(state => {
  return {
    nextLinkId: state.links.meta.nextId,
  }
})(Port);