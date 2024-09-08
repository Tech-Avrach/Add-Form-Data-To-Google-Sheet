import React, { useState } from 'react';
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
});

const [status, setStatus] = useState('');

// Handle form input changes
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData((prevData) => ({
      ...prevData,
      [name]: value
  }));
};


    // Handle form submission
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const scriptURL = 'https://script.google.com/macros/s/AKfycbwUFZEpCYvcw5wR48u9tEYGt2yvErAXDPDpF99IgYl*************************';
  
      // Convert form data to URLSearchParams for x-www-form-urlencoded format
      const formParams = new URLSearchParams();
      for (const key in formData) {
          formParams.append(key, formData[key]);
      }
  
      try {
          const response = await fetch(scriptURL, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: formParams.toString(),
          });
  
          console.log("Response: ", response);
  
          if (response.ok) {
              setStatus('Message sent successfully!');
              setFormData({
                  name: '',
                  email: '',
                  phone: '',
                  subject: '',
                  message: ''
              });
          } else {
              setStatus('Failed to send message. Please try again.');
          }
      } catch (error) {
          console.log("Error: ", error);
          setStatus('Error occurred. Please try again.');
      }
  };

  return (
    <>
     <h1 className="title">Form Data to Google Sheet</h1>
      <div className="main">
        <div className="contact-form">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <input
                type="text"
                name="name"
                placeholder="Your Name.."
                value={formData.name}
                onChange={handleInputChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email.."
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-row">
              <input
                type="text"
                name="phone"
                placeholder="Phone Number.."
                value={formData.phone}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="subject"
                placeholder="Your Subject.."
                value={formData.subject}
                onChange={handleInputChange}
              />
            </div>
            <textarea
              name="message"
              placeholder="Enter Your Message.."
              value={formData.message}
              onChange={handleInputChange}
            />
            <button type="submit">SUBMIT MESSAGE</button>
          </form>
          {status && <p className="form-status">{status}</p>}
        </div>
      </div>
    </>
  )
}

export default App
