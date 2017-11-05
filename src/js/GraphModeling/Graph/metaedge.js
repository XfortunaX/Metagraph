import { Geometry, Vector3, LineBasicMaterial, Line } from 'three'
import PubSub from './pubSub'

export default class MetaEdge {
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
    // this.geometry.computeLineDistances();
    this.material = new LineBasicMaterial( { color: 0x000000 } );
    this.edgeLine = new Line( this.geometry, this.material );
  }

  updateEdge(v1, v2) {
    this.edgeLine.geometry.vertices[0] = v1;
    this.edgeLine.geometry.vertices[1] = v2;
    this.edgeLine.geometry.verticesNeedUpdate = true;
  }

}
