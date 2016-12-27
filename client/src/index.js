const React = require('react');
const ReactDOM = require('react-dom');
const ReactRouter = require('react-router')
const {Router, Route, IndexRoute, browserHistory} = ReactRouter
const Home = require('./components/Home')
const LogIn = require('./components/LogIn')
const LogOut = require('./components/LogOut')
const RegisterIn = require ('./components/RegisterIn')
const Main = require('./components/Main')

const App = React.createClass({
  render(){
    return(
      <Router history={browserHistory}>
        <Route path='/' component={Main}>
          <IndexRoute component={Home} />
          <Route path='/login' component={LogIn} />
          <Route path='/logout' component={LogOut} />
          <Route path='/register' component={RegisterIn} />
        </Route> 
      </Router>
    )
  }
})

window.onload = function(){
  ReactDOM.render(<App/>, document.getElementById('app'))
  
}
module.exports = App