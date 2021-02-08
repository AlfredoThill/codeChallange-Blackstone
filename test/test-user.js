const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
chai.use(chaiHttp);
const url= 'http://localhost:3000';
const faker = require('faker');

const invokeClient = require('../utility/client');
const query = require('../utility/query');
const ObjectId = require('mongodb').ObjectID;

describe('User router tests, checks basic functionality', () => {
    describe ('Login Features', () => {
        it('Login Success: server should accept credentials and save session vars', async function() {
            this.timeout(5000);
            let response = await chai.request(url)
                                     .post('/user/login')
                                     .send({ 'login-mail': "alfredothill@gmail.com",'login-pwd': "123456" });
            let results = new Object(response.body);
            expect(response).to.be.json;
            expect(results.logged).to.be.equal(true); 
        });
        it('Login failure: mock credentials rejected', async () => {
            let response = await chai.request(url)
                                     .post('/user/login')
                                     .send({ 'login-mail': faker.internet.email(),'login-pwd': faker.internet.password() });
            let results = JSON.stringify(response.body);
            let expected = JSON.stringify({ 'logged': false, 'msg': 'Email not registered.' });
            expect(response).to.be.json;
            expect(results).to.be.equal(expected);
        });
    });

    describe ('Sign In Features', () => {
        let test_email = faker.internet.email(); let test_pwd = faker.internet.password();
        it('Request Account, server accepts new user entry', async function() {
            this.timeout(6000);
            let response = await chai.request(url)
                                     .post('/user/sign')
                                     .send({ 'signin-name': "test_user", 'signin-mail': test_email, 'signin-pwd': test_pwd });
            let results = new Object(response.body);
            expect(response).to.be.json;
            expect(results.success).to.be.equal(true); 
        });
        it('Confirm account, mocks when user clicks link on sent email', async function() {
            this.timeout(6000);
            let find_doc = await query('users','find',{ 'email': test_email });
            let response = await chai.request(url)
                                     .get('/user/confirm?id=' + find_doc[0]._id + '&token=' + find_doc[0].password);
            // Asserts redirect to 'home', "/"
            expect(response.redirects[0]).to.be.equal(url + "/");
            // Tests done, delete test subject
            const client = await invokeClient(); 
            const collection = client.db('codeChallange').collection('users');   
            await collection.deleteOne({ "_id": new ObjectId(find_doc[0]._id) });
            client.close();
        });
    });

});