
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
chai.use(chaiHttp);
const url= 'http://localhost:3000';

describe('Main router tests, checks is app is running', () => {
    describe ('Main page', () => {
        it('Should load "home" view', function(done){
            chai.request(url)
            .get('/')
            .end( function(err,res){
                console.log(res.body)
                expect(res).to.have.status(200);
                done();
            });    
        });
    });
    describe ('About page', () => {
        it('Should load "about" view', function(done){
            chai.request(url)
            .get('/about')
            .end( function(err,res){
                console.log(res.body)
                expect(res).to.have.status(200);
                done();
            });    
        });
    });
});