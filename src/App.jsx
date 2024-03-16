import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./component/home/newHome";
import SignUp from "./component/signUp/signUp";
import Login from "./component/login/login";
import PastBooking from "./component/home/pastBooking";

function App() {
  return (
    <BrowserRouter>
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
