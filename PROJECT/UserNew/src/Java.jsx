import React from 'react'
import './assets/Java.css'
import { Link } from 'react-router-dom'

const Java = () => {
    
  return (
    <>
      
    
    <div className="Java">
        
           
            
         
            <div className="Java-Header">
                <h2 className="Java-Title">Full Stack in Java</h2>
                <p className="Java-Subtitle">Course Overview</p>
            </div>

          
            <div className="Java-Body">
                <div className="Section">
                    <h3 className="Backend-Title"> BACK END</h3>
                    <ul className="Java-Course-List">
                        <li>CORE JAVA + DSA</li>
                        <li>SQL / PLSQL</li>
                        <li>JDBC + MINI PROJECT</li>
                        <li>SPRING FRAMEWORK</li>
                        <li>MICROSERVICE</li>
                        <li>SPRING BOOT</li>
                        <li>SPRING WITH GEN AI</li>
                    </ul>
                </div>

             
                <div className="Section">
                    <h3 className="Frontend-Title"> FRONT END</h3>
                    <ul className="Java-Course-List">
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
                    <ul className="Java-Course-List ">
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
                    <ul className="Java-Course-List ">
                        <li>MOCK INTERVIEW</li>
                        <li>LEETCODE PRACTICE GUIDANCE</li>
                        <li>INDUSTRIAL GUIDE</li>
                        <li>LIVE PROJECT</li>
                        <li>LAB FACILITY</li>
                    </ul>
                </div>
            </div>

            
            <div className="Java-Footer">
                <Link to='/contact' state={{ targetDomain: 'Java' }}><button className="Java-Enroll-Button"  >Enroll Now </button></Link>
            </div>
        
    </div>

   
    </>

    
  )
}

export default Java
