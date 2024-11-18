import { useState, useEffect } from "react";
import { ShoppingCart, Loader2 } from "lucide-react";
import PropTypes from "prop-types";
import { createApiClient, handleApiError } from "../utils/apiUtils";

const ProductCard = ({ product }) => (
  <div className="bg-white text-black p-6 rounded-lg flex flex-col items-center transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
    <div className="w-full h-64 mb-4 overflow-hidden rounded-lg">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover"
      />
    </div>

    <h3 className="text-2xl font-bold text-yellow-500 mb-2">{product.name}</h3>
    <p className="text-lg mb-4 font-semibold">${product.price}</p>

    <button
      onClick={() => (window.location.href = product.orderLink)}
      className="inline-flex items-center gap-2 bg-yellow-500 text-black py-2 px-6 rounded-lg font-bold 
                 hover:bg-yellow-600 transition-colors duration-300"
    >
      <ShoppingCart className="w-5 h-5" />
      Order Now
    </button>
  </div>
);

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    orderLink: PropTypes.string.isRequired,
  }).isRequired,
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const api = createApiClient();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data);
      } catch (error) {
        setError(handleApiError(error));
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-black">
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-8xl font-bold text-yellow-500 mb-10 font-[Antonio]">
            PRODUCTS
          </h2>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
