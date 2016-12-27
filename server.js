'use strict'
const express = require('express');
const app = express();
const expressJWT = require('express-jwt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const https = require('https');
const http = require('http');
const fs = require('fs');
const mongoose = require('mongoose');
const morgan = require('morgan');
const config = require('config')
const user = require('./app/routes/user')
const secret  = fs.readFileSync('./security/secret.txt', 'utf8');
const privateKey  = fs.readFileSync('./security/server.key', 'utf8');
const certificate = fs.readFileSync('./security/server.crt', 'utf8');
const credentials = {key: privateKey, cert: certificate};
const path = require('path')
//db options
//connection to db
let options = { 
				server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } 
              }; 

//db connection
mongoose.Promise = global.Promise;      
mongoose.connect(config.DBHost, options,function(err){
    if (err) throw err;
    console.log('successfully connected to mongoDB')
});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

//don't show the log when it is test
if(config.util.getEnv('NODE_ENV') !== 'test') {
	//use morgan to log at command line
	app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}


//parse application/json and look for raw text                                        
app.use(bodyParser.json());                                     
app.use(bodyParser.urlencoded({extended: true}));               
app.use(bodyParser.text());                                    
app.use(bodyParser.json({ type: 'application/json'})); 
app.use(expressJWT({secret:secret}).unless({path: ['/','/bundle.js','/bundle.js.map','/main.css','/login']}))

app.use(express.static('client/build'));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});


app.route("/login")
    .post(user.authenticateUser);

app.route("/user")
    .get(user.checkAdmin,user.getUsers)
    .post(user.checkAdmin,user.postUser);

app.route("/user/:id")
    .get(user.getUser)
    .delete(user.checkAdmin,user.deleteUser)
    .put(user.updateUser);


//create secure connection

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);
httpServer.listen(8080);
httpsServer.listen(3000, () => {
        var host = httpsServer.address().address;
        var port = httpsServer.address().port;

        console.log('Example app listening at https://%s:%s', host, port);
    }

);


module.exports = app //for testing