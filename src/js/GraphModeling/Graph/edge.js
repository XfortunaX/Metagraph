import { Geometry, Vector3, LineBasicMaterial, Line } from 'three'
import PubSub from './pubSub'

export default class Edge {
  constructor(props) {
    this.name = props.name;
    this.edge = {
      start: {
        name: props.edge.start.name,
        pos: props.edge.start.pos
      },
      end: {
        name: props.edge.end.name,
        pos: props.edge.end.pos
      }
    };
    this.cost = props.cost;
    this.pubSub = new PubSub();

    this.createEdge();
  }

  check(v1, v2) {
    if (v1 === this.edge.start.name && v2 === this.edge.end.name) {
      return true;
    }
    return false;
  }

  getName() {
    return this.name;
  }

  getCost() {
    return this.cost;
  }

  getEdge() {
    return this.edge;
  }
  getMesh() {
    return this.edgeLine;
  }

  createEdge() {
    this.geometry = new Geometry();
    this.geometry.dynamic = true;
    this.vertArray = this.geometry.vertices;
    this.vertArray.push(
      new Vector3(this.edge.start.pos.x, this.edge.start.pos.y, this.edge.start.pos.z),
      new Vector3(this.edge.end.pos.x, this.edge.end.pos.y, this.edge.end.pos.z)
    );
    this.material = new LineBasicMaterial( { color: 0x000000 } );
    this.edgeLine = new Line( this.geometry, this.material );
  }

  updateEdge(v1, v2) {
    // console.log(v1, v2);
    this.edgeLine.geometry.vertices[0] = v1;
    this.edgeLine.geometry.vertices[1] = v2;
    this.edgeLine.geometry.verticesNeedUpdate = true;

  }

}

// export default class Edge {
//   constructor(props) {
//     this.props = {
//       name: props.name,
//       edge: {
//         start: {
//           name: props.edge.start.name,
//           pos: props.edge.end.pos
//         },
//         end: {
//           name: props.edge.start.name,
//           pos: props.edge.end.pos
//         },
//         cost: props.cost
//       }
//     };
//
//     this.pubSub = new PubSub();
//
//     this.createEdge();
//   }
//
//   check(v1, v2) {
//     if ((v1 === this.props.edge.start.name && v2 === this.props.edge.end.name) ||
//       v2 === this.props.edge.start.name && v1 === this.props.edge.end.name) {
//       return true;
//     }
//     return false;
//   }
//
//   checkOut(v) {
//     if (v === this.props.edge.start.name || v === this.props.edge.end.name) {
//       return true;
//     }
//     return false;
//   }
//
//   getName() {
//     return this.props.name;
//   }
//   getCost() {
//     return this.props.cost;
//   }
//   getEdge() {
//     return this.props.edge;
//   }
//   getMesh() {
//     return this.edgeLine;
//   }
//
//   createEdge() {
//     this.geometry = new Geometry();
//     this.geometry.dynamic = true;
//     this.vertArray = this.geometry.vertices;
//     this.vertArray.push(
//       new Vector3(this.props.edge.start.pos.x, this.props.edge.start.pos.y, this.props.edge.start.pos.z),
//       new Vector3(this.props.edge.end.pos.x, this.props.edge.end.pos.y, this.props.edge.end.pos.z)
//     );
//     this.material = new LineBasicMaterial( { color: 0xcc0000 } );
//     this.edgeLine = new Line( this.geometry, this.material );
//   }
//
//   updateEdge(v1, v2) {
//     this.edgeLine.geometry.vertices[0] = v1;
//     this.edgeLine.geometry.vertices[1] = v2;
//     this.edgeLine.geometry.verticesNeedUpdate = true;
//   }
//
// }
