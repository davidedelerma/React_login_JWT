const React = require ('react')
import {FormGroup, Col, FormControl, ControlLabel, Button} from 'react-bootstrap';


const RegisterIn = React.createClass({
    render(){
        return (
            <div className="main-login main-center">
                <FormGroup controlId="formBasicText">                  
                    <Col sm={15}>
                        <ControlLabel>Your Name</ControlLabel>
                        <FormControl type="text" placeholder="Name..." />
                    </Col>
                </FormGroup>
                <FormGroup controlId="formBasicText">
                    <Col sm={15}>
                        <ControlLabel>Your Last Name</ControlLabel>
                        <FormControl type="text" placeholder="Last Name..." />
                    </Col>
                </FormGroup>
                <FormGroup controlId="formBasicText">
                    <Col sm={15}>
                        <ControlLabel>Your Email</ControlLabel>
                        <FormControl type="email" placeholder="Email..." />
                    </Col>
                </FormGroup>
                <FormGroup controlId="formBasicText">
                    <Col sm={15}>
                        <ControlLabel>Your Password</ControlLabel>
                        <FormControl type="password" placeholder="Password..." />
                    </Col>
                </FormGroup>
                <FormGroup controlId="formBasicText">
                    <Col sm={15}>
                        <ControlLabel>Confirm Password</ControlLabel>
                        <FormControl type="password" placeholder="Confirm Password..." />
                    </Col>
                </FormGroup>
                    <Col smOffset={2} sm={15}>
                        <Button type="submit">
                            Sign up
                        </Button>
                    </Col>
                
            </div>  
        )
    }
})


module.exports = RegisterIn