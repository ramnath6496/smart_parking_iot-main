import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../helper/firebaseConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import "./nav.css";

function Navbar() {
  const [user] = useAuthState(auth);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(true);

  const toggleProfileDropdown = () =>
    setProfileDropdownOpen(!isProfileDropdownOpen);

  useEffect(() => {
    const handleClickOutside = () => {
      setProfileDropdownOpen(true);
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header>
        <Link to={"/"}>
          <div className="logo" style={{ background: "url(/logo1.png)" }}></div>
        </Link>
        <div className="right">
          <nav>
            <ul>
              <li>
                <Link to={"/"}>
                  <a href="#slots">Home</a>
                </Link>
              </li>
              <li>
                <Link to={"/#about"}>
                  <a href="#about-us">About Us</a>
                </Link>
              </li>
              <li>
                <a href="#contact-us">Contact Us</a>
              </li>
            </ul>
          </nav>
          {user ? (
            <div
              className="profile"
              onMouseEnter={toggleProfileDropdown}
              onMouseLeave={toggleProfileDropdown}>
              <FontAwesomeIcon icon={faUser} />
              <Link>{user.displayName}</Link>
              {isProfileDropdownOpen && (
                <div className="dropdown-content">
                  <Link
                    to="/past"
                    onClick={(e) => e.stopPropagation()}>
                    See Older Booking
                  </Link>
                
                  <Link
                    onClick={() => {
                      auth.signOut();
                      localStorage.clear();
                    }}>
                    Logout
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <FontAwesomeIcon icon={faUser} />
            </Link>
          )}
        </div>
      </header>
    </>
  );
}

export default Navbar;
