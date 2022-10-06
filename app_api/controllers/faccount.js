// const db = require("../models/db.js")
const mongoose = require('mongoose');
const Fma = mongoose.model('Fmaccount');


const acntListByMonth = (req, res) => {
    Fma.find({ cyear: req.body.cyear, cmonth: req.body.cmonth }, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        //console.log(rows);
        res
            .status(200)
            .json({
                "message": "success",
                "data": rows
            })

    });

};

const accountCreate = (req, res) => {
    const dd = Date.now() / 1000;
    //console.log(dd);
    Fma.create({
            buyer: req.body.buyer,
            itemName: req.body.itemName,
            price: req.body.price,
            memo: req.body.memo,
            cyear: req.body.cyear,
            cmonth: req.body.cmonth,
            cday: req.body.cday,
            timestamp: dd
        },
        (err, account) => {
            if (err) {
                console.log(err);
                res
                    .status(400)
                    .json(err);
            } else {
                res
                    .status(200)
                    .json({
                        "message": "Created",
                        "data": account
                    });
            }
        });

};

const accountReadOne = (req, res) => {
    Fma
        .findById(req.params.accountid)
        .exec((err, rows) => {
            if (!rows) {
                return res
                    .status(404)
                    .json({ "message": "account not found" });
            } else if (err) {
                return res
                    .status(404)
                    .json(err);
            } else {
                return res
                    .status(200)
                    .json(rows);
            }
        });
};

const accountUpdateOne = (req, res) => {
    if (!req.params.accountid) {
        return res
            .status(404)
            .json({
                "message": "accountid is required"
            });
    }
    Fma.findById(req.params.accountid)
        .exec((err, row) => {
            if (!row) {
                return res
                    .status(404)
                    .json({
                        "message": "accountid not found"
                    });
            } else if (err) {
                return res
                    .status(400)
                    .json(err);
            }
            row.itemName = req.body.itemName;
            row.price = req.body.price;
            row.memo = req.body.memo;
            row.cmonth = req.body.cmonth;
            row.cyear = req.body.cyear;
            row.cday = req.body.cday;
            row.save((err) => {
                if (err) {
                    res
                        .status(404)
                        .json(err);
                } else {
                    res
                        .status(200)
                        .json({
                            "message": "Updated",
                            "data": row
                        });
                }
            });
        });

};

const accountDeleteOne = (req, res) => {
    const { accountid } = req.params;
    if (accountid) {
        Fma
            .findByIdAndRemove(accountid)
            .exec((err) => {
                if (err) {
                    return res
                        .status(404)
                        .json({
                            "message": err
                        });
                }
                res
                    .status(204)
                    .json({
                        "message": "deleted"
                    });
            });
    } else {
        res
            .status(404)
            .json({
                "message": "No Account found"
            });
    }
};
module.exports = {
    acntListByMonth,
    accountCreate,
    accountReadOne,
    accountUpdateOne,
    accountDeleteOne
};