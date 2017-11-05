import { PerspectiveCamera, Vector3 } from 'three'
import PubSub from './pubSub'

export default class Camera {
  constructor(props) {
    this.props = props;

    this.pubSub = new PubSub();

    this.camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    this.pubSub.publish('add', this.camera);
    this.camera.position.y = 15;
    this.camera.position.z = 20;
    let look = new Vector3( 0, 0, 0 );
    this.camera.lookAt(look);
  }

  getCamera() {
    return this.camera;
  }

}
