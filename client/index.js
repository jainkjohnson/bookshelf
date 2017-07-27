import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import asyncMiddleware from 'src/redux/middlewares/asyncMiddleware';
import errHandlerMiddleware from 'src/redux/middlewares/errorHandlerMiddleware';
import routes from 'src/routes';
import reducers from 'src/redux/reducers';

const middlewares = [asyncMiddleware, errHandlerMiddleware];
let enhancers;

if (window.__REDUX_DEVTOOLS_EXTENSION__) {
  enhancers = compose(
    applyMiddleware(...middlewares),
    window.__REDUX_DEVTOOLS_EXTENSION__(),
  );
} else {
  enhancers = applyMiddleware(...middlewares);
}

const store = createStore(reducers, enhancers);

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      {routes}
    </Router>
  </Provider>,
  document.getElementById('bookshelfApp'),
);
