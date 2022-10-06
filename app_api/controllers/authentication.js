const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');
//var User = require('../models/user');

const register = (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.password) {
        return res
            .status(400)
            .json({ "message": "全部欄位都必填" });
    }

    const user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    //console.log(req.body.password);
    // res.status('304').json('fromMartin');
    user.setPassword(req.body.password);
    user.save((err) => {
        if (err) {
            res
                .status(401)
                .json(err);
        } else {
            const token = user.generateJwt();
            res
                .status(200)
                .json({ token });
        }
    })
};

const login = (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res
            .status(400)
            .json({ "message": "全部欄位都必填" });
    }
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res
                .status(404)
                .json(err);
        }
        if (user) {
            const token = user.generateJwt();
            res
                .status(200)
                .json({ token });
        } else if (info.message === 'badpassword') {
            res
                .status(402)
                .json(info);
        } else {
            console.log(info.message);
            res
                .status(401)
                .json(info);
        }
    })(req, res);
};

// const isuser = (req, res) => {
//     //console.log(req.body.name);
//     if (!req.body.name) {
//         return res
//             .status(400)
//             .json({ "message": "帳號欄位必填" });
//     } else {
//         User.isUserExist(req.body.name, (done, message) => {
//             res.status(200).json(done);
//         });
//     }
// }

module.exports = {
    register,
    login
    //,isuser
};