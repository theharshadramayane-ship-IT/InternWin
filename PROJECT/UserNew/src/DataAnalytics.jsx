import React from 'react'
import './assets/DataAnalytics.css'
import { Link } from 'react-router-dom'
const DataAnalytics = () => {
  return (
    <>
      
    
    <div className="DA">
        
           
            
         
            <div className="DA-Header">
                <h2 className="DA-Title">Full Stack in Data Analytics</h2>
                <p className="DA-Subtitle">Course Overview</p>
            </div>

          
            <div className="DA-Body">
                <div className="Section">
                    <h3 className="Backend-Title"> PART 1</h3>
                    <ul className="DA-Course-List">
                        <li>Python, Statistics, SQL, Excel</li>
                        <li>NumPy, Pandas </li>
                        <li>Machine Learning</li>
                        <li>Seaborn, Matplotlib, </li>
                        <li> EDA, Snowflake</li>
                        <li>SharePoint</li>
                        <li>AWS</li>  
                    </ul>
                </div>

             
                <div className="Section">
                    <h3 className="Frontend-Title"> PART 2</h3>
                    <ul className="DA-Course-List">
                        <li>Data Visualization & Wrangling</li>
                        <li>Basic Machine Learning</li>
                        <li>Data Cleaning</li>
                        <li>Tableau, </li>
                        <li>Basic Statistics with Python</li>
                        <li>Power BI</li> 
                        {/* <li>WEBSITE DESIGNING</li> */}
                    </ul>
                </div>

                
                <div className="Section">
                    <h3 className="Aptitude-Title"> APTITUDE & SOFT SKILLS</h3>
                    <ul className="DA-Course-List ">
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
                    <ul className="DA-Course-List ">
                        <li>MOCK INTERVIEW</li>
                        <li>LEETCODE PRACTICE GUIDANCE</li>
                        <li>INDUSTRIAL GUIDE</li>
                        <li>LIVE PROJECT</li>
                        <li>LAB FACILITY</li>
                    </ul>
                </div>
            </div>

            
            <div className="DA-Footer">
                <Link to='/contact' state={{ targetDomain: 'DataAnalytics' }}><button className="DA-Enroll-Button" >Enroll Now </button></Link>
            </div>
        
    </div>

   
    </>
  )
}

export default DataAnalytics
