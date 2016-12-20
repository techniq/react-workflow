import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Canvas from './Canvas';
import Node from './Node';
import Link from './Link';

const defaultState = {
  nodes: {
    meta: { nextId: 1 },
    items: {}
  },
  ports: {
    meta: { nextId: 1 },
    items: {}
  },
  links: {
    meta: { nextId: 1 },
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

      // Update ports related to node being moved
      const portItems = Object.keys(state.ports.items).reduce((result, portId) => {
        const port = state.ports.items[portId];
        if (port.nodeId == id) {
          result[portId] = {
            ...port,
            x: port.x + deltaX, 
            y: port.y + deltaY
          }
        } else {
          // unaffected
          result[portId] = port;
        }

        return result;
      }, {})

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
        ports: {
          ...state.ports,
          items: portItems
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

      // Delete ports asssociated with removed node
      const portItems = Object.keys(state.ports.items).reduce((result, portId) => {
        const port = state.ports.items[portId];
        if (port.nodeId == id) {
          // remove port
        } else {
          result[portId] = port;
        }

        return result;
      }, {})

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
        ports: {
          ...state.ports,
          items: portItems
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

    case 'ADD_PORT': {
      const { id, ...props } = action.payload;
      return {
        ...state,
        ports: {
          ...state.ports,
          meta: {
            ...state.ports.meta,
            nextId: state.ports.meta.nextId + 1
          },
          items: {
            ...state.ports.items,
            [id]: props
          }
        }
      }
    }

    case 'ATTACH_LINK': {
      const { id } = action.payload;
      const link = state.links.items[id];

      // Check each node to see if link's ends are close enough to attach
      const ATTACH_THRESHOLD = 10;

      const startPortId = Object.keys(state.ports.items)
        .filter(portId => {
          const port = state.ports.items[portId];
          return (
            port.type === 'output' &&
            Math.abs(link.start.x - port.x) < ATTACH_THRESHOLD && 
            Math.abs(link.start.y - port.y) < ATTACH_THRESHOLD
          )
        })[0];

      const endPortId = Object.keys(state.ports.items)
        .filter(portId => {
          const port = state.ports.items[portId];
          return (
            port.type === 'input' &&
            Math.abs(link.end.x - port.x) < ATTACH_THRESHOLD && 
            Math.abs(link.end.y - port.y) < ATTACH_THRESHOLD
          )
        })[0];

      let linkItems;
      if (startPortId && endPortId) {
        const startPort = state.ports.items[startPortId];
        const endPort = state.ports.items[endPortId];

        linkItems = {
          ...state.links.items,
          [id]: {
            ...link,
            start: {
              x: startPort.x,
              y: startPort.y,
              node: startPort.nodeId
            },
            end: {
              x: endPort.x,
              y: endPort.y,
              node: endPort.nodeId
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
  componentDidMount() {
    React.Children.forEach(this.props.children, child => {
      if (child.type.WrappedComponent.name === Node.WrappedComponent.name) {
        const { children, ...props } = child.props;
        store.dispatch({
          type: 'ADD_NODE',
          payload: {
            id: child.id,
            ...props
          }
        })
      } else if (child.type.WrappedComponent.name === Link.WrappedComponent.name) {
        const { children, ...props } = child.props;
        store.dispatch({
          type: 'ADD_LINK',
          payload: {
            id: child.id,
            ...props
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