import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EventsManager from "../components/dashboard/EventsManager";
import ProductsManager from "../components/dashboard/ProductsManager";
import GalleryManager from "../components/dashboard/GalleryManager";
import NewsManager from "../components/dashboard/NewsManager";
import TeamMembersManager from "../components/dashboard/TeamMembersManager";
import UsersManager from "../components/dashboard/UsersManager";
import {
  Calendar,
  Image,
  Users,
  Newspaper,
  LogOut,
  ShoppingCart,
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("events");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const renderContent = () => {
    switch (activeSection) {
      case "events":
        return <EventsManager />;
      case "gallery":
        return <GalleryManager />;
      case "news":
        return <NewsManager />;
      case "users":
        return <UsersManager />;
      case "TeamMembers":
        return <TeamMembersManager />;
      case "products":
        return <ProductsManager />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-yellow-500 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex">
      <div className="w-64 bg-gray-900 text-white p-6">
        <h1 className="text-2xl font-bold text-yellow-500 mb-8">Admin Panel</h1>
        <nav className="space-y-4">
          <button
            onClick={() => setActiveSection("events")}
            className={`flex items-center space-x-2 w-full p-2 rounded-lg transition-colors
              ${
                activeSection === "events"
                  ? "bg-yellow-500 text-black"
                  : "hover:bg-gray-800"
              }`}
          >
            <Calendar size={20} />
            <span>Events</span>
          </button>

          <button
            onClick={() => setActiveSection("products")}
            className={`flex items-center space-x-2 w-full p-2 rounded-lg transition-colors
              ${
                activeSection === "products"
                  ? "bg-yellow-500 text-black"
                  : "hover:bg-gray-800"
              }`}
          >
            <ShoppingCart size={20} />
            <span>Products</span>
          </button>

          <button
            onClick={() => setActiveSection("gallery")}
            className={`flex items-center space-x-2 w-full p-2 rounded-lg transition-colors
              ${
                activeSection === "gallery"
                  ? "bg-yellow-500 text-black"
                  : "hover:bg-gray-800"
              }`}
          >
            <Image size={20} />
            <span>Gallery</span>
          </button>

          <button
            onClick={() => setActiveSection("news")}
            className={`flex items-center space-x-2 w-full p-2 rounded-lg transition-colors
              ${
                activeSection === "news"
                  ? "bg-yellow-500 text-black"
                  : "hover:bg-gray-800"
              }`}
          >
            <Newspaper size={20} />
            <span>News</span>
          </button>

          <button
            onClick={() => setActiveSection("users")}
            className={`flex items-center space-x-2 w-full p-2 rounded-lg transition-colors
              ${
                activeSection === "users"
                  ? "bg-yellow-500 text-black"
                  : "hover:bg-gray-800"
              }`}
          >
            <Users size={20} />
            <span>App Users</span>
          </button>

          <button
            onClick={() => setActiveSection("TeamMembers")}
            className={`flex items-center space-x-2 w-full p-2 rounded-lg transition-colors
              ${
                activeSection === "TeamMembers"
                  ? "bg-yellow-500 text-black"
                  : "hover:bg-gray-800"
              }`}
          >
            <Users size={20} />
            <span>Team Members</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 w-full p-2 rounded-lg hover:bg-red-600 transition-colors mt-8"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </nav>
      </div>

      <div className="flex-1 p-8">
        <div className="bg-gray-800 rounded-lg p-6">{renderContent()}</div>
      </div>
    </div>
  );
}
