import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Canvas from './Canvas';

const testState = {
  nodes: {
    meta: {
      nextId: 4
    },
    items: {
      1: { label: 'node 1', x: 100, y: 100 },
      2: { label: 'node 2', x: 500, y: 200 },
      3: { label: 'node 3', x: 900, y: 300 }
    }
  },
  links: {
    meta: {
      nextId: 3
    },
    items: {
      1: {
        start: { x: 300, y: 125, output: 1 },
        end:   { x: 500, y: 225, input: 2 }
      },
      2: {
        start: { x: 700, y: 225, output: 2 },
        end:   { x: 900, y: 325, input: 3 }
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
      const nodeItems = state.nodes.items;
      const node = nodeItems[id];

      // Update connected links to node being moved
      const linkItems = Object.keys(state.links.items).reduce((result, linkId) => {
        const link = state.links.items[linkId];
        if (link.start.input == id || link.start.output == id) {
          result[linkId] = {
            ...link,
            start: {
              ...link.start,
              x: link.start.x + deltaX, 
              y: link.start.y + deltaY
            }
          }
        } else if (link.end.input == id || link.end.output == id) {
          result[linkId] = {
            ...link,
            end: {
              ...link.end,
              x: link.end.x + deltaX, 
              y: link.end.y + deltaY
            }
          }
        } else {
          // unaffected
          result[linkId] = link;
        }

        return result;
      }, {})

      return {
        ...state,
        nodes: {
          ...state.nodes,
          items: {
            ...nodeItems,
            [id]: {
              ...node,
              x: node.x + deltaX,
              y: node.y + deltaY
            }
          }
        },
        links: {
          ...state.links,
          items: linkItems
        }
      }
    }

    case 'REMOVE_NODE': {
      const { id } = action.payload;
      const nodeItems = {...state.nodes.items};
      delete nodeItems[id];

      // Delete links connected to removed node
      const linkItems = Object.keys(state.links.items).reduce((result, linkId) => {
        const link = state.links.items[linkId];
        if (link.start.input == id || link.start.output == id || link.end.input == id || link.end.output == id) {
          // remove link
        } else {
          result[linkId] = link;
        }

        return result;
      }, {})

      return {
        ...state,
        nodes: {
          ...state.nodes,
          items: nodeItems
        },
        links: {
          ...state.links,
          items: linkItems
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
      const linkItems = state.links.items;
      const link = linkItems[id];

      return {
        ...state,
        links: {
          ...state.links,
          items: {
            ...linkItems,
            [id]: {
              ...link,
              start: {
                x: link.start.x + start.deltaX,
                y: link.start.y + start.deltaY
              },
              end: {
                x: link.end.x + end.deltaX,
                y: link.end.y + end.deltaY
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