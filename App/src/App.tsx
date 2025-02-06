
import { Route, BrowserRouter, Routes } from "react-router-dom";
import AOS from "aos";
import { ToastContainer } from "react-toastify";
import Homepage from "./Pages/Homepage";
import Signin from "./Pages/Signin";
import Signup from "./Pages/Signup";
import Profile from "./Pages/Profile";
import Event from "./Pages/Event";
import { HelmetProvider } from 'react-helmet-async';
//import Contact from "./Pages/Contact";

import Dashboard from "./Pages/Dashboard";
import NotFound from "./Pages/NotFound";

import "aos/dist/aos.css";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
//import { disableReactDevTools } from "./Utils/disableReactDevTools";

// Disable REACT DevTOOL production mode
//    if (process.env.NODE_ENV === "production") disableReactDevTools();
//  // Disable console.log in production
//  if (process.env.NODE_ENV === "production") {
//    console.log = () => {};
//  }

const App = () => {

  useEffect(() => {
    AOS.init();
  }, [])

  return (
    <HelmetProvider >
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard/:userId" element={<Dashboard />} />
          <Route path="/event/:eventId" element={<Event />} />
          {/* <Route path="/contact" element={<Contact />} /> */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </HelmetProvider>
  );
};

export default App;
