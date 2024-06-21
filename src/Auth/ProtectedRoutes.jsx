import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { auth } from "../Firebase";

const ProtectedRoutes = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <div className="spinner-border" role="status">
            <span className="sr-only"></span>
          </div>
          <span className="ms-2">Loading...</span>
        </div>
      </>
    );
  }

  return user ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;
