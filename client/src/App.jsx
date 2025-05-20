import React, { useContext, Suspense, lazy } from "react";
import { Navigate, Route, Router, Routes } from "react-router-dom";
// import Homepage from "./Pages/Homepage";
import LoginPage from "./Pages/LoginPage";
import ProfilePage from "./Pages/ProfilePage";
import { Toaster } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import "./App.css"

const Homepage = lazy(() => import("./Pages/Homepage"));

const App = () => {
  const { authuser } = useContext(AuthContext);
  return (
    <div className=" bg-contain bg-cover">
       
      <Toaster />
     
       <Suspense fallback={<div>Loading...</div>}>
  <Routes>
    <Route
      path="/"
      element={authuser ? <Homepage /> : <Navigate to="/login" />}
    />
    <Route
      path="/login"
      element={!authuser ? <LoginPage /> : <Navigate to="/" />}
    />
    <Route
      path="/profile"
      element={authuser ? <ProfilePage /> : <Navigate to="/login" />}
    />
  </Routes>
</Suspense>
  
    </div>
  );
};

export default App;
