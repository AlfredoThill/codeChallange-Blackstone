const mongodb = require('mongodb');
const query = require('../utility/query');
const ObjectId = mongodb.ObjectId;

// # This would be the 'Task' model, please read the note on '/models/m-user.js'.
class Task {
    constructor(title, description, due_date, completed) {
      this._id = id;
      this.title = title;
      this.description = description;
      this.created_at = new Date();
      this.updated_at = new Date();
      this.due_date = due_date;
      this.completed = completed || false;
    }

    async save(userID) {
        let pushTask = await query('users','update',{ "_id": new ObjectId(userID) }, { $push: { "tasks": this }});
        return pushTask;
    }
}

module.exports = Task;