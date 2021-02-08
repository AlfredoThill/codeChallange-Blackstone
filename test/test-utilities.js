const invokeClient = require('../utility/client');
const query = require('../utility/query');
const ObjectId = require('mongodb').ObjectID;
const sendEmail = require('../utility/mailer');
const expect = require('chai').expect;

require('dotenv').config();
const mail_user = process.env.MAILER_USER;

describe('Checks outside resources', () => {
    describe('Conection with Mongo Altas', function() {
      this.timeout(5000);   
      let inserted_id;
      it('Should insert a document', async () => {
        let insert_doc = await query('testing','insert', { testing: 'inserted'});
        let check = false;
        if (insert_doc.insertedId) { // Dunno how else to assert this
            check = true;
        }
        inserted_id = new ObjectId(insert_doc.insertedId);
        expect(check)
            .to.be.true;
      });
      it('Should find a document', async () => {
        let find_doc = await query('testing','find',{ '_id': inserted_id });  
        expect(find_doc.length)
            .to.be.a('number')
            .to.be.equal(1);
      });
      it('Should update a document', async () => {
        let args = {
            "filter": { "_id": new ObjectId(inserted_id) },
            "update": { $set: { "testing": 'updated' } },
        };
        let update_doc = await query('testing','update',args);
        expect(update_doc.modifiedCount)
            .to.be.a('number')
            .to.be.equal(1);
      });
      it('Should remove a document', async () => {
        const client = await invokeClient(); 
        const collection = client.db('codeChallange').collection('testing');   
        let delete_doc = await collection.deleteOne({ "_id": new ObjectId(inserted_id) });
        client.close();
        expect(delete_doc.result.n)
            .to.be.a('number')
            .to.be.equal(1);
      });
    });

    describe('Working Mailer, gmail', function() {
        this.timeout(5000); 
        it('Should send an email', async () => {
            let sent = await sendEmail(mail_user,'test');
            expect(sent.success)
                .to.be.true;
        });
    });

});

