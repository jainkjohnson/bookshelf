import App from 'src/containers/App';
import Home from 'src/pages/Home';

function requireLogin({ params }, replace) {  // eslint-disable-line
  console.log('\n ==> This routes requires authentication');
}

export default {
  path: '/',
  component: App,
  indexRoute: { component: Home },
  childRoutes: [
    {
      onEnter: requireLogin,
      childRoutes: [/* routes those needs authentication */]
    },
    { path: 'home', component: Home }
  ]
};
