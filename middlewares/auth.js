const post = require('../models/Post')

//check if user is a guest
exports.isGuest = (req, res, next) => {
    if(!req.session.user){
        return next();
    } else {
        req.flash('error', 'You are logged in already')
        return res.redirect('/users/profile');
    }
};

//checks if user is authenticated
exports.isLoggedIn = (req, res, next)=> {
    if(req.session.user){
        return next();
    } else {
        req.flash('error', 'You need to log in first')
        return res.redirect('/users/login');
    }
};

//check if user is  Member of the group
exports.isMember = (req, res, next) => {

};

//check if user is autor of post
exports.isAuthor = (req, res, next) => {
    let id = req.params.id;
    post.findById(id)
    .then(post=>{
         if(post){
             if(post.author != req.session.user){
                 return next();
             } else {
                 let err = Error('Unauthorized to access the resource being the author');
                 err.status = 401;
                 return next(err);
             }
         }
    })
    .catch(err=>next(err));
 };