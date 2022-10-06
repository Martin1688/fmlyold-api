const mongoose = require('mongoose');

const fmaccountSchema = new mongoose.Schema({
    buyer: {
        type: String,
        required: true
    },
    itemName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    memo: String,
    cyear: {
        type: String,
        required: true
    },
    cmonth: {
        type: String,
        required: true
    },
    cday: {
        type: String,
        required: true
    },
    timestamp: {
        type: Number,
        required: true
    }
});

const newLocal = 'Fmaccount';
mongoose.model(newLocal, fmaccountSchema);