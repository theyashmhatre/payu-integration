const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const cors = require("cors");
app.use(cors());
app.use(express.json());
var jsSHA = require("jssha");
var crypto = require('crypto');
const request = require('request');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const path = require('path');
const {nanoid} = require("nanoid");


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


    try {
        if (!req.body.amount || !req.body.firstname || !req.body.email)
            {res.status(400).json({ msg: "Mandatory fields missing" }).end();
            throw new Error('Mandatory fields missing');
        }

        console.log(req.body);

        let key = 'BC50nb';
        let salt = 'Bwxo1cPe';
        let child_mid = req.body.childId;
        let txnid = 'txn' + Math.round(Math.random(0, 1000) * 100000 + 1);
        let amount = req.body.amount;
        let commission = req.body.commission;
        let value = amount - commission;
        let productinfo = '{"paymentParts":[{"name":"splitId1","merchantId":"' + child_mid + '","value":"'+ value +'","commission":"'+ commission+'","description":"split description"}]}';
        let firstname = req.body.firstname;
        let email = req.body.email;
        let phone = req.body.phone;
        let service_provider = 'payu_paisa';

        //calculates the hash
        let hash_string = key + "|" + txnid + "|" + amount + "|" + productinfo + "|" + firstname + "|" + email + "|||||||||||" + salt;
        var cryp = crypto.createHash('sha512');
        cryp.update(hash_string);
        var hash = cryp.digest('hex');

        //adding additional parameters
        let hashValue = hash;
        let surl = process.env.PORT ? "https://tranquil-chamber-38154.herokuapp.com/payment/success" : "http://localhost:4000/payment/success";
        let furl = process.env.PORT ? "https://tranquil-chamber-38154.herokuapp.com/payment/fail" : "http://localhost:4000/payment/fail";
        
        const url = "https://test.payu.in/_payment";

        const data = {
            txnid : txnid,
            amount : amount,
            productinfo : productinfo,
            firstname: firstname,
            email: email,
            phone: phone,
            key: key,
            salt: salt,
            hash: hashValue,
            surl : surl,
            furl: furl,
            service_provider: service_provider
        };

        console.log(data);

        request.post({
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            uri: url, //Testing url
            form: data,
        }, function (error, httpRes, body) {
            if (error) {
                console.log("Error", error);
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
                res.redirect(httpRes.headers.location.toString());  // redirects to the payment url after 302 code
                console.log(httpRes.statusCode, httpRes.headers.location.toString());
                console.log("error 300 and 400");
            }
        });
    } catch (err) {
        console.log(err);
    }     
});


app.post('/payment/success', urlencodedParser, (req, res) => {
    //Payumoney will send Success Transaction data to req body. 
    // Based on the response Implement UI as per you want
    console.log("success executed", req.body);

    let key = 'BC50nb';
    let salt = 'Bwxo1cPe';
    let txnid = req.body.txnid;
    let amount = req.body.amount;
    let productinfo = req.body.productinfo;
    let firstname = req.body.firstname;
    let email = req.body.email;
    let status = req.body.status;

    var hashString = salt + '|' + status + '|' + '||||||||||' + email + '|' + firstname + '|' + productinfo + '|' + amount + '|' + txnid + '|' + key;

    console.log(hashString);
    var cryp = crypto.createHash('sha512');
    cryp.update(hashString);
    var hash = cryp.digest('hex');


    //checking if the two hashes are equal. and then completing the txn. else, cancel it.
    if (req.body.hash === hash) { console.log("hash values matched!");  }
    else { console.log("values didnt match!!!", req.body.hash, hash); }

    res.send(req.body);
});




app.post('/api/verifyHash', urlencodedParser, (req,res) => {
    console.log("success executed", req.body);

    let key = 'BC50nb';
    let salt = 'Bwxo1cPe';
    let txnid = req.body.txnid;
    let amount = req.body.amount;
    let productinfo = req.body.productinfo;
    let firstname = req.body.firstname;
    let email = req.body.email;
    let status = req.body.status;

    var hashString = salt + '|' + status + '|' + '||||||||||' + email + '|' + firstname + '|' + productinfo + '|' + amount + '|' + txnid + '|' + key;

    console.log(hashString);
    var cryp = crypto.createHash('sha512');
    cryp.update(hashString);
    var hash = cryp.digest('hex');

    if (req.body.hash === hash) { console.log("hash values matched!"); res.send("hurray!!!"); }
    else { console.log("values didnt match!!!", req.body.hash, hash); res.send("bad luck!"); }
});


app.post('/payment/fail', urlencodedParser , (req, res) => {
    //Payumoney will send Fail Transaction data to req body. 
    // Based on the response Implement UI as per you want
    res.send(req.body);
    console.log("failure executed", req.body);
})


app.use(express.static(path.join(__dirname, './build')));
app.use(express.static(path.join(__dirname, './public')));

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, './build', 'index.html'));
});

app.use('*', (req, res) => {
    res.status(404).json({ msg: 'Not Found' });
});


app.listen(PORT, () => console.log(`The server has started on port: ${PORT}`));