import React, { Component } from 'react';
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
  state = {
    start: this.props.start,
    end: this.props.end,
  };

  handleDrag = (name, { deltaX, deltaY }) => {
    if (name === 'start' || name === 'line') {
      this.setState({
        start: {
          x: this.state.start.x + deltaX,
          y: this.state.start.y + deltaY
        }
      });
    }
    if (name === 'end' || name === 'line') {
      this.setState({
        end: {
          x: this.state.end.x + deltaX,
          y: this.state.end.y + deltaY
        }
      });
    }
  };

  render() {
    const { start, end } = this.state;
    const midX = ((end.x - start.x) / 2) + start.x;
    const pathData = `
      M ${start.x} ${start.y}
      C ${midX} ${start.y} ${midX} ${end.y}
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

        {/*
        <circle r="5" cx={midX} cy={start.y} />
        <circle r="5" cx={midX} cy={end.y} />
        */}
      </g>
    )
  }
}

export default Link