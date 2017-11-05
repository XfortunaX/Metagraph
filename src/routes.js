import React from 'react'
import { Route, IndexRoute } from 'react-router'

import App from './containers/App/index'
import About from './components/About/index'
import Home from './components/Home/index'
import NotFound from './components/NotFound/index'
import GraphModeling from './components/GraphModeling/index'

export const routes = (
  <div>
    <Route path='/' component={App}>
      <IndexRoute component={Home} />
      <Route path='graph_modeling' component={GraphModeling} />
      <Route path='about' component={About} />
    </Route>
    <Route path='*' component={NotFound} />
  </div>
);
