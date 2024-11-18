import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate, formatDateForInput } from "../../utils/dateUtils";
import { uploadToCloudinary } from "../../utils/cloudinaryUtils";
import { createApiClient, handleApiError } from "../../utils/apiUtils";
import Select from "react-select";
import { categories } from "../../data/news.category.constants";

export default function NewsManager() {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    category: "",
    customCategory: "",
    image: null,
  });
  const [editingNews, setEditingNews] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const api = createApiClient(navigate);

  useEffect(() => {
    fetchNewsItems();
  }, []);

  const fetchNewsItems = async () => {
    try {
      const response = await api.get("/news");
      if (Array.isArray(response.data)) {
        setNewsItems(response.data);
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
      const newsData = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        category: formData.category || formData.customCategory,
        image: formData.image,
      };

      if (editingNews) {
        await api.put(`/news/${editingNews.id}`, newsData);
      } else {
        await api.post("/news", newsData);
      }

      resetForm();
      fetchNewsItems();
    } catch (error) {
      setError(handleApiError(error));
    }
  };

  const handleEdit = (newsItem) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      description: newsItem.description,
      date: formatDateForInput(newsItem.date),
      category: newsItem.category,
      customCategory: newsItem.category === "Other" ? newsItem.category : "",
      image: newsItem.image,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this news item?")) {
      try {
        await api.delete(`/news/${id}`);
        fetchNewsItems();
      } catch (error) {
        setError(handleApiError(error));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      category: "",
      customCategory: "",
      image: null,
    });
    setEditingNews(null);
  };

  if (loading) return <div className="text-white">Loading news...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const handleCategoryChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      category: selectedOption ? selectedOption.value : "",
      customCategory:
        selectedOption?.value === "Other" ? prev.customCategory : "",
    }));
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-yellow-500 mb-6">Manage News</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-6 rounded-lg space-y-4"
      >
        <h3 className="text-xl text-yellow-500 mb-4">
          {editingNews ? "Edit News Item" : "Add New News Item"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="News Title"
            className="bg-gray-800 text-white p-2 rounded"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />

          <input
            type="date"
            className="bg-gray-800 text-white p-2 rounded"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />

          <textarea
            placeholder="Description"
            className="bg-gray-800 text-white p-2 rounded md:col-span-2"
            rows={4}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
          />

          <div className="md:col-span-2">
            <Select
              value={categories.find(
                (option) => option.value === formData.category
              )}
              onChange={handleCategoryChange}
              options={categories}
              placeholder="Select Category"
              isSearchable
            />
          </div>

          {formData.category === "Other" && (
            <input
              type="text"
              placeholder="Enter Custom Category"
              className="bg-gray-800 text-white p-2 rounded md:col-span-2"
              value={formData.customCategory}
              onChange={(e) =>
                setFormData({ ...formData, customCategory: e.target.value })
              }
              required
            />
          )}

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
            {editingNews ? "Update News" : "Add News"}
          </button>

          {editingNews && (
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
        <h3 className="text-xl text-yellow-500 mb-4">Current News Items</h3>

        <div className="space-y-4">
          {newsItems.map((newsItem) => (
            <div
              key={newsItem.id}
              className="flex items-center justify-between bg-gray-800 p-4 rounded hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-center space-x-4">
                {newsItem.image && (
                  <img
                    src={newsItem.image}
                    alt={newsItem.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div>
                  <h4 className="text-white font-bold">{newsItem.title}</h4>
                  <p className="text-gray-400">{formatDate(newsItem.date)}</p>
                  <p className="text-gray-400 mt-1">{newsItem.description}</p>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded focus:outline-none transition-colors"
                  onClick={() => handleEdit(newsItem)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded focus:outline-none transition-colors"
                  onClick={() => handleDelete(newsItem.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {newsItems.length === 0 && (
            <div className="text-gray-400 text-center py-4">
              No news found. Add your first news item above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
