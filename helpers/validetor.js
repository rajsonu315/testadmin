const {check} = require('express-validator');

exports.signupvalidate = [
    check('name','Name is required').not().isEmpty(),
    check('email','email is required').not().isEmail().normalizeEmail({gmail_remove_dots:true}),
    check('password','password is required').isLength({min:6})

]