import React from "react";

function Navbar() {
  return (
    <>
      <header>
        {/* Include your logo or website name */}
        <div className="logo" style={{background: "url(/logo1.png)"}}>
          {/* <img src="/logo1.png" alt="lgog" srcset="" /> */}
        </div>
        {/* Navigation Menu */}
        <div className="right">
          <nav>
            <ul>
              <li>
                <a href="#slots">Slots</a>
              </li>
              {/* <li>
              <a href="#how-it-works">How It Works</a>
            </li> */}
              <li>
                <a href="#testimonials">Testimonials</a>
              </li>
              <li>
                <a href="#pricing">Pricing</a>
              </li>
              <li>
                <a href="#about-us">About Us</a>
              </li>
              <li>
                <a href="#contact-us">Contact Us</a>
              </li>
            </ul>
          </nav>
          {/* Optionally, include a call-to-action button */}
          <button>Sign Up</button>
        </div>
      </header>
    </>
  );
}

export default Navbar;
