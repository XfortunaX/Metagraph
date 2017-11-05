import React, { Component } from 'react'
import { Link } from 'react-router'

export default class About extends Component {
  render() {
    return (
      <div className='about-page'>
        <div className='back'>
          <Link to='/'>Вернуться</Link>?
        </div>
      </div>
    )
  }
}
