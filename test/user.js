//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let jwt = require('jsonwebtoken')
const fs = require('fs');
const secret  = fs.readFileSync('./security/secret.txt', 'utf8');
let User = require ("../app/models/user");

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Users',()=>{
    beforeEach((done) =>{
        User.remove()
            .then(User.create({
                name: "Davide",
                lastname: "de Lerma",
                username: "davidedelerma",
                password: "password123",
                admin: true,
                location: "Napoli",
                _id: new mongoose.mongo.ObjectId('56cb91bdc3464f14678934ca')
            }))
            .then(User.create({
                name: "Giacomo",
                lastname: "Leopardi",
                username: "giacomoleopardi",
                password: "password123",
                admin: false,
                location: "Napoli",
                _id: new mongoose.mongo.ObjectId('56cb91bdc3464f14678934cb')
            },(err)=>{
                done();
        }));
    });
    /*
        * Test the /login route
        */
    describe ('given the /login route', ()=>{
        it('should be able to authenticate when credentials are right',(done)=>{
            let credentials = {
                username:'davidedelerma',
                password: 'password123'
            }
            chai.request(server)
                .post('/login')
                .send(credentials)
                .end((err,res)=>{
                    res.should.have.status(200);
                    done();
                })
        });
        it('should receive a token when credentials are right',(done)=>{
            let credentials = {
                username:'davidedelerma',
                password: 'password123'
            }
            chai.request(server)
                .post('/login')
                .send(credentials)
                .end((err,res)=>{
                    res.body.should.be.a('String');
                    done();
                })
        });
        it('should not be able to authenticate when username is wrong',(done)=>{
            let credentials = {
                username:'aaaaaaaa',
                password: 'password123'
            }
            chai.request(server)
                .post('/login')
                .send(credentials)
                .end((err,res)=>{
                    res.should.have.status(401);
                    done();
                })
        });
        it('should not be able to authenticate when password is wrong',(done)=>{
            let credentials = {
                username:'davidedelerma',
                password: '12345'
            }
            chai.request(server)
                .post('/login')
                .send(credentials)
                .end((err,res)=>{
                    res.should.have.status(401);
                    done();
                })
        });
    });
    
    describe('given the /GET route', ()=>{
      it('it should GET all the users when logged-in user is an admin', (done)=>{
          let adminToken = jwt.sign({username: 'davidedelerma', admin: true},secret);
          chai.request(server)
            .get('/user')
            .set('Authorization', 'Bearer ' + adminToken)
            .end((err,res)=>{
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(2);
                done();
            });
      });
     it('it should not GET all the users when logged-in user is not an admin', (done)=>{
          let adminToken = jwt.sign({username: 'giacomoleopardi', admin: false},secret);
          chai.request(server)
            .get('/user')
            .set('Authorization', 'Bearer ' + adminToken)
            .end((err,res)=>{
                res.should.have.status(401);
                done();
            });
      });
    });

  /*
  * Test the /POST route
  */
    describe('given the /POST route',()=>{
      it('it should not POST a user without username',(done)=>{
          let adminToken = jwt.sign({username: 'davidedelerma', admin: true},secret);
          let user = {
              name: "Dan",
              lastname: "Martlan",
              password: "password123",
              admin: true,
              location: "Napoli"
          }
          chai.request(server)
            .post('/user')
            .set('Authorization', 'Bearer ' + adminToken)
            .send(user)
            .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
            res.body.errors.should.have.property('username');
            res.body.errors.username.should.have.property('kind').eql('required');
            done()
        });
      });
      it('it should not POST a user without password',(done)=>{
          let adminToken = jwt.sign({username: 'davidedelerma', admin: true},secret);
          let user = {
              name: "Dan",
              lastname: "Martland",
              username: "danmartland",
              admin: true,
              location: "Napoli"
          }
          chai.request(server)
            .post('/user')
            .set('Authorization', 'Bearer ' + adminToken)
            .send(user)
            .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
            res.body.errors.should.have.property('password');
            res.body.errors.password.should.have.property('kind').eql('required');
            done()
        });
      });
      it('it should POST a new user when logged-in user is an admin ', (done) => {
        let adminToken = jwt.sign({username: 'davidedelerma', admin: true},secret);
        let user = {
            name: "Dan",
            lastname: "Martland",
            username: "danmartland",
            password: "password123",
            admin: true,
            location: "Glasgow"
        }
        chai.request(server)
            .post('/user')
            .set('Authorization', 'Bearer ' + adminToken)
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('User successfully added!');
                res.body.user.should.have.property('name');
                res.body.user.should.have.property('lastname');
                res.body.user.should.have.property('username');
                res.body.user.should.have.property('password');
                res.body.user.should.have.property('admin');
                res.body.user.should.have.property('location');
                res.body.user.should.have.property('created_at');
                res.body.user.should.have.property('updated_at');
                done();
            });
      });
      it('it should not POST a new user when logged-in user is not an admin ', (done) => {
        let adminToken = jwt.sign({username: 'giacomoleopardi', admin: false},secret);
        let user = {
            name: "Dan",
            lastname: "Martland",
            username: "danmartland",
            password: "password123",
            admin: true,
            location: "Glasgow"
        }
        chai.request(server)
            .post('/user')
            .set('Authorization', 'Bearer ' + adminToken)
            .send(user)
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
      });
    });
    describe('given the /GET/:id route', () => {
        it('it should GET a user by the given id ', (done) => {
            let adminToken = jwt.sign({username: 'davidedelerma', admin: true},secret);
            let user = new User({
                name: "Dan",
                lastname: "Martland",
                username: "danmartland",
                password: "password123",
                admin: false,
                location: "Napoli"
            });
            user.save((err, user) => {
                chai.request(server)
                .get('/user/' + user.id)
                .set('Authorization', 'Bearer ' + adminToken)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('name');
                    res.body.should.have.property('lastname');
                    res.body.should.have.property('username');
                    res.body.should.have.property('password');
                    res.body.should.have.property('admin');
                    res.body.should.have.property('location');
                    res.body.should.have.property('created_at');
                    res.body.should.have.property('updated_at');
                    res.body.should.have.property('_id').eql(user.id);
                    done();
                });
            });
        });
    });
     
     describe('given the /PUT/:id route', () => {
        it('it should UPDATE a user given the id', (done) => {
            let adminToken = jwt.sign({username: 'davidedelerma', admin: true},secret);
            let user = new User({
                name: "Dan",
                lastname: "Martland",
                username: "danmartland",
                password: "password123",
                admin: true,
                location: "Napoli"
            })
            user.save((err, user) => {
                chai.request(server)
                .put('/user/' + user.id)
                .set('Authorization', 'Bearer ' + adminToken)
                .send({
                    name: "Dan",
                    lastname: "de Lerma",
                    username: "danmartlan",
                    password: "password123",
                    admin: true,
                    location: "Napoli"
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('User updated!');
                    res.body.user.should.have.property('name').eql("Dan");
                    done();
                });
            });
        });
     });
    describe('given the /DELETE/:id route', () => {
        it('it should DELETE a user given the id when logged-in user is an admin', (done) => {
            let adminToken = jwt.sign({username: 'davidedelerma', admin: true},secret);
            let user = new User({
                name: "Dan",
                lastname: "Martland",
                username: "danmartland",
                password: "password123",
                admin: false,
                location: "Napoli"
            });
            user.save((err, user) => {
                chai.request(server)
                .delete('/user/' + user.id)
                .set('Authorization', 'Bearer ' + adminToken)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('User successfully deleted!');
                    res.body.result.should.have.property('ok').eql(1);
                    res.body.result.should.have.property('n').eql(1);
                  done();
                });
            });
        });
        it('it should not DELETE a user given the id when logged-in user is not an admin', (done) => {
            let adminToken = jwt.sign({username: 'giacomoleopardi', admin: false},secret);
            let user = new User({
                name: "Dan",
                lastname: "Martland",
                username: "danmartland",
                password: "password123",
                admin: false,
                location: "Napoli"
            });
            user.save((err, user) => {
                chai.request(server)
                .delete('/user/' + user.id)
                .set('Authorization', 'Bearer ' + adminToken)
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
            });
        });
    });
});
