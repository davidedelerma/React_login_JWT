const React = require ('react')
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap'
import {Navbar, Nav, NavItem, NavDropdown} from 'react-bootstrap';
const NavBar = React.createClass({

  render(){
    let toRender;
    if (localStorage.getItem("token")===null){
            toRender = (
              <Nav pullRight>
                <LinkContainer to="/login" >
                  <NavItem >Log in</NavItem>
                </LinkContainer>
                <LinkContainer to="/register" >
                  <NavItem >Register</NavItem>
                </LinkContainer>
              </Nav>
            )
        } else {
          toRender = (
            <Nav pullRight>
            <LinkContainer to="/logout" >
            <NavItem >Log Out</NavItem>
            </LinkContainer> 
          </Nav>
        )
      } 

    return(
      <div className = "navbar">
        <Navbar  collapseOnSelect inverse fluid >
          <Navbar.Header>
            <Navbar.Brand>
              <IndexLinkContainer to="/" activeClassName="active">
                <a>Login App</a>
              </IndexLinkContainer>  
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>    
            {toRender}
          </Navbar.Collapse>
        </Navbar>
      </div>
    )
  }
});


module.exports = NavBar