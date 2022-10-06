const mongoose = require('mongoose');
const User = mongoose.model('User');
const Fma = mongoose.model('Fmaccount');
const Paras = mongoose.model('Paras');

let dbData = {
    "message": "success",
    "data": {
        users: [],
        paras: [],
        fmaccount: []
    }
}
const backupAll = (req, res) => {
    if (req.body.name !== 'Martin') {
        dbData.message = '資格不符';
        res.status(400).json(dbData);
        return;
    }
    User.find({ email: req.body.email }, (err, rows) => {
        if (err) {
            dbData.message = '資格不符';
            res.status(400).json(dbData);
            return;
        }
        if (rows) {
            User.find({}, (err1, users) => {
                if (err1) {
                    res.status(400).json({ "error": err1.message });
                    return;
                }
                if (users) {
                    dbData.data.users = users;
                }
                Paras.find({}, (err2, paras) => {
                    if (err2) {
                        dbData.message + 'Paras error;' + err2.message;
                    }
                    if (paras) {
                        dbData.data.paras = paras;
                    }
                    Fma.find({}, (err3, families) => {
                        if (err3) {
                            dbData.message + 'families error;' + err3.message;
                        }
                        if (families) {
                            dbData.data.fmaccount = families;
                            res.status(200)
                                .json(dbData);
                        } else {
                            dbData.message;
                            res.status(200)
                                .json(dbData);

                        }
                    });
                });

            });
        } else {
            dbData.message = '資格不符';
            res.status(400).json(dbData);

        }
    })
}

const restoredAll = (req, res) => {
    console.log(req.body.coname);
    if (req.body.coname === 'fmaccount') {
        RestoredFmaccount(req, res);
    } else if (req.body.coname === 'paras') {
        RestoredParas(req, res);
    } else if (req.body.coname === 'users') {
        RestoredUsers(req, res);
    }
    // console.log(req.body.coname);
    // console.log(req.body.ary);
}

const RestoredParas = (req, res) => {
    const para = req.body.obj;
    console.log(para);
    Paras.findById(para._id).exec((err, row) => {
        if (!row) {
            Paras.create({
                paraType: para.paraType,
                paraName: para.paraName,
                paraText: para.paraText,
                paraNo: paraNo,
                paraMemo: paraMemo
            },
                (err, account) => {
                    if (err) {
                        res.status(400)
                            .json({ message: 'failed', data: { idx: req.body.index, ans: err } });
                    } else if (account) {
                        res.status(200)
                            .json({ message: 'success', data: { idx: req.body.index, ans: 'created' } });
                    }
                });
        } else {
            res.status(200)
                .json({ message: 'success', data: { idx: req.body.index, ans: 'pass' } });
        }
    })
}



const RestoredUsers = (req, res) => {
    const user = req.body.obj;
    console.log(user);
    User.findById(user._id).exec((err, row) => {
        if (!row) {
            User.create({
                email: user.email,
                name: user.name,
                hash: user.hash,
                salt: user.salt
            },
                (err, account) => {
                    if (err) {
                        res.status(400)
                            .json({ message: 'failed', data: { idx: req.body.index, ans: err } });
                    } else if (account) {
                        res.status(200)
                            .json({ message: 'success', data: { idx: req.body.index, ans: 'created' } });
                    }
                });
        } else {
            res.status(200)
                .json({ message: 'success', data: { idx: req.body.index, ans: 'pass' } });
        }
    });
}

const RestoredFmaccount = (req, res) => {
    const fmaccount = req.body.obj;
    Fma.findById(fmaccount._id).exec((err, row) => {
        if (!row) {
            Fma.create({
                buyer: fmaccount.buyer,
                itemName: fmaccount.itemName,
                price: fmaccount.price,
                memo: fmaccount.memo,
                cyear: fmaccount.cyear,
                cmonth: fmaccount.cmonth,
                cday: fmaccount.cday,
                timestamp: fmaccount.timestamp
            },
                (err, account) => {
                    if (err) {
                        res.status(400)
                            .json({ message: 'failed', data: { idx: req.body.index, ans: err } });
                    } else if (account) {
                        res.status(200)
                            .json({ message: 'success', data: { idx: req.body.index, ans: 'created' } });
                    }
                });
        } else {
            res.status(200)
                .json({ message: 'success', data: { idx: req.body.index, ans: 'pass' } });
        }
    });

}

module.exports = {
    backupAll,
    restoredAll
};