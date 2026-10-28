import React, { useEffect, useState } from 'react'
import './assets/Domain.css'
import { Link, useNavigate } from 'react-router-dom'
import abc1 from './assets/abc1.jpeg'
const Domain = () => {
    const [upcomingBatches, setUpcomingBatches] = useState([]);

    useEffect(() => {
        const fetchUpcoming = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/programs/upcoming-global');
                const data = await res.json();
                if (data.success) {
                    setUpcomingBatches(data.programs || []);
                } else {
                    setUpcomingBatches([]);
                }
            } catch (err) {
                console.error("Error fetching upcoming batches:", err);
            }
        };
        fetchUpcoming();
    }, []);

    const navigate = useNavigate();
    const formatDate = (value) => {
        if (!value) return 'TBA';
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? 'TBA' : date.toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };
    return (
        <>
            <h1 className='Domain-Heading'>Kick Start your Tech Career with InternWin in Domain</h1>

            <div className="Domain-Container">
                {/* <div className="Domain-Card  text-muted">
            
                <h2> Full Stack in Dotnet </h2>
            <ul>
                <li>BackEnd</li>
                <li>FrontEnd</li>
                <li>Aptitude and SoftSkills</li>
                <li>Placement Preparation</li>
            </ul>
            <button type="submit">More Information</button>
            
        </div> */}
                <div className="Domain-Card">
                    <h2>Full Stack in Python</h2>
                    <ul>
                        <li>Core Python, OOP, SQL</li>
                        <li>Django, REST APIs, NumPy, Pandas</li>
                        <li>React, Next.js, HTML, CSS, JS</li>
                        <li>DSA</li>
                    </ul>
                    <Link to='/domain/python'><button type="submit">More Information</button></Link>
                </div>
                <div className="Domain-Card">
                    <h2>Data Science</h2>
                    <ul>
                        <li>Python, NumPy, Pandas, Statistics</li>
                        <li>Machine Learning, Deep Learning</li>
                        <li>EDA, Data Visualization</li>
                        <li>GenAI, LLM Concepts</li>
                    </ul>
                    <Link to='/domain/datascience'><button type="submit">More Information</button></Link>
                </div>
                <div className="Domain-Card">
                    <h2>Data Analytics</h2>
                    <ul>
                        <li>Excel, SQL, Python, Statistics</li>
                        <li>Power BI, Tableau, Snowflake</li>
                        <li>Data Cleaning, EDA, Visualization</li>
                        <li>GenAI for Analytics</li>
                    </ul>
                    <Link to='/domain/dataanalytics'><button type="submit">More Information</button></Link>
                </div>
                <div className="Domain-Card">
                    <h2>Full Stack in Java</h2>
                    <ul>
                        <li>Core Java, JDBC, SQL</li>
                        <li>Spring, Spring Boot, Microservices</li>
                        <li>React, Next.js, HTML, CSS, JS</li>
                        <li>DSA</li>
                    </ul>
                    <Link to='/domain/java'><button type="submit">More Information</button></Link>
                </div>
                <div className="Domain-Card">
                    <h2>MERN Stack</h2>
                    <ul>
                        <li>React.JS, Redux Toolkit, Next.JS</li>
                        <li>Node.JS, Express.Js</li>
                        <li>MongoDB</li>
                        <li>Authentication & API's</li>
                    </ul>
                    <Link to='/domain/mern'><button type="submit">More Information</button></Link>
                </div>
                <div className="Domain-Card">
                    <h2>MEAN Stack</h2>
                    <ul>
                        <li>Angular.JS</li>
                        <li>NGRX State Management</li>
                        <li>MongoDB</li>
                        <li>Restful API & API Security</li>
                    </ul>
                    <Link to='/domain/mean'><button type="submit">More Information</button></Link>
                </div>
                <div className="Domain-Card">
                    <h2>AWS Cloud</h2>
                    <ul>
                        <li>Cloud Fundamentals</li>
                        <li>AWS Services</li>
                        <li>Linux and Networking</li>
                        <li>Cloud Security</li>
                    </ul>
                    <Link to='/domain/aws'><button type="submit">More Information</button></Link>
                </div>
            </div>

            {/* <div className='Domain-Company-Image'>
        <img src={abc1} /> 
    </div> */}
            <div className="Upcoming-Section-Wrapper">
                <h2 className="Upcoming-Schedule-Heading"> Upcoming Training Batches</h2>
                <p className="Upcoming-Schedule-Subtext">Check out our latest schedule and reserve your seat before slots fill up!</p>

                <div className="Upcoming-Table-Scrollbox">
                    <table className="Upcoming-Data-Table">
                        <thead>
                            <tr>
                                <th>Domain / Tech</th>
                                <th>Batch Name</th>
                                <th>Start Date</th>
                                <th>Weekly Schedule</th>
                                <th>Timing Slot</th>
                                <th>Duration</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {upcomingBatches.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="upcoming-empty-msg">
                                         No upcoming batches scheduled right now. Check back soon or contact admin!
                                    </td>
                                </tr>
                            ) : (
                                upcomingBatches.map((batch) => (
                                    <tr key={batch._id}>
                                        <td><span className="upcoming-tech-badge">{batch.domain}</span></td>
                                        <td><strong style={{ color: '#2c3e50' }}>{batch.batchName}</strong></td>
                                        <td className="upcoming-date-highlight">
                                            {formatDate(batch.startDate || batch.createdAt)}
                                        </td>
                                        <td>{batch.schedule || 'TBA'}</td>
                                        <td><span className="upcoming-time-tag">{batch.timing || 'TBA'}</span></td>
                                        <td>{batch.duration || 'TBA'}</td>
                                        <td>
                                            <button
                                                className="upcoming-enquire-btn"
                                                onClick={() => navigate(`/contact?batch=${batch.batchName}&domain=${batch.domain}`)}
                                            >
                                                Enquire Now
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>











        </>
    )
}

export default Domain
