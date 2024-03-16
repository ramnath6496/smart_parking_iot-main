import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./component/home/home";
import SignUp from "./component/signUp/signUp";
import Login from "./component/login/login";
import PastBooking from "./component/home/pastBooking";
import Navbar from "./component/home/navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* <Route path="/" element={<Home/>}/> */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/past" element={<PastBooking />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
