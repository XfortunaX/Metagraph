import { SphereGeometry, Mesh, MeshBasicMaterial, DoubleSide, Vector3 } from 'three'
import PubSub from './pubSub'
import Vertex from './vertex'
import Edge from './edge'
import { KOEF_META, KOEF_G_IN_META } from '../../../constants/index'

export default class MetaVertex {
  constructor(props) {
    this.props = {
      name: props.name,
      vertexes: props.vertexes,
      edges: props.edges,
      pos: { x: 0, y: 0, z: 0 },
      posAbs: { x: props.posAbs.x, y: props.posAbs.y, z: props.posAbs.z },
      posMeta: props.posMeta,
      costAverage: 1,
      radius: 1,
      koef: props.koef,
      brothers: [],
      parent: []
    };
    this.props.parent.push(props.parent);
    this.vertexes = [];
    this.edges = [];

    this.pubSub = new PubSub();

    this.create();

    this.createVertexes();
    this.createEdges();

    // console.log(this.vertexes, this.edges);
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
  getEdges() {
    return this.props.edges;
  }
  getRadius() {
    return this.props.radius;
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
        // console.log(par);
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
      if (parent[i] !== this.props.name) {
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
            par.addBrother(parent[i]);
          }
          let vert = this.pubSub.publish('checkMetaVertex', parent[i]);
          vert.addBrother(this.props.name);
        }
      }
    }
  }

  check(name) {
    if (name === this.props.name) {
      return this.props.pos;
    }
    return false;
  }

  checkBrothers(vert) {
    for (let i = 0; i < this.props.brothers.length; i += 1) {
      if (vert.getName() === this.props.brothers[i].getName()) {
        return true;
      }
    }
    return false;
  }

  create() {
    if (this.props.edges.length > 0) {
      let sumCost = 0;
      for (let i = 0; i < this.props.edges.length; i += 1) {
        sumCost += this.props.edges[i].cost;
      }
      this.props.costAverage = sumCost / this.props.edges.length;
      if (this.props.costAverage === 0) {
        this.props.costAverage = 1;
      }
    }

    if (this.props.vertexes.length > 1) {
      this.props.radius = this.props.costAverage * Math.log(this.props.vertexes.length) * KOEF_META;
    } else {
      this.props.radius = this.props.costAverage * KOEF_META;
    }

    this.geometry = new SphereGeometry( this.props.radius, 20, 20 );
    let r = Math.round(255.0 * Math.random());
    let g = Math.round(255.0 * Math.random());
    let b = Math.round(255.0 * Math.random());

    this.material = new MeshBasicMaterial( { color: 'rgb(' + r + ',' + g + ',' + b + ')' } );
    this.material.transparent = true;
    this.material.opacity = 0.4;
    this.material.side = DoubleSide;
    this.material.depthWrite = false;
    this.metavertex = new Mesh( this.geometry, this.material );

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

    this.metavertex.position.set( this.props.pos.x, this.props.pos.y, this.props.pos.z );
  }

  createVertexes() {
    let vertexes = this.props.vertexes;
    for (let i = 0; i < vertexes.length; i += 1) {
      let vert = this.pubSub.publish('checkVertex', vertexes[i].name);
      // console.log(vert);
      if (this.pubSub.publish('checkVertex', vertexes[i].name) === false) {
        let vertex = new Vertex({
          name: vertexes[i].name,
          cost: vertexes[i].cost,
          posMeta: this.props.pos,
          posAbs: this.props.posAbs,
          num: i,
          parent: this.props.name
        });
        this.vertexes.push({
          nameMeta: this.props.name,
          vertex: vertex
        });
        this.metavertex.add(vertex.getMesh());
        this.pubSub.publish('addVertex', vertex);
      } else {
        vert.addParent(this.props.name);
        this.addBrothers(vert.getParent());
        this.vertexes.push({
          nameMeta: this.props.name,
          vertex: this.pubSub.publish('checkVertex', vertexes[i].name)
        });
      }
    }
  }

  createEdges() {
    let edges = this.props.edges;
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
      this.edges.push(edge);
      this.metavertex.add(edge.getMesh());
    }
  }

  checkVertex(name) {
    for (let i = 0; i < this.vertexes.length; i += 1) {
      let vertexPos = this.vertexes[i].vertex.check(name);
      if (vertexPos !== false) {
        return vertexPos;
      }
    }
  }

  checkEdge(v1, v2) {
    for (let i = 0; i < this.edges.length; i += 1) {
      if (this.edges[i].check(v1, v2) === true) {
        return this.edges[i];
      }
    }
    return false;
  }

  updatePos() {
    let strengthVert = [];
    for (let i = 0; i < this.vertexes.length; i += 1) {
      let strength = [];
      for (let j = 0; j < this.vertexes.length; j += 1) {
        strength.push(this.strengthInteraction(this.vertexes[i].vertex, this.vertexes[j].vertex));
      }
      strength.push(this.strengthMetaInteraction(this.vertexes[i].vertex));
      // this.strengthOut(this.vertexes[i].vertex);
      strengthVert.push(strength);
    }

    for (let i = 0; i < strengthVert.length; i += 1) {
      for (let j = 0; j < strengthVert[i].length; j += 1) {
        this.vertexes[i].vertex.changePos(strengthVert[i][j]);
      }
    }
    for (let j = 0; j < this.edges.length; j += 1) {
      let v1 = this.checkVertex(this.edges[j].getEdge().start.name);
      let v2 = this.checkVertex(this.edges[j].getEdge().end.name);
      this.edges[j].updateEdge(v1, v2);
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
        if (length > edge.getCost() * KOEF_G_IN_META) {
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
        if (length > edge.getCost() * KOEF_G_IN_META) {
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
      if (length < this.props.radius * 0.8) {

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
    let vect_res = {x: 0, y: 0, z: 0};
    let vect = new Vector3(-v.getPos().x, -v.getPos().y, -v.getPos().z);
    vect.normalize();
    vect_res.x = vect.x / KOEF_G_IN_META / 5;
    vect_res.y = vect.y / KOEF_G_IN_META / 5;
    vect_res.z = vect.z / KOEF_G_IN_META / 5;

    return vect_res;
  }

  strengthOut(v) {
    let vect_res = { x: 0, y: 0, z: 0 };

    let dx = v.getPosAbs().x - this.props.posAbs.x;
    let dy = v.getPosAbs().y - this.props.posAbs.y;
    let dz = v.getPosAbs().z - this.props.posAbs.z;

    let length = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2));

    let vect = new Vector3(dx, dy, dz);
    vect.normalize();

    if (length >= this.props.radius) {
      vect_res.x = vect.x * 4 / KOEF_G_IN_META;
      vect_res.y = vect.y * 4 / KOEF_G_IN_META;
      vect_res.z = vect.z * 4 / KOEF_G_IN_META;
    }

    this.changePos(vect_res);
  }

  changeAbsPos(vect) {
    this.props.posAbs.x += vect.x;
    this.props.posAbs.y += vect.y;
    this.props.posAbs.z += vect.z;

    for (let i = 0; i < this.vertexes.length; i += 1) {
      this.vertexes[i].vertex.changeAbsPos(vect);
    }
  }

  changePos(vect) {
    this.props.pos.x += vect.x;
    this.props.pos.y += vect.y;
    this.props.pos.z += vect.z;

    this.props.posAbs.x += vect.x;
    this.props.posAbs.y += vect.y;
    this.props.posAbs.z += vect.z;

    for (let i = 0; i < this.vertexes.length; i += 1) {
      this.vertexes[i].vertex.changeAbsPos(vect);
    }

    this.metavertex.position.set( this.props.pos.x, this.props.pos.y, this.props.pos.z );
  }

}
