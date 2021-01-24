import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

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


  return (
    <div className="App">

{/* we're directly sending the form data to test url. works fine. figure out a way to send the data to http://localhost:4000/api/payumoney */}
      <form action="api/payumoney" method="POST">
        <label>
          FirstName:
          <input type="text" name="firstname" onChange={handleChange} value={formValue.firstname} />
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
        <input type="hidden" id="lastname" name="lastname" value="mhatre"></input>

        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default App;
