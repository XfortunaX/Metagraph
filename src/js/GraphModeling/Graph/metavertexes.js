import { SphereGeometry, Mesh, MeshBasicMaterial, DoubleSide, Vector3, PointLight } from 'three'
import PubSub from './pubSub'
import Vertex from './vertex'
import MetaEdge from './metaedge'
import Edge from './edge'
import { KOEF_G_IN_META } from '../../../constants/index'

export default class MetaVertexes {
  constructor(props) {
    this.props = {
      name: props.name,
      metaVertexes: [],
      metaEdges: [],
      vertexes: [],
      edges: [],
      pos: { x: 0, y: 0, z: 0 },
      posMeta: props.posMeta,
      posAbs: { x: props.posAbs.x, y: props.posAbs.y, z: props.posAbs.z },
      costAverage: 1,
      koef: props.koef,
      radius: 1,
      brothers: [],
      parent: []
    };
    if (this.props.name !== props.parent) {
      this.props.parent.push(props.parent);
    }

    this.createBase();

    this.pubSub = new PubSub();
  }

  getName() {
    return this.props.name;
  }
  getCostAverage() {
    return this.props.costAverage;
  }
  getPos() {
    return this.props.pos;
  }
  getVertexes() {
    return this.props.vertexes;
  }
  getMetaVertexes() {
    return this.props.metaVertexes;
  }
  getEdges() {
    return this.props.edges;
  }
  getMesh() {
    return this.metavertex;
  }
  getPosAbs() {
    return this.props.posAbs;
  }
  getParent() {
    return this.props.parent;
  }
  getBrothers() {
    return this.props.brothers;
  }

  addParent(parent) {
    this.props.parent.push(parent);
  }

  addBrother(name) {
    let add = true;
    for (let i = 0; i < this.props.brothers.length; i += 1) {
      if (name === this.props.brothers[i]) {
        add = false;
      }
    }
    if (add === true) {
      this.props.brothers.push(name);
      for (let j = 0; j < this.props.parent.length; j += 1) {
        let par = this.pubSub.publish('checkMetaVertex', this.props.parent[j]);
        par.addBrother(name);
      }
    }
  }

  addBr(name) {
    let add = true;
    for (let i = 0; i < this.props.brothers.length; i += 1) {
      if (name === this.props.brothers[i]) {
        add = false;
      }
    }
    if (add === true) {
      this.props.brothers.push(name);
    }
  }

  addBrothers(parent) {
    for (let i = 0; i < parent.length; i += 1) {
      let add = true;
      for (let j = 0; j < this.props.brothers.length; j += 1) {
        if (parent[i] === this.props.brothers[j]) {
          add = false;
        }
      }
      if (add === true) {
        this.props.brothers.push(parent[i]);
        for (let j = 0; j < this.props.parent.length; j += 1) {
          let par = this.pubSub.publish('checkMetaVertex', this.props.parent[j]);
          // console.log(par);
          par.addBrothers(parent);
        }
        let vert = this.pubSub.publish('checkMetaVertex', parent[i]);
        vert.addBrother(this.props.name);
      }
    }
  }

  checkBrothers(vert) {
    for (let i = 0; i < this.props.brothers.length; i += 1) {
      if (vert.getName() === this.props.brothers[i].getName()) {
        return true;
      }
    }
    return false;
  }

  check(name) {
    if (name === this.props.name) {
      return this.props.pos;
    }
    return false;
  }

  createBase() {
    let vect = new Vector3(
      Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5
    );
    vect.normalize();
    vect.x *= this.props.koef;
    vect.y *= this.props.koef;
    vect.z *= this.props.koef;
    this.props.pos.x = vect.x;
    this.props.pos.y = vect.y;
    this.props.pos.z = vect.z;

    this.props.posAbs.x += this.props.pos.x;
    this.props.posAbs.y += this.props.pos.y;
    this.props.posAbs.z += this.props.pos.z;
  }

  create(metaVertexes, vertexes, metaEdges, edges) {
    this.props.radius = this.props.koef;
    this.geometry = new SphereGeometry( this.props.radius, 20, 20 );

    let r = Math.round(255.0 * Math.random());
    let g = Math.round(255.0 * Math.random());
    let b = Math.round(255.0 * Math.random());

    this.material = new MeshBasicMaterial( { color: 'rgb(' + r + ',' + g + ',' + b + ')' } );
    this.material.transparent = true;
    this.material.opacity = 0.2;
    this.material.side = DoubleSide;
    this.material.depthWrite = false;
    this.metavertex = new Mesh( this.geometry, this.material );

    this.metavertex.position.set( this.props.pos.x, this.props.pos.y, this.props.pos.z );

    this.light = new PointLight(0xffffff);
    this.light.position.set(this.props.pos.x, this.props.pos.y, this.props.pos.z);
    this.metavertex.add(this.light);

    for (let i = 0; i < metaVertexes.length; i += 1) {
      this.props.metaVertexes.push(metaVertexes[i]);
      this.metavertex.add(metaVertexes[i].getMesh());
    }

    for (let i = 0; i < vertexes.length; i += 1) {
      if (this.pubSub.publish('checkVertex', vertexes[i].name) === false) {
        let vertex = new Vertex({
          name: vertexes[i].name,
          cost: vertexes[i].cost,
          posMeta: this.props.pos,
          posAbs: this.props.posAbs,
          num: i,
          parent: this.props.name
        });
        this.props.vertexes.push(vertex);
        this.metavertex.add(vertex.getMesh());
        this.pubSub.publish('addVertex', vertex);
      }
    }

    for (let i = 0; i < metaEdges.length; i += 1) {
      let edge = new MetaEdge({
        name: metaEdges[i].name,
        edge: {
          start: {
            name: metaEdges[i].edge.start,
            pos: this.checkVertex(metaEdges[i].edge.start)
          },
          end: {
            name: metaEdges[i].edge.end,
            pos: this.checkVertex(metaEdges[i].edge.end)
          }
        },
        cost: metaEdges[i].cost
      });
      this.props.metaEdges.push(edge);
      this.metavertex.add(edge.getMesh());
    }

    for (let i = 0; i < edges.length; i += 1) {
      let edge = new Edge({
        name: edges[i].name,
        edge: {
          start: {
            name: edges[i].edge.start,
            pos: this.checkVertex(edges[i].edge.start)
          },
          end: {
            name: edges[i].edge.end,
            pos: this.checkVertex(edges[i].edge.end)
          }
        },
        cost: edges[i].cost
      });
      this.props.edges.push(edge);
      this.metavertex.add(edge.getMesh());
    }
  }

  checkVertex(name) {
    for (let i = 0; i < this.props.metaVertexes.length; i += 1) {
      let vertexPos = this.props.metaVertexes[i].check(name);
      if (vertexPos !== false) {
        return vertexPos;
      }
    }
    for (let i = 0; i < this.props.vertexes.length; i += 1) {
      let vertexPos = this.props.vertexes[i].check(name);
      if (vertexPos !== false) {
        return vertexPos;
      }
    }
  }

  checkEdge(v1, v2) {
    for (let i = 0; i < this.props.metaEdges.length; i += 1) {
      if (this.props.metaEdges[i].check(v1, v2) === true) {
        return this.props.metaEdges[i];
      }
    }
    return false;
  }

  updatePos() {
    let strengthVert = [];
    for (let i = 0; i < this.props.metaVertexes.length; i += 1) {
      let strength = [];
      for (let j = 0; j < this.props.metaVertexes.length; j += 1) {
        strength.push(this.strengthInteraction(this.props.metaVertexes[i], this.props.metaVertexes[j]));
      }
      for (let j = 0; j < this.props.vertexes.length; j += 1) {
        strength.push(this.strengthInteraction(this.props.metaVertexes[i], this.props.vertexes[j]));
      }
      strength.push(this.strengthMetaInteraction(this.props.metaVertexes[i]));
      strengthVert.push(strength);
    }
    for (let i = 0; i < strengthVert.length; i += 1) {
      for (let j = 0; j < strengthVert[i].length; j += 1) {
        this.props.metaVertexes[i].changePos(strengthVert[i][j]);
      }
    }

    strengthVert = [];
    for (let i = 0; i < this.props.vertexes.length; i += 1) {
      let strength = [];
      for (let j = 0; j < this.props.metaVertexes.length; j += 1) {
        strength.push(this.strengthInteraction(this.props.vertexes[i], this.props.metaVertexes[j]));
      }
      for (let j = 0; j < this.props.vertexes.length; j += 1) {
        strength.push(this.strengthInteraction(this.props.vertexes[i], this.props.vertexes[j]));
      }
      strength.push(this.strengthMetaInteraction(this.props.vertexes[i]));
      strengthVert.push(strength);
    }
    for (let i = 0; i < strengthVert.length; i += 1) {
      for (let j = 0; j < strengthVert[i].length; j += 1) {
        this.props.vertexes[i].changePos(strengthVert[i][j]);
      }
    }


    for (let i = 0; i < this.props.metaEdges.length; i += 1) {
      let v1 = this.checkVertex(this.props.metaEdges[i].getEdge().start.name);
      let v2 = this.checkVertex(this.props.metaEdges[i].getEdge().end.name);
      this.props.metaEdges[i].updateEdge(v1, v2);
    }

    for (let i = 0; i < this.props.edges.length; i += 1) {
      let v1 = this.checkVertex(this.props.edges[i].getEdge().start.name);
      let v2 = this.checkVertex(this.props.edges[i].getEdge().end.name);
      this.props.edges[i].updateEdge(v1, v2);
    }
  }

  strengthInteraction(v1, v2) {
    let vect_res = { x: 0, y: 0, z: 0 };

    let dx = v1.getPos().x - v2.getPos().x;
    let dy = v1.getPos().y - v2.getPos().y;
    let dz = v1.getPos().z - v2.getPos().z;

    let length = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2));

    let vect = new Vector3(dx, dy, dz);
    vect.normalize();

    let edge = this.checkEdge(v1.getName(), v2.getName());

    if (edge !== false) {
      if (edge.getCost() <= this.props.costAverage) {
        if (length > this.props.radius * 0.8) {
          vect_res.x = -vect.x / KOEF_G_IN_META;
          vect_res.y = -vect.y / KOEF_G_IN_META;
          vect_res.z = -vect.z / KOEF_G_IN_META;
        }
        else {
          vect_res.x = vect.x / KOEF_G_IN_META;
          vect_res.y = vect.y / KOEF_G_IN_META;
          vect_res.z = vect.z / KOEF_G_IN_META;
        }
      }
      if (edge.getCost() > this.props.costAverage) {
        if (length > this.props.radius * 0.8) {
          vect_res.x = -vect.x / KOEF_G_IN_META;
          vect_res.y = -vect.y / KOEF_G_IN_META;
          vect_res.z = -vect.z / KOEF_G_IN_META;
        }
        else {
          vect_res.x = vect.x / KOEF_G_IN_META;
          vect_res.y = vect.y / KOEF_G_IN_META;
          vect_res.z = vect.z / KOEF_G_IN_META;
        }
      }
    } else {
      if (length < this.props.radius * 0.9) {

        length = Math.sqrt(Math.pow(v1.getPos().x, 2) + Math.pow(v1.getPos().y, 2) + Math.pow(v1.getPos().z, 2));

        if (length < this.props.radius * 0.5) {
          vect_res.x = vect.x / KOEF_G_IN_META / 3;
          vect_res.y = vect.y / KOEF_G_IN_META / 3;
          vect_res.z = vect.z / KOEF_G_IN_META / 3;
        }
      }
    }
    return vect_res;
  }

  strengthMetaInteraction(v) {
    let vect_res = { x: 0, y: 0, z: 0 };

    let vect = new Vector3(-v.getPos().x, -v.getPos().y, -v.getPos().z);
    vect.normalize();
    vect_res.x = vect.x / KOEF_G_IN_META / 5;
    vect_res.y = vect.y / KOEF_G_IN_META / 5;
    vect_res.z = vect.z / KOEF_G_IN_META / 5;

    return vect_res;
  }

  changeAbsPos(vect) {
    // console.log(vect);
    this.props.posAbs.x += vect.x;
    this.props.posAbs.y += vect.y;
    this.props.posAbs.z += vect.z;

    for (let i = 0; i < this.props.vertexes.length; i += 1) {
      this.props.vertexes[i].changeAbsPos(vect);
    }

    for (let i = 0; i < this.props.metaVertexes.length; i += 1) {
      this.props.metaVertexes[i].changeAbsPos(vect);
    }
  }

  changePos(vect) {
    this.props.pos.x += vect.x;
    this.props.pos.y += vect.y;
    this.props.pos.z += vect.z;

    this.props.posAbs.x += vect.x;
    this.props.posAbs.y += vect.y;
    this.props.posAbs.z += vect.z;

    for (let i = 0; i < this.props.vertexes.length; i += 1) {
      this.props.vertexes[i].changeAbsPos(vect);
    }

    for (let i = 0; i < this.props.metaVertexes.length; i += 1) {
      this.props.metaVertexes[i].changeAbsPos(vect);
    }

    this.metavertex.position.set( this.props.pos.x, this.props.pos.y, this.props.pos.z );
  }

}
