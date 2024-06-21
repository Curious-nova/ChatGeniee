import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  getDocs,
  doc,
} from "firebase/firestore";
import { db, auth } from "../Firebase";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import { RxHamburgerMenu } from "react-icons/rx";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [UserChats, setUserChats] = useState([]);
  const [input, setInput] = useState("");
  const [user, setUser] = useState(null);
  const [showNavbar, setShowNavbar] = useState(false);
  const [loadingAIResponse, setLoadingAIResponse] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserChats(currentUser.uid);
      } else {
        navigate("/login");
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  const fetchUserChats = (userId) => {
    const q = query(
      collection(db, "users", userId, "chats"),
      orderBy("timestamp")
    );
    const unsubscribeChats = onSnapshot(q, (querySnapshot) => {
      const chats = [];
      querySnapshot.forEach((doc) => {
        chats.push(doc.data());
      });
      setUserChats(chats);
    });

    return () => {
      unsubscribeChats();
    };
  };

  const generateAIResponse = async (userMessage) => {
    try {
      setLoadingAIResponse(true);
      const res = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${
          import.meta.env.VITE_GEMINI_API
        }`,
        method: "post",
        data: {
          contents: [
            {
              parts: [{ text: userMessage }],
            },
          ],
        },
      });
      setLoadingAIResponse(false);
      return (
        res?.data?.candidates[0]?.content?.parts[0]?.text ||
        `No response found for: "${userMessage}"`
      );
    } catch (error) {
      setLoadingAIResponse(false);
      console.error("Error generating AI response:", error);
      return `Error generating AI response: ${error.message}`;
    }
  };

  const handleSendMessage = async () => {
    if (input.trim() && user) {
      const userMessage = input.trim();

      const userChatRef = collection(db, "users", user.uid, "chats");

      await addDoc(userChatRef, {
        text: userMessage,
        sender: user.email,
        timestamp: new Date(),
      });
      setInput("");

      const aiResponse = await generateAIResponse(userMessage);
      await addDoc(userChatRef, {
        text: aiResponse,
        sender: "AI",
        timestamp: new Date(),
      });
    }
  };

  const handleClearChats = async () => {
    if (user) {
      const userChatRef = collection(db, "users", user.uid, "chats");

      // Clear chats displayed in UI
      setUserChats([]);

      // Clear chats stored in the database
      const querySnapshot = await getDocs(userChatRef);
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
    }
  };

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <div className="home-container">
      <nav className="navbar shadow-lg" style={{ backgroundColor: "purple" }}>
        <div className="container-fluid ">
          <h1 style={{ color: "white" }}>Chat Geniee</h1>
          <button
            className="navbar-toggler text-white"
            type="button"
            onClick={() => setShowNavbar(!showNavbar)}
            aria-expanded={showNavbar}
            aria-label="Toggle navigation"
          >
            <RxHamburgerMenu />
          </button>
        </div>
      </nav>
      <div className={showNavbar ? "collapse show" : "collapse"}>
        <div className="bg-body-tertiary shadow-3 p-4 d-flex align-items-center flex-column">
          <button
            className="btn btn-block border-bottom m-0 shadow-lg d-flex justify-content-center"
            style={{ maxWidth: "130px" }}
            onClick={handleClearChats}
          >
            Clear Chats
          </button>
          <button
            className="btn btn-danger btn-block border-bottom m-0 shadow-lg mt-3"
            style={{ maxWidth: "130px" }}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
      <div
        className="home-body p-3"
        style={{ height: "550px", overflowY: "scroll" }}
      >
        {UserChats.map((message, index) => (
          <div
            key={index}
            className={`message ${
              message.sender === user?.email ? "text-right" : ""
            }`}
          >
            <p
              className={`p-2 ${
                message.sender === user?.email
                  ? "bg-primary text-white"
                  : "bg-light text-dark border"
              } rounded`}
            >
              {message.text}
            </p>
          </div>
        ))}
        {loadingAIResponse && (
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        )}
      </div>
      <div
        className="home-footer d-flex p-3 border-top shadow-lg"
        style={{ position: "fixed", bottom: 0, left: 0, width: "100%" }}
      >
        <input
          type="text"
          className="form-control mr-2"
          placeholder="Type a message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="btn ms-2 shadow-sm"
          style={{ backgroundColor: "purple", color: "white" }}
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Home;
