const mongodb = require('mongodb');
const query = require('../utility/query');
const ObjectId = mongodb.ObjectId;

// # This would be the 'Task' model, please read the note on '/models/m-user.js'.
class Task {
    constructor(title, description, due_date, completed) {
      this._id = id ? new ObjectId(id) : null;
      this.title = title;
      this.description = description;
      this.created_at = new Date();
      this.due_date = due_date;
      this.completed = completed || false;
    }

    async save(userID) {
        let user = await query('users','insert',this);
        return user;
    }
}

module.exports = Task;