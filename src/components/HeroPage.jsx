import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../Firebase";
import { Link, useNavigate } from "react-router-dom";

const HeroPage = () => {
  const [user, setUser] = useState("");
  const navigate = useNavigate();
  const handleChat = () => {
    navigate("/home");
  };
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribeAuth(); // Cleanup function to unsubscribe from auth state changes
  }, []);

  return (
    <div
      className="d-flex justify-content-center align-items-center hero-body"
      style={{ minHeight: "100vh" }}
    >
      <div className="container text-center hero-text ">
        <h1 className="fontz">
          Welcome to{" "}
          <span>
            <span style={{ color: "red" }}>C</span>hat{" "}
            <span style={{ color: "red" }}>G</span>eniee
          </span>
          {user ? (
            <div>
              <button className="btn btn-success minFontz" onClick={handleChat}>
                Chat
              </button>
            </div>
          ) : (
            <div>
              <Link to="/login">
                <button className="btn btn-primary m-3 minFontz">Login</button>
              </Link>
              <Link to="/register">
                <button className="btn btn-danger m-3 minFontz">
                  Register
                </button>
              </Link>
            </div>
          )}
        </h1>
      </div>
    </div>
  );
};

export default HeroPage;
