import { Scene } from 'three'
import PubSub from './pubSub'

export default class SceneModeling {
  constructor(props) {
    this.props = props;
    this.scene = new Scene();
    this.pubSub = new PubSub();

    this.pubSub.subscribe('add', this.add, this);
    // this.pubSub.subscribe('addVertex', this.addVertex, this);
  }

  getScene() {
    return this.scene;
  }

  add(sceneObject) {
    this.scene.add(sceneObject);
  }

  // addVertex(vertex) {
  //   console.log(vertex);
  //   this.scene.add( vertex );
  // }

}
