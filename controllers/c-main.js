const query = require('../utility/query');
const cache = require('../utility/cache').check;

// # GET home page, cache users list
exports.getHome = (req, res, next) => {
    res.render('home');
    //after 'home' is rendered cache 'users' list
    const args = ['users','aggregate',[{ $match: { "isVerified": true } },{ $project: { "_id": 0, "name": 1, "email": 1 } }]];
    await cache('users',query,args);
};

// # GET about page
exports.getAbout = (req, res, next) => {
    res.render('about');
};
