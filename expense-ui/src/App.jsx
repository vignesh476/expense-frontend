import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import Dashboard from "./Dashboard";
import { isAuth } from "./auth";
import About from "./About";
import Help from "./Help";
import Support from "./Support";
import Footer from "./Footer";

// Import Google OAuth provider
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function App() {
  return (
   // <GoogleOAuthProvider clientId="861707466209-hck9obot0jikpppejjkss8n3tff49d1e.apps.googleusercontent.com">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/about" element={<About />} />
          <Route path="/help" element={<Help />} />
          <Route path="/support" element={<Support />} />
          <Route
            path="/"
            element={isAuth() ? <Dashboard /> : <Navigate to="/login" />}
          />
        </Routes>
        <Footer />
      </BrowserRouter>
   // </GoogleOAuthProvider>
  );
}