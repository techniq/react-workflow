import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Canvas from './Canvas';
import Node from './Node';
import Link from './Link';

// const testState = {
//   nodes: {
//     meta: {
//       nextId: 4
//     },
//     items: {
//       1: { label: 'node 1', x: 100, y: 100 },
//       2: { label: 'node 2', x: 500, y: 200 },
//       3: { label: 'node 3', x: 900, y: 300 }
//     }
//   },
//   links: {
//     meta: {
//       nextId: 3
//     },
//     items: {
//       1: {
//         start: { x: 300, y: 125, node: 1 },
//         end:   { x: 500, y: 225, node: 2 }
//       },
//       2: {
//         start: { x: 700, y: 225, node: 2 },
//         end:   { x: 900, y: 325, node: 3 }
//       }
//     }
//   },
// }

const defaultState = {
  nodes: {
    meta: {
      nextId: 1
    },
    items: {}
  },
  links: {
    meta: {
      nextId: 1
    },
    items: {}
  }
}

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'ADD_NODE': {
      const { id, ...props } = action.payload;
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
            [id]: props
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
        if (link.start.node == id) {
          result[linkId] = {
            ...link,
            start: {
              ...link.start,
              x: link.start.x + deltaX, 
              y: link.start.y + deltaY
            }
          }
        } else if (link.end.node == id) {
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
        if (link.start.node == id || link.end.node == id) {
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
      const { id, ...props } = action.payload;
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
            [id]: props
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

    case 'ATTACH_LINK': {
      const { id } = action.payload;
      const link = state.links.items[id];

      // Check each node to see if link's ends are close enough to attach
      const ATTACH_THRESHOLD = 10;
      // TODO: Do not hard code width/height to determine location of node's connection points
      const NODE_WIDTH = 200;
      const NODE_HEIGHT = 50;

      const startNodeId = Object.keys(state.nodes.items)
        .filter(nodeId => {
          const node = state.nodes.items[nodeId];
          return (
            Math.abs(link.start.x - node.x - NODE_WIDTH) < ATTACH_THRESHOLD && 
            Math.abs(link.start.y - node.y - (NODE_HEIGHT / 2)) < ATTACH_THRESHOLD
          )
        })[0];

      const endNodeId = Object.keys(state.nodes.items)
        .filter(nodeId => {
          const node = state.nodes.items[nodeId];
          return (
            Math.abs(link.end.x - node.x) < ATTACH_THRESHOLD &&
            Math.abs(link.end.y - node.y - (NODE_HEIGHT / 2)) < ATTACH_THRESHOLD
          )
        })[0];

      let linkItems;
      if (startNodeId && endNodeId) {
        const startNode = state.nodes.items[startNodeId];
        const endNode = state.nodes.items[endNodeId];

        linkItems = {
          ...state.links.items,
          [id]: {
            ...link,
            start: {
              x: startNode.x + NODE_WIDTH,
              y: startNode.y + (NODE_HEIGHT / 2),
              node: startNodeId
            },
            end: {
              x: endNode.x,
              y: endNode.y + (NODE_HEIGHT / 2),
              node: endNodeId
            }
          }
        };
      } else {
        // remove link as not attached on one side
        linkItems = {...state.links.items};
        delete linkItems[id];
      }

      return {
        ...state,
        links: {
          ...state.links,
          items: linkItems
        }
      }
    }

    default:
      return state;
  }
}

const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

class Workflow extends Component {
  componentWillMount() {
    React.Children.forEach(this.props.children, child => {
      if (child.type.WrappedComponent.name === Node.WrappedComponent.name) {
        store.dispatch({
          type: 'ADD_NODE',
          payload: {
            id: child.id,
            ...child.props
          }
        })
      } else if (child.type.WrappedComponent.name === Link.WrappedComponent.name) {
        store.dispatch({
          type: 'ADD_LINK',
          payload: {
            id: child.id,
            ...child.props
          }
        })
      }
    })
  }

  render() {
    return (
      <Provider store={store}>
        <Canvas>
          {this.props.children}
        </Canvas>
      </Provider>
    )
  }
}

export default Workflow;