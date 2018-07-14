auth = function(req,res,next){
    if(req.isAuthenticated()){
        next();
    }else{
        res.redirect('/login')
    }
}

routeAuth = function(req,res,next){

    if(req.isAuthenticated()){

    if(req.user.role === "student"){
        res.redirect('/student')
    }else if(req.user.role === "admin"){

        res.redirect('/admin');
    }else if(req.user.role === "staff"){
        res.redirect('/staff');
    }
}else{
    res.redirect('/login');
}

    

};

authAdmin = function(req,res,next){
    if(req.isAuthenticated()){
        if(req.user.role === "admin"){

            next();

    }else{
        res.redirect('/home')
    }
}else{
    res.redirect('/login')
}


}

authStudent = function (req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.role === "student") {

            next();

        } else {
            res.redirect('/home')
        }
    } else {
        res.redirect('/login')
    }

}

authStaff = function (req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.role === "staff") {

            next();

        } else {
            res.redirect('/home')
        }
    } else {
        res.redirect('/login')
    }


}


module.exports = {auth,
routeAuth,
authAdmin,
authStudent};