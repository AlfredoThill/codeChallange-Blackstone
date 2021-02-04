const invokeClient = require('../utility/client');
const query = require('../utility/query');
const components = require('../utility/templating/components');
const ObjectId = require('mongodb').ObjectID;
// Requiring the model, dunno if im gonna use it yet
const Task = require('../models/m-task');

// # ajax GET all the taks related to an user, 
exports.fetchTasks = (req, res, next) => {
    try {
        const userID = req.session.userID;
        const user = await query('user','find',{ '_id': new ObjectId(userID)});
        let html = components.task_list({ list: user[0].tasks });
        res.send(html);
    }
    catch (e) {
        console.log(e)
    }
};

// # ajax POST, create a new task related to the user
exports.createTask = (req, res, next) => {
    // Keep conection open since route implies several queries 
    const client = await invokeClient(); 
    const collection = client.db('codeChallange').collection('users');  
    try {
        const userID = req.session.userID;
        const stages = [{ $match: { "_id": parseInt(forumID)} },{ $project: {"_id": 0, "tasks": 1}},{ $unwind: "$tasks" },{ $group : { _id: null, max: { $max : "$tasks._id" }}}];
        const last = await collection.aggregate(stages).toArray();
        let newID; 
        if (last.length > 0) { newID = last[0].max + 1 } else { newID = 1 }
        const task = { 
            "_id": newID,
            "title": req.body['title'],
            "description": req.body['description'], 
            "created_at": new Date(),
            "updated_at": new Date(),
            "due_date": req.body['due-date'],
            "completed": false
            };
        let args = { "filter": { "_id": new ObjectId(userID) }, "update": { $push: { "tasks": task } } };
        let update = await collection.updateOne(args.filter,args.update)
        if (update.modifiedCount == 1) {
            const user = await query('user','find',{ '_id': new ObjectId(userID)});
            let html = components.task_list({ list: user[0].tasks });
            res.json({ content: html });  
        }
        else {
            res.json({ error: 'Update failed!'});
        }
    }
    finally {
        client.close() 
    }
};

// # ajax PUT, update task
exports.updateTask = (req, res, next) => {
    // Keep conection open since route implies several queries 
    const client = await invokeClient(f_uri); 
    const collection = client.db('codeChallange').collection('users');  
    try {
      const userID = req.session.userID;
      const taskID = req.body['id'];
      const title = req.body['title'];
      const description = req.body['description'];
      const completed = req.body['completed'];
      let args = { 
        "filter": { "_id": new ObjectId(userID) }, 
        "update": { $set: { 
          "tasks.$[elem].updated_ata": new Date(),
          "tasks.$[elem].title": title,
          "tasks.$[elem].description": description,
          "tasks.$[elem].completed": completed
         } 
        },
        "arrayfilter": { arrayFilters: [ { "elem._id": parseInt(taskID) } ] }
      };
      let update = await collection.updateOne(args.filter,args.update,args.arrayfilter);
      if (update.modifiedCount == 1) {
        const user = await query('user','find',{ '_id': new ObjectId(userID)});
        let html = components.task_list({ list: user[0].tasks });
        res.json({ content: html }); 
      }
      else {
        res.json({ error: 'Update failed!'});
      }
    }
    finally { 
        client.close() 
    }
};

// # ajax PUT, destroy task ==> update user
exports.destroyTasks = (req, res, next) => {
   // Keep conection open since route implies several queries 
   const client = await invokeClient(f_uri); 
   const collection = client.db('codeChallange').collection('users');  
      try {
        const userID = req.session.userID;
        const taskID = req.body['id'];
        let args = { 
          "filter": { "_id": new ObjectId(userID) }, 
          "update": { 
            $pull: { 
             "tasks": { "_id": parseInt(taskID) } 
            } 
           } 
        };
        let update = await collection.updateOne(args.filter,args.update);
        if (update.modifiedCount == 1) {
            const user = await query('user','find',{ '_id': new ObjectId(userID)});
            let html = components.task_list({ list: user[0].tasks });
            res.json({ content: html }); 
        }
        else {
            res.json({ error: 'Delete failed!'});
        }
      }
    finally { 
        client.close() 
    }
};