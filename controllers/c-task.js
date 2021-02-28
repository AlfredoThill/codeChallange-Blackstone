const invokeClient = require('../utility/client');
const query = require('../utility/query');
const ObjectId = require('mongodb').ObjectID;
// Requiring the model, dunno if im gonna use it yet
const Task = require('../models/m-task');

// # ajax GET all the taks related to an user, 
exports.fetchTasks = async (req, res, next) => {
    try {
        const userID = req.session.userID;
        const user = await query('users','find',{ '_id': new ObjectId(userID)});
        let html;
        // Check number of tasks
        if (user[0].tasks.length != 0) {
            // Prepare data set for component. (could be done with mongo aggregation)
            for (let i = 0; i < user[0].tasks.length; i++) {
                if (user[0].tasks[i].completed == true) {
                    user[0].tasks[i].completed = 'Yes';
                    user[0].tasks[i].class = "done";
                }
                else {
                    user[0].tasks[i].completed = 'No';
                    user[0].tasks[i].class = "danger";
                }
                // Format dates, dunno if this could be set on mongo
                user[0].tasks[i].created_at = (new Date(user[0].tasks[i].created_at)).toLocaleDateString('en-US');
                user[0].tasks[i].due_date = (new Date(user[0].tasks[i].due_date)).toLocaleDateString('en-US');
            }
        }
        res.json(user[0].tasks);
    }
    catch (e) {
        console.log(e);
    }
};

// # ajax POST, create a new task related to the user
exports.createTask = async (req, res, next) => {
    // Keep conection open since route implies several queries 
    const client = await invokeClient(); 
    const collection = client.db('codeChallange').collection('users');  
    let result = {};
    try {
        const userID = req.session.userID;
        const stages = [{ $match: { "_id": new ObjectId(userID)} },{ $project: {"_id": 0, "tasks": 1}},{ $unwind: "$tasks" },{ $group : { _id: null, max: { $max : "$tasks._id" }}}];
        const last = await collection.aggregate(stages).toArray();
        let newID; 
        if (last.length > 0) { newID = last[0].max + 1 } else { newID = 1 }
        const task = { 
            "_id": newID,
            "title": req.body['title'],
            "description": req.body['description'], 
            "created_at": new Date(),
            "updated_at": new Date(),
            "due_date": new Date(req.body['due-date']),
            "completed": false
            };
        console.log(userID)
        let args = { "filter": { "_id": new ObjectId(userID) }, "update": { $push: { "tasks": task } } };
        let update = await collection.updateOne(args.filter,args.update)
        if (update.modifiedCount == 1) {
            result = { success: true, title: 'Task Added!', msg: 'This modal will close shortly.' }
        }
        else {
            result = { success: false, msg: 'The task was not found...' }
        }
    }
    catch (e) {
        result = { success: false, msg: e }; 
    }
    finally {
        res.json(result);
        client.close() 
    }
};

// # ajax PUT, update task
exports.updateTask = async (req, res, next) => {
    // Keep conection open since route implies several queries 
    const client = await invokeClient(); 
    const collection = client.db('codeChallange').collection('users');  
    let result = {};
    try {
      const userID = req.session.userID;
      const taskID = req.body['id'];
      const title = req.body['title'];
      const description = req.body['description'];
      let completed = req.body['completed'];
      // Integer to boolean, just in case
      if (completed == 1) { completed = true } else {completed = false };
      let args = { 
        "filter": { "_id": new ObjectId(userID) }, 
        "update": { $set: { 
          "tasks.$[elem].updated_at": new Date(),
          "tasks.$[elem].title": title,
          "tasks.$[elem].description": description,
          "tasks.$[elem].completed": completed
         } 
        },
        "arrayfilter": { arrayFilters: [ { "elem._id": parseInt(taskID) } ] }
      };
      let update = await collection.updateOne(args.filter,args.update,args.arrayfilter);
      if (update.modifiedCount == 1) {
        result = { success: true, title: 'Task Edited!', msg: 'This modal will close shortly.' }
      }
      else {
        result = { success: false, msg: 'The task was not found...' }
      }
    }
    catch (e) {
      result = { success: false, msg: e };   
    }
    finally { 
      res.json(result);
      client.close() 
    }
};

// # ajax PUT, mark as completed (partial update)
exports.markCompleted = async (req, res, next) => {
  // Keep conection open since route implies several queries 
  const client = await invokeClient(); 
  const collection = client.db('codeChallange').collection('users');  
  let result = {};
  try {
    const userID = req.session.userID;
    const taskID = req.body['id'];
    let completed = req.body['completed'];
    // Integer to boolean, just in case
    if (completed == 1) { completed = true } else {completed = false };
    let args = { 
      "filter": { "_id": new ObjectId(userID) }, 
      "update": { $set: { 
        "tasks.$[elem].updated_at": new Date(),
        "tasks.$[elem].completed": completed
       } 
      },
      "arrayfilter": { arrayFilters: [ { "elem._id": parseInt(taskID) } ] }
    };
    let update = await collection.updateOne(args.filter,args.update,args.arrayfilter);
    if (update.modifiedCount == 1) {
      result = { success: true };
    }
    else {
      result = { success: false, msg: 'The task was not found...' }
    }
  }
  catch (e) {
    result = { success: false, msg: e };   
  }
  finally { 
    res.json(result);
    client.close() 
  }
};

// # ajax PUT, destroy task ==> update user
exports.destroyTask = async (req, res, next) => {
   // Keep conection open since route implies several queries 
   const client = await invokeClient(); 
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
        result = { success: true, title: 'Task Destroyed!', msg: 'This modal will close shortly.' }
     }
     else {
        result = { success: false, msg: 'The task was not found...' }
     }
   }  
   catch (e) {
     result = { success: false, msg: e };   
   }
   finally { 
     res.json(result);
     client.close() 
   }
};