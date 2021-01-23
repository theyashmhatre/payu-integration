const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const cors = require("cors");
app.use(cors());
app.use(express.json());
var jsSHA = require("jssha");
const request = require('request');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const path = require('path');

// returns the calculated hash value
app.post("/api/get-hash",(req,res) => {
    console.log("get hash executed");
    console.log(req.body);
    var pd = req.body;

    var hashString = pd.key + '|' + pd.txnid + '|' + pd.amount + '|' + pd.productinfo + '|'+ pd.firstname + '|' + pd.email + '|' + '||||||||||' + pd.salt; // Your salt value
    var sha = new jsSHA('SHA-512', "TEXT");
    sha.update(hashString);
    var hash = sha.getHash("HEX");
    res.status(200).json({ 'hash': hash });
    console.log(hash);
});


//sends a post request to the test payumoney url. 
app.post("/api/payumoney", urlencodedParser, (req,res) => {
    console.log(" payu response Executed");
    const key = "tXjTgO";
    const salt = "QYcSzlbk";

    // if (!req.body.txnid || !req.body.amount || !req.body.productinfo || !req.body.firstname || !req.body.email) {
    //     res.status(400).json("Mandatory fields missing");
    // }
    var pd = JSON.parse(JSON.stringify(req.body));

    var hashString = key + '|' + pd.txnid + '|' + pd.amount + '|' + pd.productinfo + '|' + pd.firstname + '|' + pd.email + '|' + '||||||||||' + salt; // Your salt value
    var sha = new jsSHA('SHA-512', "TEXT"); 
    sha.update(hashString); 
    var hash = sha.getHash("HEX");
    pd.key = key;
    pd.salt = salt;
    pd.hash = hash;
    console.log(pd);

    request.post({
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        url: 'https://sandboxsecure.payu.in/_payment', //Testing url
        form: pd,
    }, function (error, httpRes, body) {
        if (error){
            console.log("Error",error);
            res.status(400).json(
                {
                    status: false,
                    message: error
                }
            );
        }
        if (httpRes.statusCode === 200) {
            res.send(body);
        } else if (httpRes.statusCode >= 300 &&
            httpRes.statusCode <= 400) {
            res.redirect(httpRes.headers.location.toString());
            console.log("error 300 and 400");
        }
    })
})


app.post('/payment/success', (req, res) => {
    //Payumoney will send Success Transaction data to req body. 
    // Based on the response Implement UI as per you want
    console.log("success executed", req.body);
    res.send(req.body);
});


app.post('/payment/fail', (req, res) => {
    //Payumoney will send Fail Transaction data to req body. 
    // Based on the response Implement UI as per you want
    res.send(req.body);
    console.log("failure executed", req.body);
})


app.use(express.static(path.join(__dirname, 'client/build')));
app.use(express.static(path.join(__dirname, 'client/public')));

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.use('*', (req, res) => {
    res.status(404).json({ msg: 'Not Found' });
});


app.listen(PORT, () => console.log(`The server has started on port: ${PORT}`));