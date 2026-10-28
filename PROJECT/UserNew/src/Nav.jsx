import React from 'react'
import { Link } from 'react-router-dom'
import "./assets/Nav.css";
const Nav = () => {
  return (
   <>
   <div className="Navbar">
        <div className="Navbar-Name">
            InternWin
        </div>
        <div className="Navbar-Menu">
            <Link to='/'>Home</Link>
            <Link to='/about'>About</Link>
             <Link to='/contact'>Contact</Link>
            <Link to='/domain'>Domain</Link>
            {/* <Link to='/feedback'>Feedback</Link> */}
        </div>
    

   
    <div className="Navbar-Button">
        <Link to='/login'><button className="Navbar-Button-Login">Login</button></Link>
       {/* <Link to='/sign'><button className="Navbar-Button-Signin">Sign Up</button></Link> */}
    </div>
    </div>
   </>
  )
}

export default Nav
