import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Canvas from './Canvas';

const testState = {
  nodes: {
    meta: {
      nextId: 3
    },
    items: {
      1: { label: 'node 1', x: 100, y: 100 },
      2: { label: 'node 2', x: 500, y: 200 }
    }
  },
  links: {
    meta: {
      nextId: 1
    },
    items: {
      1: {
        start: { x: 300, y: 125 },
        end:   { x: 500, y: 225 }
      }
    }
  },
}

// const defaultState = {
//   nodes: {
//     meta: {},
//     items: {}
//   },
//   links: {
//     meta: {},
//     items: {}
//   }
// }

const reducer = (state = testState, action) => {
  switch (action.type) {
    case 'ADD_NODE': {
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
    }

    case 'MOVE_NODE': {
      const { id, deltaX, deltaY } = action.payload;
      const items = state.nodes.items;
      const item = items[id];

      return {
        ...state,
        nodes: {
          ...state.nodes,
          items: {
            ...items,
            [id]: {
              ...item,
              x: item.x + deltaX,
              y: item.y + deltaY
            }
          }
        }
      }
    }

    case 'ADD_LINK': {
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
    }

    case 'MOVE_LINK': {
      const { id, start, end } = action.payload;
      const items = state.links.items;
      const item = items[id];

      return {
        ...state,
        links: {
          ...state.links,
          items: {
            ...items,
            [id]: {
              ...item,
              start: {
                x: item.start.x + start.deltaX,
                y: item.start.y + start.deltaY
              },
              end: {
                x: item.end.x + end.deltaX,
                y: item.end.y + end.deltaY
              }
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