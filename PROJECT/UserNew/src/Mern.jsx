import React from 'react'
import './assets/Mern.css'
import { Link } from 'react-router-dom'
const Mern = () => {
  return (
   <>
   <div className="MERN">
        
           
            
         
            <div className="MERN-Header">
                <h2 className="MERN-Title">Full Stack in MERN</h2>
                <p className="MERN-Subtitle">Course Overview</p>
            </div>

          
            <div className="MERN-Body">
                <div className="Section">
                    <h3 className="Backend-Title"> BACK END</h3>
                    <ul className="MERN-Course-List">
                        <li>JAVSCRIPT</li>
                        <li>NODE.JS </li>
                        <li>EXPRESS.JS</li>
                        <li>MONGODB</li>
                        <li>RESTFUL API</li>
                        <li>GRPAHIQL BASICS</li>
                        <li>AUTHENTICATION</li>
                    </ul>
                </div>

             
                <div className="Section">
                    <h3 className="Frontend-Title"> FRONT END</h3>
                    <ul className="MERN-Course-list">
                        <li>HTML</li>
                        <li>BOOTSTRAP + TAILWIND</li>
                        <li>REACT.JS</li>
                        <li>REDUX TOOLKIT</li>
                        <li>NEXT.JS BASICS</li>
                        <li>CSS</li>
                        <li>WORDPRESS</li>
                    </ul>
                </div>

                
                <div className="Section">
                    <h3 className="Aptitude-Title"> APTITUDE & SOFT SKILLS</h3>
                    <ul className="MERN-Course-list ">
                        <li>QUANTITIVE APTITUDE</li>
                        <li>LOGICAL REASONING</li>
                        <li>PUBLIC SPEAKING</li>
                        <li>ENGLISH COMMUNICATION</li>
                        <li>GD PREPARATION</li>
                        <li>HR MOCK</li>
                    </ul>
                </div>

               
                <div className="Section">
                    <h3 className="Placement-Title"> PLACEMENT PREPARATION</h3>
                    <ul className="MERN-Course-List ">
                        <li>MOCK INTERVIEW</li>
                        <li>LEETCODE PRACTICE GUIDANCE</li>
                        <li>INDUSTRIAL GUIDE</li>
                        <li>LIVE PROJECT</li>
                        <li>LAB FACILITY</li>
                    </ul>
                </div>
            </div>

            
            <div className="MERN-Footer">
                <Link to='/contact' state={{ targetDomain: 'Mern' }} ><button className="MERN-Enroll-Button" >Enroll Now </button></Link>
            </div>
        
    </div>
   </>
  )
}

export default Mern
