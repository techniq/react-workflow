import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DraggableCore } from 'react-draggable';

const styles = {
  node: {
    fill: '#474B51',
    filter: 'url(#dropshadow)',
  },
  input: {
    fill: '#8BC34A'
  },
  output: {
    fill: '#F44336'
  },
  label: {
    fill: 'white',
    fontFamily: 'arial'
  }
}

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

  handleAddLink = (e, { x: connectorX, y: connectorY }) => {
    e.stopPropagation();

    const { x, y } = this.props;

    // Capture Id to be given to the link being added as it will be used while being dragged out of connector
    this.newLinkId = this.props.nextLinkId;

    this.props.dispatch({
      type: 'ADD_LINK',
      payload: {
        start: {
          x: x + connectorX,
          y: y + connectorY
        }, 
        end: {
          x: x + connectorX,
          y: y + connectorY
        }
      }
    })
  };

  handleMoveLink = (name, { deltaX, deltaY }) => {
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

  handleAttachLink = () => {
    this.props.dispatch({
      type: 'ATTACH_LINK',
      payload: {
        id: this.newLinkId
      }
    });
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
    const width = 200;
    const height = 50;
    const input = {
      x: 0,
      y: height / 2
    }
    const output = {
      x: width,
      y: height / 2
    }
    const text = {
      x: 20,
      y: 30
    }

    return (
      <g transform={`translate(${x},${y})`}>
        <DraggableCore onDrag={this.handleDrag}>
          <rect
            rx={5}
            width={width} height={height}
            onDoubleClick={this.handleDoubleClick}
            {...styles.node} />
        </DraggableCore>

        <DraggableCore
          onStart={(e) => this.handleAddLink(e, input)}
          onDrag={(e, data) => this.handleMoveLink('start', data)}
          onStop={this.handleAttachLink}
        >
          <circle
            cx={input.x} cy={input.y} r={5}
            {...styles.input} />
        </DraggableCore>

        <DraggableCore
          onStart={(e) => this.handleAddLink(e, output)}
          onDrag={(e, data) => this.handleMoveLink('end', data)}
          onStop={this.handleAttachLink}
        >
          <circle
            cx={output.x} cy={output.y} r={5}
            {...styles.output} />
        </DraggableCore>

        <text x={text.x} y={text.y} {...styles.label}>{label}</text>
      </g>
    )
  }
}

export default connect(state => {
  return {
    nextLinkId: state.links.meta.nextId,
  }
})(Node);