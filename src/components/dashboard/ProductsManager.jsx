import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createApiClient, handleApiError } from "../../utils/apiUtils";
import { uploadToCloudinary } from "../../utils/cloudinaryUtils";

export default function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: null,
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const api = createApiClient(navigate);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        setError("Unexpected data format");
      }
      setLoading(false);
    } catch (error) {
      setError(handleApiError(error));
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const imageUrl = await uploadToCloudinary(file);
      setFormData((prev) => ({
        ...prev,
        image: imageUrl,
      }));
    } catch (error) {
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        name: formData.name,
        price: formData.price,
        image: formData.image,
        orderLink: "/contact",
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, productData);
      } else {
        await api.post("/products", productData);
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      setError(handleApiError(error));
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (error) {
        setError(handleApiError(error));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      image: null,
    });
    setEditingProduct(null);
  };

  if (loading) return <div className="text-white">Loading products...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-yellow-500 mb-6">
        Manage Products
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-6 rounded-lg space-y-4"
      >
        <h3 className="text-xl text-yellow-500 mb-4">
          {editingProduct ? "Edit Product" : "Add New Product"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Product Name"
            className="bg-gray-800 text-white p-2 rounded"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder="Price"
            className="bg-gray-800 text-white p-2 rounded"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            required
          />

          <div className="md:col-span-2 space-y-2">
            <input
              type="file"
              accept="image/*"
              className="bg-gray-800 text-white p-2 rounded w-full"
              onChange={handleFileUpload}
            />
            {uploading && (
              <div className="text-yellow-500">Uploading image...</div>
            )}
            {formData.image && (
              <img
                src={formData.image}
                alt="Preview"
                className="mt-2 w-32 h-32 object-cover rounded"
              />
            )}
          </div>
        </div>

        <div className="flex space-x-4 mt-4">
          <button
            type="submit"
            className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
            disabled={uploading}
          >
            {editingProduct ? "Update Product" : "Add Product"}
          </button>

          {editingProduct && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="bg-gray-900 p-6 rounded-lg">
        <h3 className="text-xl text-yellow-500 mb-4">Current Products</h3>

        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between bg-gray-800 p-4 rounded hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-center space-x-4">
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div>
                  <h4 className="text-white font-bold">{product.name}</h4>
                  <p className="text-gray-400">{product.price}</p>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded focus:outline-none transition-colors"
                  onClick={() => handleEdit(product)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded focus:outline-none transition-colors"
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {products.length === 0 && (
            <div className="text-gray-400 text-center py-4">
              No products found. Add your first product above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
