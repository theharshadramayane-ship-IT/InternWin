import React from 'react'
import './assets/Signin.css'
import { Link } from 'react-router-dom'
const Signin = () => {
  return (
   <>
   
   <div className="Sign-Form">
        <h2  className="Sign-Form-Heading">InternWin</h2>
        <form  className="Sign-Form-Main">
            <label className="Sign-Form-Label" >Name : </label>
            <input className="Sign-Form-Input" id="name" type="text" placeholder="FirstName MiddleName LastName" />

            <label className="Sign-Form-Label" >Aadhar Number : </label>
            <input className="Sign-Form-Input" id="aadhar" type="number" placeholder="Enter your 12 digits Aadhar Number"  maxlength="12"/>

            <label className="Sign-Form-Label" >Mobile Number : </label>
            <input className="Sign-Form-Input" id="mobile" type="number" placeholder="Enter your 10 digit mobile number"  maxlength="10"/>
 
            <label className="Sign-Form-Label" >Email : </label>
            <input className="Sign-Form-Input" id="mail" type="email" placeholder="Enter your email" />

            <label className="Sign-Form-Label" >Password : </label>
            <input className="Sign-Form-Input" id="pass" type="password" placeholder="Enter your password" />

            <label className="Sign-Form-Label" >Confirm Password : </label>
            <input className="Sign-Form-Input" id="pass1" type="password" placeholder="Re-enter your password" />

            <Link t0='/login'><button className="Sign-Form-Button" type="submit">Submit</button></Link>
        </form>
    </div>

   </>
  )
}

export default Signin
