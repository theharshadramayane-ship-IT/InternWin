import React, { useState, useEffect } from 'react' // 🌟 Added useEffect here
import './assets/Contact.css'
import { useLocation } from 'react-router-dom'

const Contact = () => {
  const location = useLocation(); // 🌟 Initialized the location hook

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; 
  };

  const [formData, setFormData] = useState({
    domain: '',
    firstName: '',
    middleName: '',
    lastName: '',
    enquiryDate: getTodayDate(), 
    admissionDate: '',
    email: '',
    contact: '',
    college: '',
    university: '',
    qualification: '',
    address: '',
    reference: 'Relative',
    candidateType: 'Fresher'
  });

  // 🌟 This automatically captures the incoming state data and sets the dropdown
  useEffect(() => {
  // 1. URL params check karega (?domain=Python)
  const queryParams = new URLSearchParams(location.search);
  const domainParam = queryParams.get('domain');

  // 2. Card component se aane wali state check karega (state={{ targetDomain: 'Python' }})
  const stateDomain = location.state?.targetDomain;

  // Dono mein se jo bhi mile, use preference do
  const finalDomain = domainParam || stateDomain;

  if (finalDomain) {
    setFormData((prev) => ({
      ...prev,
      domain: finalDomain
    }));
  }
}, [location]);// Dependency array mein location zaroor rakhna

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validate Mobile Number (Must be exactly 10 digits)
    const contactRegex = /^[0-9]{10}$/;
    if (!contactRegex.test(formData.contact)) {
      alert("Please enter a valid 10-digit contact number.");
      return; 
    }

    // 2. Validate Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // 3. Make sure names don't contain numbers
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(formData.firstName) || !nameRegex.test(formData.lastName)) {
      alert("Names should only contain alphabetic letters.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/submissions/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        alert('Application submitted successfully!');
        setFormData({
          domain: '', firstName: '', middleName: '', lastName: '',
          enquiryDate: getTodayDate(), admissionDate: '',
          email: '', contact: '', college: '', university: '',
          qualification: '', address: '', reference: 'Relative', candidateType: 'Fresher'
        });
      } else {
        alert('Submission failed: ' + data.error);
      }
    } catch (error) {
      alert('Something went wrong. Please check your backend connection.');
    }
  };

  return (
    <>
      <div className="Contact-Card">
        <h2 className="Contact-heading">InternWin</h2>

        <form onSubmit={handleSubmit}>
          <table className="Contact-Table">
            <tbody>

              <tr>
                <td colSpan="3">
                  <label>Please Select Your Domain</label><br />
                  <select name="domain" id="domain" value={formData.domain} onChange={handleChange} required>
                    <option value="">Please select</option>
                    <option value="Java">Full Stack using Java</option>
                    <option value="Python">Full Stack using Python</option>
                    <option value="Mern">MERN Stack</option>
                    <option value="DataScience">Data Science using Python</option>
                    <option value="Cloud">AWS Cloud</option>
                    <option value="DataAnalytics">Data Analytics using Python</option>
                    <option value="Mean">MEAN Stack</option>
                  </select>
                </td>
              </tr>

              <tr>
                <td>
                  <label>First Name</label><br />
                  <input type="text" name="firstName" placeholder="Enter First Name" value={formData.firstName} onChange={handleChange} required />
                </td>
                <td>
                  <label>Middle Name</label><br />
                  <input type="text" name="middleName" placeholder="Enter Middle Name" value={formData.middleName} onChange={handleChange} />
                </td>
                <td>
                  <label>Last Name</label><br />
                  <input type="text" name="lastName" placeholder="Enter Last Name" value={formData.lastName} onChange={handleChange} required />
                </td>
              </tr>

              <tr>
                <td>
                  <label>Enquiry Date</label><br />
                  <input type="date" name="enquiryDate" value={formData.enquiryDate} onChange={handleChange} />
                </td>
                <td colSpan="2">
                  <label>Expected Admission Date</label><br />
                  <input type="date" name="admissionDate" value={formData.admissionDate} onChange={handleChange} />
                </td>
              </tr>

              <tr>
                <td colSpan="2">
                  <label>Email ID</label><br />
                  <input type="email" name="email" placeholder="name@example.com" value={formData.email} onChange={handleChange} required />
                </td>
                <td>
                  <label>Contact Number</label><br />
                  <input type="text" name="contact" placeholder="10-digit number" value={formData.contact} onChange={handleChange} required />
                </td>
              </tr>

              <tr>
                <td>
                  <label>College</label><br />
                  <input type="text" name="college" placeholder="Enter College Name" value={formData.college} onChange={handleChange} required />
                </td>
                <td>
                  <label>University</label><br />
                  <input type="text" name="university" placeholder="Enter University Name" value={formData.university} onChange={handleChange} required />
                </td>
                <td>
                  <label>Qualification</label><br />
                  <input type="text" name="qualification" placeholder="Enter Qualification" value={formData.qualification} onChange={handleChange} required />
                </td>
              </tr>

              <tr>
                <td colSpan="3">
                  <label>Address</label><br />
                  <textarea name="address" placeholder="Enter Your Address" value={formData.address} onChange={handleChange} required></textarea>
                </td>
              </tr>

              <tr>
                <td colSpan="2"><label>Reference</label></td>
                <td><label>Candidate Type</label></td>
              </tr>

              <tr>
                <td colSpan="2">
                  <select name="reference" value={formData.reference} onChange={handleChange}>
                    <option value="Relative">Relative</option>
                    <option value="Friend">Friend</option>
                    <option value="Seminar">Seminar</option>
                    <option value="SocialMedia">Social Media</option>
                    <option value="Other">Other</option>
                  </select>
                </td>
                <td>
                  <select name="candidateType" value={formData.candidateType} onChange={handleChange}>
                    <option value="Fresher">Fresher</option>
                    <option value="JobSeeker">Job Seeker</option>
                    <option value="WorkingProfessional">Working Professional</option>
                  </select>
                </td>
              </tr>

              <tr>
                <td colSpan="3">
                  <button type="submit">Submit</button>
                </td>
              </tr>

            </tbody>
          </table>
        </form>
      </div>
    </>
  )
}

export default Contact