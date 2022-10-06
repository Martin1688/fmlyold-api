const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");


const auth = (req, res, next) => {
    //console.log(req.headers.authorization);
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        jwt.verify(req.headers.authorization.split(' ')[1], process.env.API_SECRET, function (err, decode) {
            if (decode)
                console.log(decode);
            next();
        });
    }

};

// const jwt = require('express-jwt');
// const auth = jwt({
//     secret: process.env.JWT_SECRET,
//     userProperty: 'payload'
// });
const ctrlFmlyaccount = require('../controllers/faccount');
const ctrlAuth = require('../controllers/authentication');
const ctrlPara = require('../controllers/paras');
const ctrlBackup = require('../controllers/dbbackup');

router
    .route('/fmaccount')
    .post(auth, ctrlFmlyaccount.accountCreate)
    .patch(auth, ctrlFmlyaccount.acntListByMonth);

router
    .route('/fmaccount/:accountid')
    .get(ctrlFmlyaccount.accountReadOne)
    .put(auth, ctrlFmlyaccount.accountUpdateOne)
    .delete(auth, ctrlFmlyaccount.accountDeleteOne);

router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
//router.post('/isuser', ctrlAuth.isuser);

router.get('/paras/:paratype', ctrlPara.parasByType);
router.route('/paras')
    .patch(auth, ctrlPara.parasByName)
    .post(auth, ctrlPara.paraCreate);

router.route('/paras/:paraid')
    .delete(auth, ctrlPara.paraDeleteOne);

router.route('/readdb').post(auth,ctrlBackup.backupAll);    
router.route('/restoreddb').post(auth,ctrlBackup.restoredAll);    

module.exports = router;