import React from "react";

function Footer() {
  return (
    <>
      {/* Navigation links */}
      <nav>
        <ul>
          <li>
            <a href="#terms">Terms of Service</a>
          </li>
          <li>
            <a href="#privacy">Privacy Policy</a>
          </li>
        </ul>
      </nav>
      {/* Social media icons */}
      <div className="social-media">
        <a href="#">
          <i className="fab fa-facebook-f"></i>
        </a>
        <a href="#">
          <i className="fab fa-twitter"></i>
        </a>
        {/* Additional social media icons */}
      </div>
      {/* Copyright information */}
      <p>&copy; 2024 Smart Parking System. All rights reserved.</p>
    </>
  );
}

export default Footer;
