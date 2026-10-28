import React from 'react'
import './assets/Aws.css'
import { Link } from 'react-router-dom'
const Aws = () => {
  return (
    <>
    <div className="AWS">
        
           
            
         
            <div className="AWS-Header">
                <h2 className="AWS-Title">AWS Cloud</h2>
                <p className="AWS-Subtitle">Course Overview</p>
            </div>

          
            <div className="AWS-Body">
                <div className="Section">
                    <h3 className="Backend-Title">AWS CLoud</h3>
                    <ul className="AWS-Course-List">
                        <li>Cloud Fundamentals</li>
                        <li>CLoud Setup & Types of Cloud </li>
                        <li>AWS Global Structure </li>
                        <li>EC2,S3, IAM, VPC, Route 53, RDS</li>
                        <li>Linux Commands</li>
                        <li>Server Management</li>
                        <li>IP Addressing & Security Groups</li>
                    </ul>
                </div>

             
                <div className="Section">
                    <h3 className="Frontend-Title">DevOps & Cloud Security</h3>
                    <ul className="AWS-Course-list">
                        <li>Git & GitHub</li>
                        <li>CI/CD Basics</li>
                        <li>Docker Introduction</li>
                        <li>Jenkins Basics</li>
                        <li>IAM Policies & MFA</li>
                        <li>Security Basics and Practices</li>
                        <li>Backup & Recovery</li>
                    </ul>
                </div>

                
                <div className="Section">
                    <h3 className="Aptitude-Title"> APTITUDE & SOFT SKILLS</h3>
                    <ul className="AWS-Course-list ">
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
                    <ul className="AWS-Course-List ">
                        <li>MOCK INTERVIEW</li>
                        <li>LEETCODE PRACTICE GUIDANCE</li>
                        <li>INDUSTRIAL GUIDE</li>
                        <li>LIVE PROJECT</li>
                        <li>LAB FACILITY</li>
                    </ul>
                </div>
            </div>

            
            <div className="AWS-Footer">
                <Link to='/contact' state={{ targetDomain: 'Cloud' }}><button className="AWS-Enroll-Button" >Enroll Now </button></Link>
            </div>
        
    </div>
    </>
  )
}

export default Aws
