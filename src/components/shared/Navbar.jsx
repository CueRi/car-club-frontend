import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <header className="bg-black text-white py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link to="/" className="flex items-center">
          <img
            src="/images/logo/logo.svg"
            alt="SCEC Logo"
            className="w-12 h-12 md:w-16 md:h-16"
          />
        </Link>

        <button
          className="md:hidden block"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>

        <nav
          className={`md:flex md:flex-row space-x-8 text-lg md:text-2xl ${
            isMenuOpen ? "block" : "hidden"
          }`}
        >
          <Link
            to="/about"
            className="block md:inline-block py-2 hover:text-yellow-500"
          >
            WHO?
          </Link>
          <Link
            to="/events"
            className="block md:inline-block py-2 hover:text-yellow-500"
          >
            EVENTS
          </Link>
          <Link
            to="/gallery"
            className="block md:inline-block py-2 hover:text-yellow-500"
          >
            GALLERY
          </Link>
          <Link
            to="/products"
            className="block md:inline-block py-2 hover:text-yellow-500"
          >
            PRODUCTS
          </Link>
          <div className="relative group">
            <button className="py-2 px-4 hover:text-yellow-500">MORE</button>
            <div
              className="absolute invisible opacity-0 group-hover:visible group-hover:opacity-100 hover:visible hover:opacity-100
                         right-0 mt-2 w-48 bg-black z-50 pt-2 transition-all duration-300 ease-in-out"
            >
              <div className="py-1 bg-black shadow-lg rounded-b-lg">
                <Link
                  to="/news"
                  className="block px-4 py-2 hover:text-yellow-500 transition-colors"
                >
                  NEWS
                </Link>
                <a
                  href="https://docs.google.com/forms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 hover:text-yellow-500 transition-colors"
                >
                  JOIN NOW
                </a>
                <Link
                  to="/contact"
                  className="block px-4 py-2 hover:text-yellow-500 transition-colors"
                >
                  CONTACT US
                </Link>
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/admin"
                      className="block px-4 py-2 hover:text-yellow-500 transition-colors"
                    >
                      DASHBOARD
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:text-yellow-500 transition-colors"
                    >
                      LOGOUT
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="block px-4 py-2 hover:text-yellow-500 transition-colors"
                  >
                    ADMIN LOGIN
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
