import React from 'react'
import './assets/Home.css'
import { Link } from 'react-router-dom'
import { FaUnlockAlt } from "react-icons/fa";
import { MdOnDeviceTraining } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { FaIndustry } from "react-icons/fa";
import { GrProjects } from "react-icons/gr";
import { MdOutlineLaptopChromebook } from "react-icons/md";
import { FaRegNewspaper } from "react-icons/fa";
const Home = () => {
    return (
        <>
            <div className="Home-Bg-Image">
                <div className="Home-Bg-Image-Overlay">
                    <h1 className="Home-Bg-Image-Logo">InternWin</h1>

                    <h2 className="Home-Bg-Image-Heading">
                        Build Your Career With Real Training Program.
                    </h2>

                    <p className="Home-Bg-Image-Subtitle">
                        InternWin connects students with industry-ready internships,
                        live sessions, tasks, mentorship and real project experience.
                    </p>

                    <div className="Home-Bg-Image-Buttons">
                        <Link to='/domain' ><button className="Home-Bg-Image-Apply">Training Program</button></Link>
                        <Link to='/login'><button className="Home-Bg-Image-Login">Student Login</button></Link>
                    </div>
                </div>
            </div>
            <br />
            <br />


            <div className='Home-Card1'>
                <p className='Home-Card1-p1'>Your Path To Success</p>
                <p className='Home-Card1-p2'>Whether you are looking for your next role or your next hire, InternWin makes the process simple and effective.</p>

            </div>
            <br />
            <br />
            <br />
            <div className="Home-Card2">
                <div className="Home-Card2-C1">
                    <div className="Home-Demo">
                        <CgProfile />
                    </div>
                    <p>1. Create Your Profile</p>
                    <ul>
                        <li>Build your professional identity and showcase your skills.</li>
                        <li>Create a strong profile that helps recruiters discover your talent faster.</li>
                        <li>Take the first step toward your career journey with a powerful digital presence.</li>
                    </ul>
                </div>
                <div className="Home-Card2-C2">
                    <div className="Home-Demo"><MdOnDeviceTraining /></div>
                    <p>2. Start Training with us</p>
                    <ul>
                        <li>Learn industry-ready skills through guided training programs and real-world projects.</li>
                        <li>Gain practical experience, expert mentorship, and confidence to succeed in your career.</li>
                        <li>Upgrade your knowledge and prepare yourself for future opportunities.</li>
                    </ul>
                </div>
                <div className="Home-Card2-C3">
                    <div className="Home-Demo"><FaUnlockAlt /></div>
                    <p>3. Unlock the Best Oppurtunity </p>
                    <ul>
                        <li>Get access to internships, projects, and career opportunities tailored for you.</li>
                        <li>Connect with companies looking for passionate and skilled candidates.</li>
                        <li>Turn your learning into real career growth and achieve your professional goals.</li>
                    </ul>
                </div>

                <br />
                <br />
            </div>
            <div className='Home-Card4'>
                <p className='Home-Card41'>Ready to Take the Next Step?</p>
                <p className='Home-Card42'>Whether you are searching for Dream Job, or Dream Team, InternWin connects the Right People with Right Oppurtunities</p>

            </div>

            <br />
            <br />

            <p className='Home-Card3-P' >Why Choose InternWin??</p>
            <div className='Home-Card3'>
                <div className='Home-Card3-Card'>
                    <div className='Home-Card3-Card-Logo'> <FaIndustry /></div>
                    <p>
                        Provides training based on current industry technologies real company workflows,
                        helping students gain practical knowledge that matches modern job requirements.
                    </p>
                </div>
                <div className='Home-Card3-Card'>
                     <div className='Home-Card3-Card-Logo'><GrProjects /></div>
                    <p>
                        InternWin help students work on live and real-world projects during internships,
                        allowing them to build hands-on experience and improve problem-solving abilities
                    </p>
                </div>
                <div className='Home-Card3-Card'>
                     <div className='Home-Card3-Card-Logo'><FaRegNewspaper /></div>
                    <p>
                        InternWin helps students create professional resumes with project experience,
                        technical skills, and internship achievements to increase placement opportunities.

                    </p>
                </div>
                <div className='Home-Card3-Card'>
                     <div className='Home-Card3-Card-Logo'><MdOutlineLaptopChromebook /></div>
                    <p>
                        InternWin allow  students improve their technical, communication, and professional skills through sessions, tasks, teamwork, and
                        practical learning,.

                    </p>
                </div>



            </div>
            <br />
            <br />

        </>
    )
}

export default Home
