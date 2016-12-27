const React = require ('react')
import {browserHistory} from 'react-router';

const LogOut = React.createClass({
    componentWillMount() {
        localStorage.removeItem("token");
        browserHistory.push('/')
    },

    render(){
        return null
    }
})

module.exports = LogOut