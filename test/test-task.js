const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
chai.use(chaiHttp);
const url= 'http://localhost:3000';
const faker = require('faker');
const Keygrip = require('keygrip');

const invokeClient = require('../utility/client');
const ObjectId = require('mongodb').ObjectID;

// Mocking Session Variables ==> Note about skipped ones: Can't mock session variables yet, gonna keep looking into it...
let userID = "601f2576dd64fe39fcd100d1";
let cookie = Buffer.from(JSON.stringify({"userID": userID})).toString('base64'); // base64 converted value of cookie
let kg = Keygrip(['123456']);                                                    // same key as I'm using in my app
let hash = kg.sign('my-session=' + cookie);

describe('Task router tests, checks basic functionality', () => {
    console.log("Note about skipped ones: Can't mock session variables yet, gonna keep looking into it")
    describe.skip ('List tasks', () => {
        it('Gets the tasks related to a certain user', async function() {
            this.timeout(6000);
            let response = await chai.request(url)
                                     .get('/task/list')
                                     .set('cookie', ['my-session=' + cookie + '; ' + 'my-session.sig=' + hash + ';']);
            expect(response).to.be.html;
        });
    });

    describe.skip ('Task Actions', () => {
        it('Creates a new task', async function() {
            this.timeout(4000);
            let mock_title = faker.lorem.words();
            let mock_description = faker.lorem.paragraph();
            let mock_dueDate = faker.date.future();
            let response = await chai.request(url)
                                     .post('/task/create')
                                     .send({ 'title': mock_title, 'description': mock_description, 'due-date': mock_dueDate })
                                     .set('cookie', ['my-session=' + cookie + '; ' + 'my-session.sig=' + hash + ';']);
            let results = new Object(response.body);
            expect(response).to.be.json;
            expect(results.success).to.be.equal(true); 
            expect(results.title).to.be.equal('Task Added!');
        });
        it('Marks a task as completed', async function() {
            this.timeout(6000);
            const client = await invokeClient(); 
            const collection = client.db('codeChallange').collection('users');
            const stages = [{ $match: { "_id": new ObjectId(userID)} },{ $project: {"_id": 0, "tasks": 1}},{ $unwind: "$tasks" },{ $group : { _id: null, max: { $max : "$tasks._id" }}}];
            const last = await collection.aggregate(stages).toArray();
            let response = await chai.request(url)
                                     .post('/task/mark')
                                     .send({ 'id': last, 'completed':"1" })
                                     .set('cookie', ['my-session=' + cookie + '; ' + 'my-session.sig=' + hash + ';']);
            let results = new Object(response.body);
            expect(response).to.be.json;
            expect(results.success).to.be.equal(true); 
        });
    });
});