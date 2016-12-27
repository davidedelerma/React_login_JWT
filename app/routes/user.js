let jwt = require('jsonwebtoken')
let mongoose = require('mongoose');
let User = require('../models/user');
const fs = require('fs');
const secret  = fs.readFileSync('./security/secret.txt', 'utf8');


/*
 * GET /user route to retrieve all the books. (ONLY FOR ADMINS)
 */
function getUsers(req, res) {
        //Query the DB and if no errors, send all the users
        let query = User.find({});
        query.exec((err, users) => {
            if(err) res.send(err);
            //If no errors, send them back to the client
            res.json(users);
        });
}

/*
 * POST /user to save a new user.(ONLY FOR ADMINS)
 */
function postUser(req, res) {
    //Creates a new User
        var newUser = new User(req.body);
        //Save it into the DB.
        newUser.save((err,user) => {
            if(err) {
                res.send(err);
            }
            else { //If no errors, send it back to the client
                res.json({message: "User successfully added!", user });
            }
        });    
}

/*
 * GET /user/:id route to retrieve a user given its id.
 */
function getUser(req, res) {
    User.findById(req.params.id, (err, user) => {
        if(err) res.send(err);
        //If no errors, send it back to the client
            res.json(user); 
    });     
}

/*
 * DELETE /user/:id to delete a user given its id.
 */
function deleteUser(req, res) {
    User.remove({_id : req.params.id}, (err, result) => {
        res.json({ message: "User successfully deleted!", result });
    });
}

/*
 * PUT /user/:id to updatea a user given its id
 */
function updateUser(req, res) {
    User.findById({_id: req.params.id}, (err, user) => {
        if(err) res.send(err);
        Object.assign(user, req.body).save((err, user) => {
            if(err) res.send(err);
            res.json({ message: 'User updated!', user });
        }); 
    });
}

function authenticateUser(req, res){
    User.findOne({username: req.body.username},(err, user)=>{
        if(err) throw err;
        if(!user) {
            res.status(401).send('Authentication failed.')
        } else if (user) {
            //check if password matches
            user.comparePassword(req.body.password,(err, isMatch)=>{
                if (err) throw err;
                if (!isMatch){
                    res.status(401).send('Authentication failed.')
                } else {
                    let myToken = jwt.sign({username: req.body.username, admin: user.admin},secret);
                    res.status(200).json(myToken);
                }
            });
        }

    });
}

function checkAdmin(req,res,next){
    if (req.user.admin){
        next()
    } else {
        return res.sendStatus(401);
    }
}

module.exports = {getUsers, postUser, getUser, deleteUser, updateUser, authenticateUser, checkAdmin}