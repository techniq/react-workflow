import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DraggableCore } from 'react-draggable';

const styles = {
  node: {
    fill: '#373A40',
    filter: 'url(#dropshadow)',
  },
  input: {
    fill: '#8BC34A'
  },
  output: {
    fill: '#F44336'
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

  handleAddLink = (e, { x, y }) => {
    e.stopPropagation();

    // Capture Id to be given to the link being added as it will be used while being dragged out of connector
    this.newLinkId = this.props.nextLinkId;

    this.props.dispatch({
      type: 'ADD_LINK',
      payload: {
        start: { x, y }, 
        end: { x, y }
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

  render() {
    const { x, y } = this.props;
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

    return (
      <g transform={`translate(${x},${y})`}>
        <DraggableCore onDrag={this.handleDrag}>
          <rect
            rx={5}
            width={width} height={height}
            {...styles.node} />
        </DraggableCore>

        <DraggableCore onStart={(e) => this.handleAddLink(e, input)} onDrag={(e, data) => this.handleMoveLink('start', data)}>
          <circle
            cx={input.x} cy={input.y} r={5}
            {...styles.input} />
        </DraggableCore>

        <DraggableCore onStart={(e) => this.handleAddLink(e, output)} onDrag={(e, data) => this.handleMoveLink('end', data)}>
          <circle
            cx={output.x} cy={output.y} r={5}
            {...styles.output} />
        </DraggableCore>
      </g>
    )
  }
}

export default connect(state => {
  return {
    nextLinkId: state.links.meta.nextId,
  }
})(Node);