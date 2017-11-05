import { SphereGeometry, Mesh, MeshLambertMaterial, Vector3 } from 'three'
import PubSub from './pubSub'
import { KOEF_VERT_GEN } from '../../../constants/index'

export default class Vertex {
  constructor(props) {
    this.props = {
      name: props.name,
      pos: { x: 0, y: 0, z: 0},
      posAbs: { x: props.posAbs.x, y: props.posAbs.y, z: props.posAbs.z },
      posMeta: props.posMeta,
      cost: props.cost,
      num: props.num,
      parent: []
    };
    this.props.parent.push(props.parent);

    this.pubSub = new PubSub();

    this.createVertex();
  }

  getName() {
    return this.props.name;
  }
  getPos() {
    return this.props.pos;
  }
  getMesh() {
    return this.vertex;
  }
  getPosAbs() {
    return this.props.posAbs;
  }
  getParent() {
    return this.props.parent;
  }
  addParent(parent) {
    this.props.parent.push(parent);
    console.log(this.props.parent);
  }

  createVertex() {
    let vect = new Vector3(
      Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5
    );
    vect.normalize();
    vect.x *= KOEF_VERT_GEN;
    vect.y *= KOEF_VERT_GEN;
    vect.z *= KOEF_VERT_GEN;

    this.props.pos.x = vect.x;
    this.props.pos.y = vect.y;
    this.props.pos.z = vect.z;

    this.props.posAbs.x += this.props.pos.x;
    this.props.posAbs.y += this.props.pos.y;
    this.props.posAbs.z += this.props.pos.z;

    this.geometry = new SphereGeometry( 1, 32, 32 );
    this.material = new MeshLambertMaterial( { color: 0x00FFFF } );
    this.vertex = new Mesh( this.geometry, this.material );
    this.vertex.position.set( this.props.pos.x, this.props.pos.y, this.props.pos.z );
  }

  check(name) {
    if (name === this.props.name) {
      return this.props.pos;
    }
    return false;
  }

  changeAbsPos(vect) {
    this.props.posAbs.x += vect.x;
    this.props.posAbs.y += vect.y;
    this.props.posAbs.z += vect.z;
  }

  changePos(vect) {
    this.props.pos.x += vect.x;
    this.props.pos.y += vect.y;
    this.props.pos.z += vect.z;

    this.props.posAbs.x += vect.x;
    this.props.posAbs.y += vect.y;
    this.props.posAbs.z += vect.z;
    this.vertex.position.set( this.props.pos.x, this.props.pos.y, this.props.pos.z );
  }

}
