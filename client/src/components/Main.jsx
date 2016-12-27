const React = require('react')
const NavBar = require('./NavBar')

const Main = React.createClass({

  render(){
    return(
        <div className='container'>
          <NavBar />
          {this.props.children}
        </div>
    )
  }
});


const {element} = React.PropTypes

Main.propTypes = {
  children: element.isRequired,
}

module.exports = Main