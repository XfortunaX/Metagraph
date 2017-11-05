import React, { Component } from 'react'
import { Link } from 'react-router'

export default class NotFound extends Component {
  render() {
    return (
      <div className='not-found-page'>
        <div className='back'>
            Страница не найдена.
          <Link to='/'>На главную</Link>?
        </div>
      </div>
    )
  }
}
