import Header from "./components/Header";
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import Notes from "./pages/Notes";
import NotFound from "./pages/NotFound";

function App() {
  const location = useLocation();

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#0b1220" }}>
      {/* Header hidden on Chat and Notes as they have integrated headers */}
      {!location.pathname.startsWith("/chat") && !location.pathname.startsWith("/notes") && <Header />}

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  );
}

export default App;
