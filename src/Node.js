import React, { Component, PropTypes } from 'react';
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

  handleAddLink = (e) => {
    e.stopPropagation();

    this.props.dispatch({
      type: 'ADD_LINK',
      payload: {
        start: {
          x: e.nativeEvent.offsetX,
          y: e.nativeEvent.offsetY
        }, 
        end: {
          x: e.nativeEvent.offsetX + 100,
          y: e.nativeEvent.offsetY + 100
        } 
      }
    })
  };

  render() {
    const { x, y } = this.props;
    const width = 200;
    const height = 50;

    return (
      <DraggableCore onDrag={this.handleDrag}>
        <g>
          <rect
            x={x} y={y} rx={5}
            {...styles.node}
            width={width} height={height}/>
          <circle
            cx={x} cy={y + height / 2} r={5}
            {...styles.input}
            onMouseDown={this.handleAddLink} />
          <circle
            cx={x + width} cy={y + height / 2} r={5}
            {...styles.output}
            onMouseDown={this.handleAddLink} />
        </g>
      </DraggableCore>
    )
  }
}

export default connect()(Node)