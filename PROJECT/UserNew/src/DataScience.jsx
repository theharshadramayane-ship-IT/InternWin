import React from 'react'
import './assets/DataScience.css'
import { Link } from 'react-router-dom'
const DataScience = () => {
  return (
    <>
    <div className="DS">
        
           
            
         
            <div className="DS-Header">
                <h2 className="DS-Title"> Data Science</h2>
                <p className="DS-Subtitle">Course Overview</p>
            </div>

          
            <div className="DS-Body">
                <div className="Section">
                    <h3 className="Backend-Title"> PART 1</h3>
                    <ul className="DS-Course-List">
                        <li>Linear Algebra , Calculus</li>
                        <li>Python</li>
                        <li>Machine Learning</li>
                        <li>Seaborn, Matplotlib, </li>
                        <li>NumPy, PanDSs </li>
                        <li>SQL</li>
                        <li>Statistics and Probability</li>  
                    </ul>
                </div>

             
                <div className="Section">
                    <h3 className="Frontend-Title"> PART 2</h3>
                    <ul className="DS-Course-List">
                        <li>Data Visualization</li>
                        <li>EDA</li>
                        <li>Neural Networks</li>
                        <li>MLOPS </li>
                        <li>Cloud Platforms</li>
                        <li>Power BI</li> 
                        {/* <li>WEBSITE DESIGNING</li> */}
                    </ul>
                </div>

                
                <div className="Section">
                    <h3 className="Aptitude-Title"> APTITUDE & SOFT SKILLS</h3>
                    <ul className="DS-Course-List ">
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
                    <ul className="DS-Course-List ">
                        <li>MOCK INTERVIEW</li>
                        <li>LEETCODE PRACTICE GUIDSNCE</li>
                        <li>INDUSTRIAL GUIDE</li>
                        <li>LIVE PROJECT</li>
                        <li>LAB FACILITY</li>
                    </ul>
                </div>
            </div>

            
            <div className="DS-Footer">
                <Link to='/contact' state={{ targetDomain: 'DataScience' }}><button className="DS-Enroll-Button" >Enroll Now </button></Link>
            </div>
        
    </div>
    </>
  )
}

export default DataScience
