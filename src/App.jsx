import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./Auth/ProtectedRoutes";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import Home from "./components/Home";

import HeroPage from "./components/HeroPage";
const App = () => {
  return (
    <div>
      <Routes>
        <Route element={<ProtectedRoutes />}>
          <Route path="/home" element={<Home />} />
        </Route>
        <Route path="/" element={<HeroPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
};

export default App;
