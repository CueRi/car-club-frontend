import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/shared/ProtectedRoute";
import "./index.css";
import Navbar from "./components/shared/Navbar";
import Footer from "./components/shared/Footer";
import Home from "@/pages/Home";
import NewsPage from "@/pages/News";
import NewsDetailPage from "../src/pages/NewsDetailPage";
import About from "@/pages/About";
import EventsSection from "@/pages/Events";
import Gallery from "@/pages/Gallery";
import Products from "@/pages/Products";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<EventsSection />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/products" element={<Products />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:id" element={<NewsDetailPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}
