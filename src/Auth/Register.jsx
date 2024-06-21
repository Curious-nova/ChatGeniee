import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../Firebase";
import { doc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Create user document
      await setDoc(doc(db, "Users", response.user.uid), {
        username,
        email,
        id: response.user.uid,
      });

      // Create user chat document
      await setDoc(doc(db, "UserChats", response.user.uid), {
        chats: [],
      });

      // Create a personal chat document for the user
      await setDoc(doc(db, "Chats", response.user.uid), {
        participants: [response.user.uid],
        messages: [],
      });

      navigate("/");
      setError("");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
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
      <h2 style={{ color: "blue" }}>Register</h2>
      {error && <div className="text-danger mb-3">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            className="form-control mb-2"
            id="username"
            placeholder="Username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            className="form-control mb-2"
            id="email"
            placeholder="Enter email"
            name="email"
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
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="d-flex flex-column justify-content-center align-items-center">
          <button
            type="submit"
            className="btn btn-primary mb-3"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
          <div className="mt-2">
            <Link to="/login">Already Registered? Login</Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
