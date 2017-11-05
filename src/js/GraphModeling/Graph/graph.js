// import Vertex from './vertex'
import MetaEdge from './metaedge'
import Edge from './edge'
import MetaVertex from './metavertex'
import MetaVertexes from './metavertexes'
import PubSub from './pubSub'
// import { Vector3 } from 'three'
// import { KOEF_G_IN_META } from '../../../constants/index'

export default class Graph {
  constructor(props) {
    this.props = props;
    this.metaVertexes = [];
    this.vertexes = [];
    this.edges = [];
    this.metaEdges = [];
    this.allVertexes = [];
    this.allMetaVertexes = [];

    this.pubSub = new PubSub();

    this.pubSub.subscribe('addVertex', this.addVertex, this);
    this.pubSub.subscribe('addMetaVertex', this.addMetaVertex, this);
    this.pubSub.subscribe('checkVertex', this.checkVertex, this);
    this.pubSub.subscribe('checkMetaVertex', this.checkMetaVertex, this);
    this.pubSub.subscribe('checkParent', this.checkParent, this);
    this.pubSub.subscribe('checkMetaParent', this.checkMetaParent, this);

    this.createGraph();
    // this.updatePos();
  }

  addVertex(vert) {
    this.allVertexes.push(vert);
  }
  addMetaVertex(metaVert) {
    this.allMetaVertexes.push(metaVert);
  }

  checkVertex(name) {
    for (let i = 0; i < this.allVertexes.length; i += 1) {
      if (name === this.allVertexes[i].getName()) {
        return this.allVertexes[i];
      }
    }
    return false;
  }
  checkMetaVertex(name) {
    for (let i = 0; i < this.allMetaVertexes.length; i += 1) {
      if (name === this.allMetaVertexes[i].getName()) {
        return this.allMetaVertexes[i];
      }
    }
    return false;
  }

  checkParent(name) {
    for (let i = 0; i < this.allVertexes.length; i += 1) {
      if (name === this.allVertexes[i].getParent()) {
        return this.allVertexes[i];
      }
    }
    return false;
  }
  checkMetaParent(name) {
    for (let i = 0; i < this.allMetaVertexes.length; i += 1) {
      if (name === this.allMetaVertexes[i].getParent()) {
        return this.allMetaVertexes[i];
      }
    }
    return false;
  }

  createGraph() {
    let koef = 80;
    for (let i = 0; i < this.props.structure.metaVertexes.length; i += 1) {
      let pos = { x: 0, y: 0, z: 0 };
      let mv = this.create(
        this.props.structure.metaVertexes[i],
        koef,
        pos,
        pos,
        this.props.structure.metaVertexes[i].name
      );
      this.pubSub.publish('add', mv.getMesh());
    }
    // console.log(this.edges, this.props.metaEdges);

    if ( 'edges' in this.props) {
      for (let i = 0; i < this.props.edges.length; i += 1) {
        let edge = new Edge({
          name: this.props.edges[i].name,
          edge: {
            start: {
              name: this.props.edges[i].edge.start,
              pos: this.checkVertexPos(this.props.edges[i].edge.start)
            },
            end: {
              name: this.props.edges[i].edge.end,
              pos: this.checkVertexPos(this.props.edges[i].edge.end)
            }
          },
          cost: this.props.edges[i].cost
        });
        this.edges.push(edge);
        this.pubSub.publish('add', edge.getMesh());
      }
    }
    // console.log(this.edges, this.props.metaEdges);

    if ( 'metaEdges' in this.props) {
      for (let i = 0; i < this.props.metaEdges.length; i += 1) {
        console.log('meta');
        let metaEdge = new MetaEdge({
          name: this.props.metaEdges[i].name,
          edge: {
            start: {
              name: this.props.metaEdges[i].edge.start,
              pos: this.checkMetaVertexPos(this.props.metaEdges[i].edge.start)
            },
            end: {
              name: this.props.metaEdges[i].edge.end,
              pos: this.checkMetaVertexPos(this.props.metaEdges[i].edge.end)
            }
          },
          cost: this.props.metaEdges[i].cost
        });
        this.metaEdges.push(metaEdge);
        this.pubSub.publish('add', metaEdge.getMesh());
      }
    }
    // console.log(this.allVertexes, this.edges);
    // console.log(this.edges, this.metaEdges);

    for (let i = 0; i < this.allMetaVertexes.length; i += 1) {
      console.log(this.allMetaVertexes[i].getName(), this.allMetaVertexes[i].getBrothers());
    }
  }

  checkVertexPos(name) {
    for (let i = 0; i < this.allVertexes.length; i += 1) {
      if (name === this.allVertexes[i].getName()) {
        return this.allVertexes[i].getPosAbs();
      }
    }
  }
  checkMetaVertexPos(name) {
    for (let i = 0; i < this.allMetaVertexes.length; i += 1) {
      if (name === this.allMetaVertexes[i].getName()) {
        return this.allMetaVertexes[i].getPosAbs();
      }
    }
    return this.checkVertexPos(name);
  }

  create(meta, koef, pos, posAbs, pName) {
    if ( 'metaVertexes' in meta ) {
      let metaVertexesMeta = new MetaVertexes({
        name: meta.name,
        posAbs: posAbs,
        koef: koef,
        parent: pName
      });
      this.pubSub.publish('addMetaVertex', metaVertexesMeta);
      let mv = [];
      let v = [];
      let e = [];
      for (let i = 0; i < meta.metaVertexes.length; i += 1) {
        if (this.pubSub.publish('checkMetaVertex', meta.metaVertexes[i].name) === false) {
          mv.push(this.create(
            meta.metaVertexes[i],
            koef / 2,
            metaVertexesMeta.getPos(),
            metaVertexesMeta.getPosAbs(),
            metaVertexesMeta.getName()
          ));
        }
      }
      if ( 'vertexes' in meta ) {
        v = this.checkMetaVertexesVert(meta);
        e = this.checkMetaVertexesEdge(v);
      }
      let me = this.checkMetaVertexesMetaEdge(mv, v);
      // console.log(me);
      metaVertexesMeta.create(mv, v, me, e);
      return metaVertexesMeta;
    } else {
      // console.log(meta);
      return this.createMetaVertex(meta, koef, pos, posAbs, pName);
    }
  }

  createMetaVertex(meta, koef, pos, posAbs, pName) {
    let vertexes = this.checkMetaVertexesVert(meta);
    let edges = this.checkMetaVertexesEdge(vertexes);
    let metaVertex = new MetaVertex({
      name: meta.name,
      vertexes: vertexes,
      edges: edges,
      posMeta: pos,
      posAbs: posAbs,
      koef: koef,
      parent: pName
    });
    this.pubSub.publish('addMetaVertex', metaVertex);
    this.metaVertexes.push(metaVertex);
    return metaVertex;
  }

  checkMetaVertexesVert(metaVert) {
    // console.log(metaVert);
    let vertexes = [];
    let vert = this.props.vertexes;
    for (let i = 0; i < metaVert.vertexes.length; i += 1) {
      for (let j = 0; j < vert.length; j += 1) {
        if (metaVert.vertexes[i] === vert[j].name) {
          vertexes.push(vert[j]);
        }
      }
    }
    return vertexes;
  }

  checkMetaVertexesEdge(vert) {
    let edgs = [];
    let edges = this.props.edges;
    for ( let i = 0; i < edges.length; i += 1) {
      let push = { start: false, end: false };
      for (let j = 0; j < vert.length; j += 1) {
        if (edges[i].edge.start === vert[j].name) {
          push.start = true;
        }
        if (edges[i].edge.end === vert[j].name) {
          push.end = true;
        }
      }
      if (push.start === true && push.end === true) {
        edgs.push(edges[i]);
        edges.splice(i, 1);
        i -= 1;
      }
    }
    return edgs;
  }

  checkMetaVertexesMetaEdge(metaVert, vert) {
    let edgs = [];
    if ( 'metaEdges' in this.props) {
      let edges = this.props.metaEdges;
      for (let i = 0; i < edges.length; i += 1) {
        let push = {start: false, end: false, meta: false};
        for (let j = 0; j < metaVert.length; j += 1) {
          if (edges[i].edge.start === metaVert[j].getName()) {
            push.start = true;
            push.meta = true;
          }
          if (edges[i].edge.end === metaVert[j].getName()) {
            push.end = true;
            push.meta = true;
          }
          for (let k = 0; k < vert.length; k += 1) {
            if (edges[i].edge.start === vert[k].name) {
              push.start = true;
            }
            if (edges[i].edge.end === vert[k].name) {
              push.end = true;
            }
          }
        }
        if (push.start === true && push.end === true && push.meta === true) {
          edgs.push(edges[i]);
          edges.splice(i, 1);
          i -= 1;
        }
      }
    }
    return edgs;
  }

  updatePos() {
    // console.log(this.allMetaVertexes);
    for (let i = 0; i < this.allMetaVertexes.length; i += 1) {
      this.allMetaVertexes[i].updatePos();
    }

    for (let i = 0; i < this.metaEdges.length; i += 1) {
      let v1 = this.checkMetaVertexPos(this.metaEdges[i].getEdge().start.name);
      let v2 = this.checkMetaVertexPos(this.metaEdges[i].getEdge().end.name);
      this.metaEdges[i].updateEdge(v1, v2);
    }

    for (let i = 0; i < this.edges.length; i += 1) {
      let v1 = this.checkVertexPos(this.edges[i].getEdge().start.name);
      let v2 = this.checkVertexPos(this.edges[i].getEdge().end.name);
      this.edges[i].updateEdge(v1, v2);
    }
  }

  // createMetaVertexes() {
  //   for (let i = 0; i < this.props.metaVertexes.length; i += 1) {
  //     let vertexes = this.checkMetaVertexesVert(this.props.metaVertexes[i]);
  //     let edges = this.checkMetaVertexesEdge(vertexes);
  //
  //     let metaVertex = new MetaVertex({
  //       name: this.props.metaVertexes[i].name,
  //       vertexes: vertexes,
  //       edges: edges,
  //       posMeta: { x: 0, y: 0, z: 0}
  //     });
  //     this.metaVertexes.push(metaVertex);
  //   }
  // }
  //
  // createVertexesMeta(meta) {
  //   let vert = meta.getVertexes();
  //   for (let i = 0; i < vert.length; i += 1) {
  //     let vertex = new Vertex({
  //       name: vert[i].name,
  //       cost: vert[i].cost,
  //       posMeta: meta.getPos(),
  //       num: i
  //     });
  //     this.vertexes.push({
  //       nameMeta: meta.getName(),
  //       vertex: vertex
  //     });
  //   }
  // }
  //
  // createEdgesMeta(meta) {
  //   let edges = meta.getEdges();
  //   for (let i = 0; i < edges.length; i += 1) {
  //     let edge = new Edge({
  //       name: edges[i].name,
  //       edge: {
  //         start: {
  //           name: edges[i].edge.start,
  //           pos: this.checkVertex(edges[i].edge.start)
  //         },
  //         end: {
  //           name: edges[i].edge.end,
  //           pos: this.checkVertex(edges[i].edge.end)
  //         }
  //       },
  //       cost: edges[i].cost
  //     });
  //     this.edges.push(edge);
  //   }
  // }
  //
  // checkVertex(name) {
  //   for (let i = 0; i < this.vertexes.length; i += 1) {
  //     let vertexPos = this.vertexes[i].vertex.check(name);
  //     if (vertexPos !== false) {
  //       return vertexPos;
  //     }
  //   }
  // }
  //
  // checkEdge(v1, v2) {
  //   for (let i = 0; i < this.edges.length; i += 1) {
  //     if (this.edges[i].check(v1, v2) === true) {
  //       return this.edges[i];
  //     }
  //   }
  //   return false;
  // }
  //
  // updatePos() {
  //   // for (let i = 0; i < this.metaVertexes.length; i += 1) {
  //   //   let metaVert = [];
  //   //   // let edge = [];
  //   //   for (let j = 0; j < this.vertexes.length; j += 1) {
  //   //     if ( this.vertexes[j].nameMeta === this.metaVertexes[i].getName() ) {
  //   //       metaVert.push(this.vertexes[j].vertex);
  //   //     }
  //   //   }
  //   //   // for (let j = 0; j < this.edges.length; j += 1) {
  //   //   //   if ( this.edges[j].nameMeta === this.metaVertexes[i].getName() ) {
  //   //   //     metaVert.push(this.vertexes[j].vertex);
  //   //   //   }
  //   //   // }
  //   //   this.strengthDetection(this.metaVertexes[i], metaVert);
  //   // }
  // }
  //
  // strengthDetection (meta, vert) {
  //   let strengthVert = [];
  //   for (let i = 0; i < vert.length; i += 1) {
  //     let strength = [];
  //     strength.push(this.strengthMetaInteraction(meta, vert[i]));
  //     for (let j = 0; j < vert.length; j += 1) {
  //       if (i !== j) {
  //         strength.push(this.strengthInteraction(meta, vert[i], vert[j]));
  //       }
  //     }
  //     // this.strengthMetaOtherInteraction(strength, vert[i]);
  //     strengthVert.push(strength);
  //   }
  //   // console.log(strengthVert);
  //   for (let j = 0; j < strengthVert.length; j += 1) {
  //     for (let i = 0; i < strengthVert[j].length; i += 1) {
  //       vert[j].changePos(strengthVert[j][i]);
  //     }
  //   }
  //   for (let j = 0; j < this.edges.length; j += 1) {
  //     let v1 = this.checkVertex(this.edges[j].getEdge().start.name);
  //     let v2 = this.checkVertex(this.edges[j].getEdge().end.name);
  //     this.edges[j].updateEdge(v1, v2);
  //   }
  // }
  //
  // strengthInteraction(meta, v1, v2) {
  //   let vect_res = { x: 0, y: 0, z: 0 };
  //
  //   let dx = v1.getPos().x - v2.getPos().x;
  //   let dy = v1.getPos().y - v2.getPos().y;
  //   let dz = v1.getPos().z - v2.getPos().z;
  //
  //   let length = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2));
  //
  //   let vect = new Vector3(dx, dy, dz);
  //   vect.normalize();
  //
  //   let edge = this.checkEdge(v1.getName(), v2.getName());
  //
  //   if (edge !== false) {
  //     if (edge.getCost() <= meta.getCostAverage()) {
  //       if (length > edge.getCost() * KOEF_G_IN_META) {
  //         vect_res.x = -vect.x / KOEF_G_IN_META;
  //         vect_res.y = -vect.y / KOEF_G_IN_META;
  //         vect_res.z = -vect.z / KOEF_G_IN_META;
  //       }
  //       else {
  //         vect_res.x = vect.x / KOEF_G_IN_META;
  //         vect_res.y = vect.y / KOEF_G_IN_META;
  //         vect_res.z = vect.z / KOEF_G_IN_META;
  //       }
  //     }
  //     if (edge.getCost() > meta.getCostAverage()) {
  //       if (length > edge.getCost() * KOEF_G_IN_META) {
  //         vect_res.x = -vect.x / KOEF_G_IN_META;
  //         vect_res.y = -vect.y / KOEF_G_IN_META;
  //         vect_res.z = -vect.z / KOEF_G_IN_META;
  //       }
  //       else {
  //         vect_res.x = vect.x / KOEF_G_IN_META;
  //         vect_res.y = vect.y / KOEF_G_IN_META;
  //         vect_res.z = vect.z / KOEF_G_IN_META;
  //       }
  //     }
  //   } else {
  //     if (length < meta.getCostAverage() * KOEF_G_IN_META) {
  //       vect_res.x = vect.x / KOEF_G_IN_META / 3;
  //       vect_res.y = vect.y / KOEF_G_IN_META / 3;
  //       vect_res.z = vect.z / KOEF_G_IN_META / 3;
  //     }
  //   }
  //   return vect_res;
  // }
  //
  // strengthMetaInteraction(meta, v) {
  //   let vect_res = { x: 0, y: 0, z: 0 };
  //
  //   let dx = meta.getPos().x - v.getPos().x;
  //   let dy = meta.getPos().y - v.getPos().y;
  //   let dz = meta.getPos().z - v.getPos().z;
  //
  //   let vect = new Vector3(dx, dy, dz);
  //   vect.normalize();
  //
  //   vect_res.x = vect.x / KOEF_G_IN_META / 5;
  //   vect_res.y = vect.y / KOEF_G_IN_META / 5;
  //   vect_res.z = vect.z / KOEF_G_IN_META / 5;
  //
  //   return vect_res;
  // }

  // strengthMetaOtherInteraction(strength, v) {
  //   for (let i = 0; i < this.edges.length; i += 1) {
  //     let edge = this.edges[i].checkOut(v);
  //   }
  // }

  // createVertexes() {
  //   for (let i = 0; i < this.props.vertexes.length; i += 1) {
  //
  //     let pos_x = Math.floor(Math.random() * 25 + 5);
  //     let pos_y = Math.floor(Math.random() * 25 + 5);
  //     let pos_z = Math.floor(Math.random() * 25 + 5);
  //
  //     let vertex = new Vertex({
  //       name: this.props.vertexes[i],
  //       size: { r: 0.4 },
  //       pos: { x: pos_x, y: pos_y, z: pos_z }
  //     });
  //     this.vertexes.push(vertex);
  //   }
  // }
  //
  // createEdges() {
  //   let sumCostEdges = 0;
  //   for (let i = 0; i < this.props.edges.length; i += 1) {
  //
  //     let edge = new Edges({
  //       name: this.props.edges[i].name,
  //       edge: {
  //         start: {
  //           name: this.props.edges[i].edge[0],
  //           pos: this.checkVertex(this.props.edges[i].edge[0])
  //         },
  //         end: {
  //           name: this.props.edges[i].edge[1],
  //           pos: this.checkVertex(this.props.edges[i].edge[1])
  //         }
  //       },
  //       cost: this.props.edges[i].cost
  //     });
  //
  //     sumCostEdges += this.props.edges[i].cost;
  //
  //     this.edges.push(edge);
  //   }
  //
  //   this.costAverage = Math.floor(this.costAverage * (sumCostEdges / this.props.edges.length));
  // }
  //
  // checkVertex(name) {
  //   for (let i = 0; i < this.vertexes.length; i += 1) {
  //     let vertexPos = this.vertexes[i].check(name);
  //     if (vertexPos !== false) {
  //       return vertexPos;
  //     }
  //   }
  // }
  //
  // checkEdge(v1, v2) {
  //   for (let i = 0; i < this.edges.length; i += 1) {
  //     if (this.edges[i].check(v1, v2) === true) {
  //       return this.edges[i];
  //     }
  //   }
  //   return false;
  // }
  //
  // getCostAverage() {
  //   return this.costAverage;
  // }
  //
  // getVertexes() {
  //   return this.vertexes;
  // }
  //
  // getEdges() {
  //   return this.edges;
  // }
}
