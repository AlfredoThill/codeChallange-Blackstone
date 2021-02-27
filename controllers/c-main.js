const query = require('../utility/query');
const cache = require('../utility/cache').check;
const path = require('path');

// # GET home page, cache users list
exports.index = async (req, res, next) => {
    res.render('index');
    //after 'home' is rendered cache 'users' list
    const args = ['users','aggregate',[{ $match: { "isVerified": true } },{ $project: { "_id": 0, "name": 1, "email": 1 } }]];
    await cache('users',query,args);
};

// # GET component
exports.component = async (req, res, next) => {
    const file = req.query.name;
    console.log(file);
    res.sendFile(path.join(__dirname, '../views','components', file));
};