const React = require ('react')
const LinkedStateMixin = require('react-addons-linked-state-mixin')
import {Form, FormGroup,FormControl, ControlLabel,Col, Button, Checkbox, Alert} from 'react-bootstrap';
import {browserHistory} from 'react-router';
const LogIn = React.createClass({
    getInitialState(){
        return {error:false}
    },

    OnSignIn: function(e){
        e.preventDefault();
        var data = "username="+(e.target.formHorizontalEmail.value)+"&password="+(e.target.formHorizontalPassword.value);
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.open("POST", "https://localhost:3000/login");
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.onload = () => {
            if (xhr.status === 200){
                const token = JSON.parse(xhr.responseText)
                localStorage.setItem("token", token);
                browserHistory.push('/')
            } else {
                this.setState({error:true})
            }
        }
        xhr.send(data);                
    },

    render(){
        let toRender;
        if (localStorage.getItem("token")===null){
            toRender = (
                <div className = "login">
                    {this.state.error && <Alert bsStyle="danger">
                        <h4>Email or password not recognized!</h4>
                        <p>Try to contact an admin if the problem persists. </p>
                        </Alert>
                    }
                    <Form horizontal onSubmit={this.OnSignIn}>
                        <FormGroup controlId="formHorizontalEmail">
                            <Col componentClass={ControlLabel} sm={2}>
                                Email
                            </Col>
                            <Col sm={10}>
                                <FormControl type="email" placeholder="Email" />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId="formHorizontalPassword">
                            <Col componentClass={ControlLabel} sm={2}>
                                Password
                            </Col>
                            <Col sm={10}>
                                <FormControl type="password" placeholder="Password" />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col smOffset={2} sm={10}>
                                <Checkbox>Remember me</Checkbox>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col smOffset={2} sm={10}>
                                <Button type="submit">
                                    Log in
                                </Button>
                            </Col>
                        </FormGroup>
                    </Form>    
                </div>         
            )
        } else {
            toRender = (
                <Alert bsStyle="info">
                    <h4>User Already Logged In!</h4>
                </Alert>
            )
        }
        return(
            <div>
               {toRender}
            </div>     
        )
    }
});

module.exports = LogIn