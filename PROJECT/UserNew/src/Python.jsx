import React from 'react'
import './assets/Python.css'
import { Link } from 'react-router-dom'
const Python = () => {
  return (
    <>
<div className="Python">
        
           
            
         
            <div className="Python-Header">
                <h2 className="Python-Title">Full Stack in Python</h2>
                <p className="Python-Subtitle">Course Overview</p>
            </div>

          
            <div className="Python-Body" >
                <div className="Section">
                    <h3 className="Backend-Title"> BACK END</h3>
                    <ul className="Python-Course-List">
                        <li>CORE PYTHON + DSA</li>
                        <li>SQL </li>
                        <li>MINI PROJECT</li>
                        <li>ORACLE</li>
                        <li>MODULES</li>
                        <li>DJANGO</li>
                        <li>LIBRARIES</li>
                    </ul>
                </div>

             
                <div className="Section">
                    <h3 className="Frontend-Title"> FRONT END</h3>
                    <ul className="Python-Course-list">
                        <li>HTML + CSS</li>
                        <li>BOOTSTRAP + TAILWIND</li>
                        <li>JAVASCRIPT</li>
                        <li>ANGULAR</li>
                        <li>WORDPRESS</li>
                        <li>REACT + REDUX + NEXT JS</li>
                        <li>WEBSITE DESIGNING</li>
                    </ul>
                </div>

                
                <div className="Section">
                    <h3 className="Aptitude-Title"> APTITUDE & SOFT SKILLS</h3>
                    <ul className="Python-Course-list ">
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
                    <ul className="Python-Course-List ">
                        <li>MOCK INTERVIEW</li>
                        <li>LEETCODE PRACTICE GUIDANCE</li>
                        <li>INDUSTRIAL GUIDE</li>
                        <li>LIVE PROJECT</li>
                        <li>LAB FACILITY</li>
                    </ul>
                </div>
            </div>

            
            <div className="Python-Footer">
                <Link to='/contact' state={{ targetDomain: 'Python' }}><button className="Python-Enroll-Button" >Enroll Now </button></Link>
            </div>
        
    </div>

    </>
  )
}

export default Python
