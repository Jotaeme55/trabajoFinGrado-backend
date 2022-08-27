let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
require("dotenv").config();
let userId;

chai.use(chaiHttp);
const url =process.env.VUE_APP_BACKEND_URL || 'http://localhost:3000/api/v1';


describe('Register: ', () => {
    it.only('should register successfully', (done) => {
        chai.request(url)
        .post('/auth/register')
        .send({"username": "testUsername", "password": "testPassword","email":"pepe@gmail.com","telefono":666666666})
        .end(function(err, res) {
            userId = res.body.userId
            expect(res).to.have.status(200);
        done();
        });
    });
}); 


describe('post image: ', () => {
    it.only('post image successfully', (done) => {
        chai.request(url)
        .post('/images')
        .send({
            usernameAsociated: "testUsername",
            name:"foto",
            image:"pruebaimage",
            fechaDeGuardado:new Date().getTime(),
            tipoDeModelo:"numeros"})
        .end(function(err, res) {
        expect(res).to.have.status(200);
        done();
        });
    });
}); 

describe('get images from user: ', () => {
    it.only('get images from user sucessfuly', (done) => {
        chai.request(url)
        .get('/images/testUsername')
        .query({tipoDeModelo:"numeros",pagina:0,buscador:'foto',ordenar:['nombre','1']})
        .end(function(err, res) {
        expect(res).to.have.status(200);
        done();
        });
    });
}); 

describe('delete user and their images: ', () => {
    it.only('delete user and their images sucessfuly', (done) => {
        chai.request(url)
        .delete('/users/'+userId)
        .end(function(err, res) {
        expect(res).to.have.status(200);
        done();
        });
    });
}); 