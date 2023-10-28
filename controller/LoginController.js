const adminLogin = require('../model/AdminLogin')
const jwt_token = require('jsonwebtoken')

const jwt_security = "sorry"

const loginpage = (req, res) => {
    try {
        res.render('login/login', { msg: req.flash('info')[0] });

    } catch (error) {
        
        console.log(error);
    }



}


const login = async (req, res) => {
    try {
        const { Email, Password } = req.body
        const user = await adminLogin.findOne({ where: { Email: Email } });
        if (user.Password === Password) {
            jwt_token.sign({user}, jwt_security,{expiresIn:'100s' }, function(err , token){
                if (err) {
                    console.log(err);
                    
                } else {
                    token
                    req.token = token
                    req.session.user = user;


                    if (req.session.user) {
                        req.flash('info',`welcome ${req.session.user.Username}`);
                        res.redirect('dashboard');
        
        
        
                    } else {
                        
                    res.redirect('login', );
        
                    }
                    
                }
            })
     

        } else {
            req.flash('info', 'you email or password not valid')
            res.redirect('login', );
            
        }



    } catch (error) {
        req.flash('info', 'you email or password not valid')


        console.log(error);

    }
}

const adminCreate = async (req, res) => {
    try {

        const { Username, Email, Password } = req.body

        const adminC = new adminLogin({
            Username,
            Email,
            Password,
            Roll: "is_admin"

        });

        const result = adminC.save();
        res.redirect('login')

    } catch (error) {

    }
}

const logout = (req, res) => {
    // Destroy the session to log out the user
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.send('Error logging out.');
        } else {
            // Redirect the user to the login page after successfully destroying the session
            res.redirect('/login');
        }
    });
}

module.exports = {
    login,
    adminCreate,
    loginpage,
    logout
}