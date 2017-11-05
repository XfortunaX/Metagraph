import { PointLight } from 'three'
import PubSub from './pubSub'

export default class Light {
  constructor(props) {
    this.props = props;

    this.pubSub = new PubSub();

    this.light = new PointLight(0xffffff);
    this.light.position.set(100,250,100);

    this.pubSub.publish('add', this.light);
  }

  getLight() {
    return this.light;
  }

}
