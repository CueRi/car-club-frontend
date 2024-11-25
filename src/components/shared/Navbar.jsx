import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

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
    setIsMenuOpen(false);
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
          className="md:hidden block z-50"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? "" : <Menu size={24} />}
        </button>

        <nav className="hidden md:flex space-x-8 text-lg md:text-2xl">
          <Link to="/about" className="hover:text-yellow-500">
            WHO?
          </Link>
          <Link to="/events" className="hover:text-yellow-500">
            EVENTS
          </Link>
          <Link to="/gallery" className="hover:text-yellow-500">
            GALLERY
          </Link>
          <Link to="/products" className="hover:text-yellow-500">
            PRODUCTS
          </Link>
          <div className="relative group">
            <button className="hover:text-yellow-500">MORE</button>
            <div className="absolute invisible opacity-0 group-hover:visible group-hover:opacity-100 right-0 mt-2 w-48 bg-black z-50 pt-2 transition-all duration-300 ease-in-out">
              <div className="py-1 bg-black shadow-lg rounded-b-lg">
                <Link
                  to="/news"
                  className="block px-4 py-2 hover:text-yellow-500"
                >
                  NEWS
                </Link>
                <a
                  href="https://forms.gle/yvKCB6D7x2Mj6ffh9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 hover:text-yellow-500"
                >
                  JOIN NOW
                </a>
                <Link
                  to="/contact"
                  className="block px-4 py-2 hover:text-yellow-500"
                >
                  CONTACT US
                </Link>
                {isAuthenticated && (
                  <>
                    <Link
                      to="/admin"
                      className="block px-4 py-2 hover:text-yellow-500"
                    >
                      DASHBOARD
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:text-yellow-500"
                    >
                      LOGOUT
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        {isMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-40 flex flex-col items-center justify-center space-y-6 text-xl text-center">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-4 right-4 text-white"
              aria-label="Close menu"
            >
              <X size={32} />
            </button>
            <Link
              to="/about"
              onClick={() => setIsMenuOpen(false)}
              className="hover:text-yellow-500"
            >
              WHO?
            </Link>
            <Link
              to="/events"
              onClick={() => setIsMenuOpen(false)}
              className="hover:text-yellow-500"
            >
              EVENTS
            </Link>
            <Link
              to="/gallery"
              onClick={() => setIsMenuOpen(false)}
              className="hover:text-yellow-500"
            >
              GALLERY
            </Link>
            <Link
              to="/products"
              onClick={() => setIsMenuOpen(false)}
              className="hover:text-yellow-500"
            >
              PRODUCTS
            </Link>
            <Link
              to="/news"
              onClick={() => setIsMenuOpen(false)}
              className="hover:text-yellow-500"
            >
              NEWS
            </Link>
            <a
              href="https://docs.google.com/forms"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMenuOpen(false)}
              className="hover:text-yellow-500"
            >
              JOIN NOW
            </a>
            <Link
              to="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="hover:text-yellow-500"
            >
              CONTACT US
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:text-yellow-500"
                >
                  DASHBOARD
                </Link>
                <button
                  onClick={handleLogout}
                  className="hover:text-yellow-500"
                >
                  LOGOUT
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
