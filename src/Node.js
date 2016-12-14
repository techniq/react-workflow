import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DraggableCore } from 'react-draggable';
import Port from './Port';

class Node extends Component {
  
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
    const { x, y, label } = this.props;

    const style = {
      position: 'absolute',
      left: 0,
      top: 0,
      transform: `translate(${x}px, ${y}px)`
    };

    const width = 200;
    const height = 50;

    // TODO: These will be set as part by user's child component
    const additionalStyles = {
      width,
      height,
      backgroundColor: '#474B51',
      borderRadius: 5,
      boxShadow: '0 1px 10px rgba(0,0,0,.2)',
      color: 'white',
      fontFamily: 'arial',
      lineHeight: `${height}px`,
      paddingLeft: 20,
    };

    return (
      <DraggableCore onDrag={this.handleDrag}>
        <div style={{...style, ...additionalStyles}} onDoubleClick={this.handleDoubleClick}>
          {label}
          <Port nodeBox={{x, y, width, height}} type="input" />
          <Port nodeBox={{x, y, width, height}} type="output" />
        </div>
      </DraggableCore>
    )
  }
}

export default connect()(Node);