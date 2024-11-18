import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white text-black py-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 text-center md:text-left px-4">
        <div className="flex justify-center md:justify-start">
          <img
            src="/images/logo/logo.svg"
            alt="SCEC Logo"
            className="w-16 h-16 mx-auto md:mx-0"
          />
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4">SCEC</h3>
          <p>
            <Link to="/" className="hover:text-yellow-500">
              Home
            </Link>
          </p>
          <p>
            <Link to="/about" className="hover:text-yellow-500">
              About
            </Link>
          </p>
          <p>
            <Link to="/news" className="hover:text-yellow-500">
              News
            </Link>
          </p>
          <p>
            <Link to="/gallery" className="hover:text-yellow-500">
              Gallery
            </Link>
          </p>
          <p>
            <Link to="/events" className="hover:text-yellow-500">
              Events
            </Link>
          </p>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4">Store</h3>
          <p>
            <Link to="/products" className="hover:text-yellow-500">
              Products
            </Link>
          </p>
          <h3 className="text-lg font-bold mt-6 mb-4">Contacts</h3>
          <p>
            <a
              href="https://instagram.com/sunwaycarclub"
              target="_blank"
              className="hover:text-yellow-500"
            >
              Instagram
            </a>
          </p>
          <p>
            <a
              href="mailto:sunwaycarclub@gmail.com"
              className="hover:text-yellow-500"
            >
              Email
            </a>
          </p>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4">Join our club</h3>
          <a
            href="https://docs.google.com/forms"
            target="_blank"
            className="inline-block bg-yellow-500 text-black py-2 px-6 rounded-lg border-2 border-yellow-500 font-semibold hover:bg-yellow-600"
          >
            JOIN NOW
          </a>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4">Search the web</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const searchTerm = e.target.elements.search.value;
              window.location.href = `https://www.google.com/search?q=${searchTerm}`;
            }}
          >
            <div className="relative">
              <input
                type="search"
                name="search"
                className="w-full p-4 pl-12 text-sm rounded-lg border-2 border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Search..."
              />
              <button className="absolute top-1/2 left-3 -translate-y-1/2 text-yellow-500">
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-4.35-4.35M18 10a8 8 0 11-16 0 8 8 0 0116 0z"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </footer>
  );
}
