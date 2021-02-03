const mongodb = require('mongodb');
const query = require('../utility/query');
const ObjectId = mongodb.ObjectId;

// # So, Ive really just started learning MVC 4 months ago, applied to 'Laravel'. I have yet to apply it
//   on node. Here I wrote what I think could be an user model, dunno if I'm actully gonna use on the
//   controllers. Knowing MVC mongoose makes more sense, the created schema could be the model and the
//   mongoose driver comes with its own predefined methods saving some time. I ve explored mongoose but 
//   I haven't really used it in a proyect yet. So, no moongose will be used but I'm more than willing to learn.
class User {
  constructor(id, username, email, password, tasks, verified, expires) {
    this._id = id ? new ObjectId(id) : null;
    this.name = username;
    this.email = email;
    this.password = password;
    this.tasks = tasks || []; // array of objects
    this.verified = verified || null;
    this.expires = expires || null;
  }

  async save() {
    let user = await query('users','insert',this);
    return user;
  }

  async findByEmail(userEmail) {
    let user = await query('users','find',{ 'email': userEmail });
    return user;
  }
}

module.exports = User;