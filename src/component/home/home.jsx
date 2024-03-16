import { useState, useEffect } from "react";
import axios from "axios";
import "./home.css";
import Hero from "./hero";
import About from "./about";
import Contact from "./contact";
import Footer from "./footer";
import Slot from "./newHome";

const Home = () => {
  return (
    <div className="home">
      {/* Header Section */}

      {/* Hero Section */}
      <section className="hero">
        <Hero />
      </section>

      {/* Features Section */}
      <section id="slots" className="slots container">
       <Slot/>
      </section>

      <section id="about-us" className="about-us">
        {/* Information about your company or team */}
        <About />
      </section>

      {/* Contact Us Section */}
      <section id="contact-us" className="contact-us">
        <Contact />
      </section>

      {/* Footer Section */}
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Home;
