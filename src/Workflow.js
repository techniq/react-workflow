import React, { Component, PropTypes } from 'react';
import { Provider, connect } from 'react-redux';
import { createStore } from 'redux';
import Canvas from './Canvas';

const testState = {
  nodes: {
    meta: {
      nextId: 3
    },
    items: {
      1: { x: 100, y: 100 },
      2: { x: 500, y: 200 }
    }
  },
  links: {
    meta: {
      nextId: 1
    },
    items: {}
  },
}

const defaultState = {
  nodes: [],
  links: []
}

const reducer = (state = testState, action) => {
  switch (action.type) {
    case 'ADD_NODE': 
      return {
        ...state,
        nodes: {
          ...state.nodes,
          meta: {
            ...state.nodes.meta,
            nextId: state.nodes.meta.nextId + 1
          },
          items: {
            ...state.nodes.items,
            [state.nodes.meta.nextId]: action.payload
          }
        }
      }

    case 'MOVE_NODE':
      return {
        ...state,
        nodes: {
          ...state.nodes,
          items: {
            ...state.nodes.items,
            [action.payload.id]: {
              x: state.nodes.items[action.payload.id].x + action.payload.deltaX,
              y: state.nodes.items[action.payload.id].y + action.payload.deltaY
            }
          }
        }
      }

    case 'ADD_LINK': 
      return {
        ...state,
        links: {
          ...state.links,
          meta: {
            ...state.links.meta,
            nextId: state.links.meta.nextId + 1
          },
          items: {
            ...state.links.items,
            [state.links.meta.nextId]: action.payload
          }
        }
      }

    case 'MOVE_LINK':
      return {
        ...state,
        links: {
          ...state.links,
          items: {
            ...state.links.items,
            [action.payload.id]: {
              start: {
                x: state.links.items[action.payload.id].start.x + action.payload.start.deltaX,
                y: state.links.items[action.payload.id].start.y + action.payload.start.deltaY
              },
              end: {
                x: state.links.items[action.payload.id].end.x + action.payload.end.deltaX,
                y: state.links.items[action.payload.id].end.y + action.payload.end.deltaY
              }
            }
          }
        }
      }

    default:
      return state;
  }
}

const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

class Workflow extends Component {

  render() {
    return (
      <Provider store={store}>
        <Canvas />
      </Provider>
    )
  }
}

export default Workflow;