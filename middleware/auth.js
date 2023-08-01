const is_login = (req , res , next) =>{

    try {

        if (req.session.user) {
            

            
            
        } else {

            res.redirect('./login')
            
        }
        next();
        
    } catch (error) {

        console.log(error);
        
    }


}

const is_logout = (req , res , next) =>{

    try {

        if (req.session.user) {
            

            res.redirect("dashboard");
        } 
        next()
        
    } catch (error) {

        console.log(error);
        
    }

    
}

module.exports = {
    is_login,
    is_logout


}