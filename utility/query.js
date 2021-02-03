const invokeClient = require('./client')

// # Simple Query Runner, runs the query and closes conection

let query = async function queryAtlas(collection_name,operation,params) {
  const client = await invokeClient();
  const collection = client.db('codeChallange').collection(collection_name);  
  let cursor;
    try {
       switch (operation) {
        case 'find':
          cursor = await collection.find(params).toArray(); 
         break
        case 'update':
          cursor = await collection.updateOne(params.filter,params.update);
          break
        case 'insert':
          cursor = await collection.insertOne(params); 
         break
        case 'aggregate': 
          cursor = await collection.aggregate(params).toArray(); 
       }  
    }
    catch (e) {
      // Again, not really catching this at the moment  
      console.log(e); 
    }
    finally {
      client.close();
    }   
    return cursor  
}

module.exports = query;