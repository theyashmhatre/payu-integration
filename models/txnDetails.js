const mongoose = require('mongoose');

const ResponseInfo = mongoose.model('ResponseInfo', {
    mode: String,
    key: String,
    status: String,
    amount: Number,
    productinfo: {
        paymentParts: [{
            name: String,
            merchantId: String,
            value: String,
            commission: String,
            description: String
        }]
    },
    firstname: String,
    email: String,
    PG_TYPE: String,
    bank_ref_num: Number,
    payuMoneyId: {
        paymentId: {
            type: Number
        },
        splitIdMap: [{
            amount: Number,
            splitPaymentId: Number,
            merchantId: Number,
            splitId: String
        }]
    },
    mihpayid: Number,
    cardnum: String,
    lastname: String,
    phone: String,
    additionalCharges:String,
});

module.exports = ResponseInfo;