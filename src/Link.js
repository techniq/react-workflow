import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DraggableCore } from 'react-draggable';

const styles = {
  circle: {
    fill: '#555'
  },
  path: {
    stroke: '#555',
    strokeWidth: 2,
    fill: 'none'
  }
}

class Link extends Component {

  handleDrag = (name, { deltaX, deltaY }) => {
    this.props.dispatch({
      type: 'MOVE_LINK',
      payload: {
        id: this.props.id,
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
    const { start, end } = this.props;
    const midX = ((end.x - start.x) / 2) + start.x;
    const midOffset = (start.x > end.x) ? (start.x - end.x) * 1.5 + 50 : 50;
    const pathData = `
      M ${start.x} ${start.y}
      C ${midX + midOffset} ${start.y} ${midX - midOffset} ${end.y}
      ${end.x} ${end.y}
    `;

    return (
      <g>
        <DraggableCore onDrag={(e, data) => this.handleDrag('line', data)}>
          <path d={pathData} {...styles.path} />
        </DraggableCore>

        <DraggableCore onDrag={(e, data) => this.handleDrag('start', data)}>
          <circle r={5} cx={start.x} cy={start.y} {...styles.circle} />
        </DraggableCore>

        <DraggableCore onDrag={(e, data) => this.handleDrag('end', data)}>
          <circle r={5} cx={end.x} cy={end.y} {...styles.circle} />
        </DraggableCore>
      </g>
    )
  }
}

export default connect()(Link)