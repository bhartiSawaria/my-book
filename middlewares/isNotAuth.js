
module.exports = (req, res, next) => {
    if(req.user){
        if( req.user.isLoggedIn ){
            return res.redirect('/');
        }
        next();
    }   
    next();
}