import { Mesh, CubeGeometry, MeshBasicMaterial, BackSide } from 'three'
import PubSub from './pubSub'

export default class SkyBox {
  constructor(props) {
    this.props = props;

    this.pubSub = new PubSub();

    this.createSkyBox();
    this.pubSub.publish('add', this.skyBox);
  }

  createSkyBox() {

    this.geometry = new CubeGeometry( 1000, 1000, 1000 );
    this.material = new MeshBasicMaterial( { color: 0xFFFFFF, side: BackSide } );
    this.skyBox = new Mesh( this.geometry, this.material );

  }
}
