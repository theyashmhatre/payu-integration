import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import axios from 'axios';

function App() {


  const [formValue, setFormValue] = useState({
    firstname :"",
    lastname: "mhatre",
    txnid :"",
    key: "tXjTgO",
    salt: "QYcSzlbk",
    amount: "",
    productinfo: "",
    email: "",
    phone: "",
    hash: "",
    surl: 'http://localhost:4000/payment/success',
    furl: 'http://localhost:4000/payment/fail',
  });

  function handleChange(event) {
    const value = event.target.value;
    setFormValue({
      ...formValue,
      [event.target.name]: value
    });
    console.log(formValue);
  }

  function redirectToPayU(pd) {
    console.log("redirectToPayu executed");
    console.log(pd);
    fetch("http://localhost:4000/api/payumoney", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pd)
    }).then((a)=> {
      console.log("A", a);
      return a.json();
    })
  }

  

  function handleClick(e) {
    // e.preventDefault();
    console.log("hadleclickexecuted");
    var pd = {
      key: formValue.key,
      salt: formValue.salt,
      txnid: formValue.txnid,
      amount: formValue.amount,
      firstname: formValue.firstname,
      lastname: formValue.lastname,
      email: formValue.email,
      phone: formValue.phone,
      productinfo: formValue.productinfo,
      service_provider: formValue.service_provider,
      surl: formValue.surl,
      furl: formValue.furl,
      hash: ''
    };

    // let data = {
    //   'txnid': formValue.txnid,
    //   'email': formValue.email,
    //   'amount': formValue.amount,
    //   'productinfo': formValue.productinfo,
    //   'firstname': formValue.firstname,
    //   'salt' : formValue.salt,
    // };

    console.log("pd",pd);
    

    axios.post("/api/payumoney",pd)
    .then((res)=> {
      console.log(res);
    }).catch((error)=>{
      console.log(error);
    });
  }


  return (
    <div className="App">

{/* we're directly sending the form data to test url. works fine. figure out a way to send the data to http://localhost:4000/api/payumoney */}
      <form action="/api/payumoney" method="POST">
        <label>
          FirstName:
          <input type="text" name="firstname" onChange={handleChange} value={formValue.firstname} />
        </label>
        <label>
          TxnID:
          <input type="text" name="txnid" onChange={handleChange} value={formValue.txnid} />
        </label>
        <label>
          Amount:
          <input type="text" name="amount" onChange={handleChange} value={formValue.amount} />
        </label>
        <label>
          ProductInfo:
          <input type="text" name="productinfo" onChange={handleChange} value={formValue.productinfo} />
        </label>
        <label>
          Email:
          <input type="email" name="email" onChange={handleChange} value={formValue.email} />
        </label>
        <label>
          Phone:
          <input type="text" name="phone" onChange={handleChange} value={formValue.phone} />
        </label>
        {/* <label>
          Hash:
          <input type="text" name="hash" onChange={handleChange} value={formValue.hash} />
        </label>
        <input type="hidden" id="key" name="key" value="tXjTgO"></input>
        <input type="hidden" id="salt" name="salt" value="QYcSzlbk"></input> */}
        <input type="hidden" id="surl" name="surl" value="/payment/success"></input>
        <input type="hidden" id="furl" name="furl" value="/payment/fail"></input>
        <input type="hidden" id="lastname" name="lastname" value="mhatre"></input>

        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default App;
