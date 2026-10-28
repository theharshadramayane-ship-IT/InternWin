import React from 'react'
import './assets/Mean.css'
import { Link } from 'react-router-dom'
const MEAN = () => {
  return (
   <>
   <div className="MEAN">
        
           
            
         
            <div className="MEAN-Header">
                <h2 className="MEAN-Title">Full Stack in MEAN</h2>
                <p className="MEAN-Subtitle">Course Overview</p>
            </div>

          
            <div className="MEAN-Body">
                <div className="Section">
                    <h3 className="Backend-Title"> BACK END</h3>
                    <ul className="MEAN-Course-List">
                        <li>TYPESCRIPT</li>
                        <li>NODE.JS </li>
                        <li>EXPRESS.JS</li>
                        <li>MONGODB</li>
                        <li>RESTFUL API</li>
                        <li>API SECURITY</li>
                        <li>DEPLOYMENT</li>
                    </ul>
                </div>

             
                <div className="Section">
                    <h3 className="Frontend-Title"> FRONT END</h3>
                    <ul className="MEAN-Course-list">
                        <li>HTML</li>
                        <li>BOOTSTRAP + TAILWIND</li>
                        <li>ANGULAR.JS</li>
                        <li>NGRX STATE MANAGEMENT</li>
                        <li>ANGULAR MATERIAL</li>
                        <li>CSS</li>
                        <li>WORDPRESS</li>
                    </ul>
                </div>

                
                <div className="Section">
                    <h3 className="Aptitude-Title"> APTITUDE & SOFT SKILLS</h3>
                    <ul className="MEAN-Course-list ">
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
                    <ul className="MEAN-Course-List ">
                        <li>MOCK INTERVIEW</li>
                        <li>LEETCODE PRACTICE GUIDANCE</li>
                        <li>INDUSTRIAL GUIDE</li>
                        <li>LIVE PROJECT</li>
                        <li>LAB FACILITY</li>
                    </ul>
                </div>
            </div>

            
            <div className="MEAN-Footer">
               <Link to='/contact' state={{ targetDomain: 'Mean' }}><button className="MEAN-Enroll-Button" >Enroll Now </button></Link>
            </div>
        
    </div>
   </>
  )
}

export default MEAN
