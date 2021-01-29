const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const MONGOURI = "mongodb://localhost:27017/transactionDB";

// Connect MongoDB at default port 27017.
let mong = mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}, (err) => {
    if (!err) {
        console.log('MongoDB Connection Succeeded.')
    } else {
        console.log('Error in DB connection: ' + err)
    }
});