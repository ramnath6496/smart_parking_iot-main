import React from 'react'

function Contact() {
  return (
    <>
        {/* Contact information and form */}
        <h2>Contact Us</h2>
        <form action="" className="contact">
          <div className="fields">
            <label htmlFor="first">First Name</label>
            <input
              type="text"
              id="first"
              placeholder="Enter your first name"
              name="first"
            />
          </div>
          <div className="fields">
            <label htmlFor="name">Last Name</label>
            <input
              type="text"
              id="lastname"
              placeholder="Enter your last name"
              name="lastname"
            />
          </div>
          <div className="fields">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email address"
              name="email"
            />
          </div>
          <div className="fields">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              placeholder="Enter your phone number"
              name="phone"
            />
          </div>
          <div className="fields">
            <label htmlFor="message">Message</label>
            <textarea
              name="message"
              id="message"
              placeholder="Enter the mesage."
              rows="5"></textarea>
          </div>
          <div className="button">
            <button type="submit">Submit</button>
          </div>
        </form>
        {/* Include contact form and details */} 
    </>
  )
}

export default Contact