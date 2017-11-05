import Camera from './camera'
import SceneModeling from './scene'
import Graph from './graph'
import Light from './light'
import SkyBox from './skybox'
// import { Vector3 } from 'three'
 // import PubSub from 'pubSub'

export default class GraphModeling {
  constructor(props) {
    this.props = props;

    // this.graphStructure = {
    //   vertexes: [
    //     { name: 'x1', cost: 1 },
    //     { name: 'x2', cost: 1 },
    //     { name: 'x3', cost: 1 },
    //     { name: 'x4', cost: 1 },
    //     { name: 'x5', cost: 1 },
    //     { name: 'x6', cost: 1 },
    //     { name: 'x7', cost: 1 },
    //     { name: 'x8', cost: 1 },
    //     { name: 'x9', cost: 1 },
    //     { name: 'x10', cost: 1 },
    //     { name: 'x11', cost: 1 }
    //   ],
    //   edges: [
    //     // { name: 'e1', edge: { start: 'x1', end: 'x2' }, cost: 1 },
    //     // { name: 'e2', edge: { start: 'x2', end: 'x3' }, cost: 2 },
    //     // { name: 'e3', edge: { start: 'x4', end: 'x5' }, cost: 1 }
    //   ],
    //   metaEdges: [
    //     // { name: 'ME1', edge: { start: 'MX2', end: 'MX3' }, cost: 1 }
    //   ],
    //   structure: {
    //     metaVertexes: [
    //       {
    //         name: 'MX1',
    //         metaVertexes: [
    //           {
    //             name: 'MX2',
    //             metaVertexes: [
    //               {
    //                 name: 'MX4',
    //                 vertexes: ['x1', 'x2', 'x3', 'x7']
    //               }
    //             ]
    //           },
    //           {
    //             name: 'MX3',
    //             vertexes: ['x3', 'x4', 'x5', 'x7']
    //           }
    //         ]
    //       }
    //     ]
    //   }
    // };

    this.graphStructure = {
      vertexes: [
        { name: 'x1', cost: 1 },
        { name: 'x2', cost: 1 },
        { name: 'x3', cost: 1 },
        { name: 'x4', cost: 1 },
        { name: 'x5', cost: 1 }
      ],
      edges: [
        // { name: 'e1', edge: { start: 'x1', end: 'x2' }, cost: 1 },
        // { name: 'e2', edge: { start: 'x2', end: 'x3' }, cost: 2 },
        // { name: 'e3', edge: { start: 'x4', end: 'x5' }, cost: 1 }
      ],
        metaEdges: [
          // { name: 'ME1', edge: { start: 'MX2', end: 'MX3' }, cost: 1 }
        ],
      structure: {
        metaVertexes: [
          {
            name: 'MX1',
            metaVertexes: [
              {
                name: 'MX2',
                vertexes: ['x1', 'x2', 'x3']
              },
              {
                name: 'MX3',
                vertexes: ['x3', 'x4', 'x5']
              }
            ]
          }
        ]
      }
    };

    // this.graphStructure = {
    //   vertexes: [
    //     { name: 'x1', cost: 1 },
    //     { name: 'x2', cost: 1 },
    //     { name: 'x3', cost: 1 },
    //     { name: 'x4', cost: 1 },
    //     { name: 'x5', cost: 1 },
    //     { name: 'x6', cost: 1 },
    //     { name: 'x7', cost: 1 },
    //     { name: 'x8', cost: 1 },
    //     { name: 'x9', cost: 1 },
    //     { name: 'x10', cost: 1 },
    //     { name: 'x11', cost: 1 },
    //     { name: 'x12', cost: 1 },
    //     { name: 'x13', cost: 1 },
    //     { name: 'x14', cost: 1 },
    //     { name: 'x15', cost: 1 },
    //     { name: 'x16', cost: 1 },
    //     { name: 'x17', cost: 1 },
    //     { name: 'x18', cost: 1 },
    //     { name: 'x19', cost: 1 }
    //   ],
    //   edges: [
    //     { name: 'e1', edge: { start: 'x1', end: 'x2' }, cost: 1 },
    //     { name: 'e2', edge: { start: 'x2', end: 'x3' }, cost: 2 },
    //     { name: 'e3', edge: { start: 'x3', end: 'x4' }, cost: 1 },
    //     { name: 'e4', edge: { start: 'x4', end: 'x5' }, cost: 1 },
    //     { name: 'e5', edge: { start: 'x6', end: 'x7' }, cost: 1 },
    //     { name: 'e6', edge: { start: 'x6', end: 'x8' }, cost: 1 },
    //     { name: 'e7', edge: { start: 'x9', end: 'x10' }, cost: 1 },
    //     { name: 'e8', edge: { start: 'x9', end: 'x11' }, cost: 1 },
    //     { name: 'e9', edge: { start: 'x9', end: 'x12' }, cost: 1 },
    //     { name: 'e10', edge: { start: 'x13', end: 'x14' }, cost: 1 },
    //     { name: 'e11', edge: { start: 'x14', end: 'x15' }, cost: 1 },
    //     { name: 'e12', edge: { start: 'x15', end: 'x16' }, cost: 1 },
    //     { name: 'e13', edge: { start: 'x11', end: 'x15' }, cost: 1 },
    //     { name: 'e14', edge: { start: 'x2', end: 'x8' }, cost: 1 }
    //   ],
    //     metaEdges: [
    //       { name: 'ME1', edge: { start: 'MX3', end: 'MX4' }, cost: 1 },
    //       { name: 'ME2', edge: { start: 'MX1', end: 'MX3' }, cost: 1 }
    //     ],
    //   structure: {
    //     metaVertexes: [
    //       {
    //         name: 'MMX1',
    //         metaVertexes: [
    //           {
    //             name: 'MX1',
    //             vertexes: ['x1', 'x2', 'x3', 'x4', 'x5']
    //           },
    //           {
    //             name: 'MX2',
    //             metaVertexes: [
    //               {
    //                 name: 'MX3',
    //                 vertexes: ['x6', 'x7', 'x8']
    //               },
    //               {
    //                 name: 'MX4',
    //                 vertexes: ['x17', 'x18', 'x19', 'x6']
    //               },
    //               {
    //                 name: 'MX5',
    //                 vertexes: ['x9', 'x10', 'x11', 'x12']
    //               }
    //             ],
    //             vertexes: ['x13', 'x14', 'x15', 'x16']
    //           }
    //         ]
    //       }
    //     ]
    //   }
    // };

    // this.graphStructure = {
    //   vertexes: [
    //     { name: 'x1', cost: 1 },
    //     { name: 'x2', cost: 1 },
    //     { name: 'x3', cost: 1 },
    //     { name: 'x4', cost: 1 },
    //     { name: 'x5', cost: 1 },
    //     { name: 'x6', cost: 1 },
    //     { name: 'x7', cost: 1 }
    //   ],
    //   edges: [
    //     { name: 'e1', edge: { start: 'x5', end: 'x7' }, cost: 1 }
    //   ],
    //   metaEdges: [
    //     { name: 'ME1', edge: { start: 'MX1', end: 'x4' }, cost: 1 },
    //     { name: 'ME2', edge: { start: 'MX2', end: 'x5' }, cost: 1 },
    //     { name: 'ME3', edge: { start: 'MX3', end: 'MX4' }, cost: 1 }
    //   ],
    //   structure: {
    //     metaVertexes: [
    //       {
    //         name: 'MX1',
    //         vertexes: ['x1', 'x2']
    //       },
    //       {
    //         name: 'MX2',
    //         vertexes: ['x2', 'x3']
    //       },
    //       {
    //         name: 'MX3',
    //         vertexes: ['x4', 'x5']
    //       },
    //       {
    //         name: 'MX4',
    //         vertexes: ['x6', 'x7']
    //       }
    //     ]
    //   }
    // };

    // this.graphStructure = {
    //   vertexes: [
    //     { name: 'x1', cost: 1 },
    //     { name: 'x2', cost: 1 },
    //     { name: 'x3', cost: 1 },
    //     { name: 'x4', cost: 1 },
    //     { name: 'x5', cost: 1 },
    //     { name: 'x6', cost: 1 },
    //     { name: 'x7', cost: 1 },
    //     { name: 'x8', cost: 1 },
    //     { name: 'x9', cost: 1 },
    //     { name: 'x10', cost: 1}
    //   ],
    //   edges: [
    //     { name: 'e1', edge: { start: 'x1', end: 'x2' }, cost: 1 },
    //     { name: 'e2', edge: { start: 'x2', end: 'x3' }, cost: 1 },
    //     { name: 'e3', edge: { start: 'x4', end: 'x5' }, cost: 1 },
    //     { name: 'e4', edge: { start: 'x5', end: 'x7' }, cost: 1 }
    //   ],
    //   metaEdges: [
    //     { name: 'ME1', edge: { start: 'MX3', end: 'MX4' }, cost: 1 },
    //     { name: 'ME2', edge: { start: 'MX3', end: 'x9' }, cost: 1 },
    //     { name: 'ME3', edge: { start: 'x8', end: 'MX4' }, cost: 1 },
    //     { name: 'ME4', edge: { start: 'MX1', end: 'MX4' }, cost: 1 }
    //   ],
    //   structure: {
    //     metaVertexes: [
    //       {
    //         name: 'MX1',
    //         vertexes: ['x1', 'x2', 'x3']
    //       },
    //       {
    //         name: 'MX2',
    //         metaVertexes: [
    //           {
    //             name: 'MX3',
    //             vertexes: ['x4', 'x5']
    //           },
    //           {
    //             name: 'MX4',
    //             vertexes: ['x6', 'x7']
    //           }
    //         ],
    //         vertexes: ['x8', 'x9', 'x10']
    //       }
    //     ]
    //   }
    // };

    this.scene = new SceneModeling('props');
    this.camera = new Camera('props');
    this.light = new Light('props');
    this.skyBox = new SkyBox('props');

    this.graph = new Graph(this.graphStructure);
  }

  getScene() {
    return this.scene.getScene();
  }

  getCamera() {
    return this.camera.getCamera();
  }

  posUpdate() {
    this.graph.updatePos();
  }

  // posUpdate2() {
  //   this.graph.updatePos();
  // }
  //
  // posUpdate() {
  //   let vertexes = this.graph.getVertexes();
  //   let edges = this.graph.getEdges();
  //   let strengthVert = [];
  //   let strength = [];
  //   for (let j = 0; j < vertexes.length; j += 1) {
  //     strength = [];
  //     for (let i = 0; i < vertexes.length; i += 1) {
  //       if (i !== j) {
  //         // strength.push(this.strengthDetection(vertexes[j], vertexes[i]));
  //         strength.push(this.strengthInteraction(vertexes[j], vertexes[i]));
  //       }
  //     }
  //     strengthVert.push(strength);
  //   }
  //   for (let j = 0; j < strengthVert.length; j += 1) {
  //     for (let i = 0; i < strength.length; i += 1) {
  //       vertexes[j].changePos(strengthVert[j][i]);
  //     }
  //   }
  //   for (let j = 0; j < edges.length; j += 1) {
  //     let v1 = this.graph.checkVertex(edges[j].getEdge().start.name);
  //     let v2 = this.graph.checkVertex(edges[j].getEdge().end.name);
  //     edges[j].updateEdge(v1, v2);
  //   }
  // }
  //
  // strengthDetection(v1, v2) {
  //   let dx = v1.pos.x - v2.pos.x;
  //   let dy = v1.pos.y - v2.pos.y;
  //   let dz = v1.pos.z - v2.pos.z;
  //
  //   let cost = this.graph.getCostAverage();
  //
  //   let length = Math.sqrt( Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2) );
  //   let vect_res = { x: 0, y: 0, z: 0 };
  //
  //   if (length > cost + 0.5 || length < cost - 0.5) {
  //     let Fd = 1 / Math.pow(0.5 + length, 2);
  //
  //     let vect = {x: dx, y: dy, z: dz};
  //
  //     if (length > 4.5) {
  //       vect_res.x = -vect.x * Fd / length;
  //       vect_res.y = -vect.y * Fd / length;
  //       vect_res.z = -vect.z * Fd / length;
  //     } else {
  //       vect_res.x = vect.x * Fd / length;
  //       vect_res.y = vect.y * Fd / length;
  //       vect_res.z = vect.z * Fd / length;
  //     }
  //   }
  //
  //   return vect_res;
  // }
  //
  // strengthInteraction(v1, v2) {
  //   let vect_res = { x: 0, y: 0, z: 0 };
  //   let edge = this.graph.checkEdge(v1.getName(), v2.getName());
  //
  //   if (edge !== false) {
  //     let dx = v1.pos.x - v2.pos.x;
  //     let dy = v1.pos.y - v2.pos.y;
  //     let dz = v1.pos.z - v2.pos.z;
  //
  //     let length = Math.sqrt( Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2) );
  //
  //     let vect = new Vector3(dx, dy, dz);
  //     vect.normalize();
  //     if (edge.getCost() * 10 < this.graph.getCostAverage()) {
  //       // console.log(edge.getCost(), this.graph.getCostAverage(),length );
  //       if (length > edge.getCost() * 10) {
  //         vect_res.x = -vect.x / 10;
  //         vect_res.y = -vect.y / 10;
  //         vect_res.z = -vect.z / 10;
  //       }
  //       else {
  //         vect_res.x = vect.x / 10;
  //         vect_res.y = vect.y / 10;
  //         vect_res.z = vect.z / 10;
  //       }
  //     }
  //     // else if (edge.getCost() * 10 > this.graph.getCostAverage()) {
  //     //   if (length < edge.getCost() * 10) {
  //     //     vect_res.x = vect.x / 10;
  //     //     vect_res.y = vect.y / 10;
  //     //     vect_res.z = vect.z / 10;
  //     //   } else {
  //     //     vect_res.x = -vect.x / 10;
  //     //     vect_res.y = -vect.y / 10;
  //     //     vect_res.z = -vect.z / 10;
  //     //   }
  //     // }
  //   }
  //
  //   return vect_res;
  // }

}
