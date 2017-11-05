import React, { Component } from 'react'
import { Link } from 'react-router'

export default class Home extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div className='home-page'>
        <h1>Game</h1>
        <ul>
          <li><Link to='/graph_modeling'>Моделирование графа</Link></li>
          <li><Link to='/about'>Справка</Link></li>
        </ul>
      </div>
    )
  }
}
