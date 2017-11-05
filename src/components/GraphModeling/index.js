import React, { Component } from 'react'
import { Link } from 'react-router'
import { WebGLRenderer } from 'three'
import GraphModeling from '../../js/GraphModeling/Graph/modeling'
import OrbitControls from 'three-orbitcontrols'

export default class Game extends Component {
  constructor() {
    super();
    this.state = {
      graphModel: new GraphModeling({
        prop: 'properties'
      }),
      loops: 0
    };
    this.startLoop = this.startLoop.bind(this);
    this.loop = this.loop.bind(this);
  }
  componentDidMount() {

    this.renderer = new WebGLRenderer();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.refs.graphModeling.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.state.graphModel.getCamera(), this.renderer.domElement);
    this.controls.enabled = true;
    this.controls.maxDistance = 1500;
    this.controls.minDistance = 0;

    this.startLoop();
  }
  startLoop() {
    if( !this._frameId ) {
      this._frameId = window.requestAnimationFrame( this.loop );
    }
  }
  loop() {
    this._frameId = window.requestAnimationFrame( this.loop );
    if ( this.state.loops < 1500) {
      this.state.graphModel.posUpdate();
      this.state.loops += 1;
    }
    this.renderer.render(this.state.graphModel.getScene(), this.state.graphModel.getCamera());
  }
  render() {
    return (
      <div className='graph-modeling-page'>
        <div className='back'>
          <Link to='/'>Вернуться</Link>?
        </div>
        <div className='graph-modeling' ref='graphModeling'>
        </div>
      </div>
    );
  }
}
