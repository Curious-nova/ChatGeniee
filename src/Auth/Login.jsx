import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../Firebase";

import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/"); // Redirect to home or desired page after login

      setError("");
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center flex-column shadow-lg"
      style={{
        maxWidth: "350px",
        minHeight: "400px",
        marginTop: "150px",
        borderRadius: "10px",
      }}
    >
      <h2 style={{ color: "blue" }}>Login</h2>
      {error && <div className="text-danger mb-3">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            className="form-control mb-2"
            id="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control mb-2"
            id="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="d-flex flex-column justify-content-center align-items-center">
          <button type="submit" className="btn btn-primary mb-3">
            Log In
          </button>
          <div className="mt-2">
            <Link to="/register">New User? Register</Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
