import React from 'react'
import './assets/Footer.css'
import { Link } from 'react-router-dom'
import { FaInstagram } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io5";
import { CiTwitter } from "react-icons/ci";
import { FaLinkedin } from "react-icons/fa";
const Footer = props => {
  return (
    <>
     <div className="Footer">

        
        <div className="Footer-Container">

            <div className="Footer-Box">
                <h3>InternWin</h3>
                <p>Your Partner in building a successful tech career</p>
            </div>

            <div className="Footer-Box">
                <h2>Domain we offer</h2>
                <ul>
                    <li><Link to='/domain/java'>Full Stack in Java</Link></li>
                    <li><Link to='/domain/python'>Full Stack in Python</Link></li>
                    <li><Link to='/domain/mern'>MERN Stack</Link></li>
                    <li><Link to='/domain/mean'>MEAN Stack</Link></li>
                   
                    <li><Link to='/domain/datascience'>Data Science</Link></li>
                    <li><Link to='/domain/dataanalytics'>Data Analytics</Link></li>
                    <li><Link to='/domain/aws'>AWS Cloud</Link></li>
                </ul>
            </div>

            <div className="Footer-Box">
                <h2>Quick Links</h2>
                <ul>
                    <li><Link to='/'>Home</Link></li> 
            <li><Link to='/about'>About</Link></li>
             <li><Link to='/contact'>Contact</Link></li>
           <li> <Link to='/domain'>Domain</Link></li>
            {/* <li><Link to='/feedback'>feedback</Link></li> */}
                </ul>
            </div>

            <div className="Footer-Box">
                <h2>Follow Us</h2>
                <div className="social-icons">
                  <FaInstagram className='SI1'/>
                  <IoLogoWhatsapp className='SI2' />
                  <CiTwitter className='SI3'/>
                  <FaLinkedin className='SI4'/>
                </div>
            </div>
            </div>
                <div className="Footer-Bottom">
                @2026 InternWin All Rights Reserved.
            </div>
            </div>
    </>
  )
}


export default Footer
