import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import asyncMiddleware from 'src/redux/middlewares/asyncMiddleware';
import App from 'src/containers/App';
import reducers from 'src/redux/reducers';

const middlewares = [asyncMiddleware];
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
      <Route path="/" component={App} />
    </Router>
  </Provider>,
  document.getElementById('bookshelfApp'),
);
