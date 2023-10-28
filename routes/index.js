var express = require('express');
var router = express.Router();
const multer = require('multer')

const PaymentControllers = require('../controller/PaymentController')

const loginController = require('../controller/LoginController')

const Auth = require('../middleware/auth')

/* GET home page. */

var storage = multer.diskStorage({
  destination:(req , file , cb)=>{
    cb(null, './public/csv');
  },
  filename:(req, file,cb)=>{
    cb(null,file.originalname)
  }
})

const csvupload = multer({storage:storage});

router.post('/PaymentCreate',Auth.is_login,PaymentControllers.PaymentCreate);
router.post('/PaymentImoprtCSV',csvupload.single('csv'),PaymentControllers.PaymentImoprtCSV);
router.get('/signin',Auth.is_logout, function(req, res, next) {
  res.render('login/signin', { title: 'Express' });
});
router.get('/',Auth.is_logout,loginController.loginpage);
router.post('/login',Auth.is_logout,loginController.login);
router.post('/signin',Auth.is_logout,loginController.adminCreate);
router.get('/dashboard',Auth.is_login,PaymentControllers.dashboard) 
router.post('/csvDownlload',Auth.is_login,PaymentControllers.csvDownloaded) 



router.get('/addPayment', Auth.is_login, PaymentControllers.paymentadd);
router.get('/SuccessPayment',Auth.is_login,PaymentControllers.PaymentSuccess);
router.get('/FailPayment',Auth.is_login,PaymentControllers.FailPayment);


router.get('/logout',Auth.is_login,loginController.logout);


module.exports = router;
