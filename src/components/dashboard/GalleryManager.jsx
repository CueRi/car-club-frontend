import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { uploadToCloudinary } from "../../utils/cloudinaryUtils";
import { createApiClient, handleApiError } from "../../utils/apiUtils";

export default function GalleryManager() {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    event: "",
    description: "",
    images: [],
  });
  const [editingGallery, setEditingGallery] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const api = createApiClient(navigate);

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      const response = await api.get("/galleries");
      if (Array.isArray(response.data)) {
        setGalleries(response.data);
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
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    try {
      const imageUrls = await Promise.all(
        files.map((file) => uploadToCloudinary(file))
      );
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...imageUrls],
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
      const galleryData = {
        event: formData.event,
        description: formData.description,
        images: formData.images,
      };

      if (editingGallery) {
        await api.put(`/galleries/${editingGallery.id}`, galleryData);
      } else {
        await api.post("/galleries", galleryData);
      }

      resetForm();
      fetchGalleries();
    } catch (error) {
      setError(handleApiError(error));
    }
  };

  const handleEdit = (gallery) => {
    setEditingGallery(gallery);
    setFormData({
      event: gallery.event,
      description: gallery.description,
      images: gallery.images,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this gallery?")) {
      try {
        await api.delete(`/galleries/${id}`);
        fetchGalleries();
      } catch (error) {
        setError(handleApiError(error));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      event: "",
      description: "",
      images: [],
    });
    setEditingGallery(null);
  };

  if (loading) return <div className="text-white">Loading galleries...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-yellow-500 mb-6">
        Manage Galleries
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-6 rounded-lg space-y-4"
      >
        <h3 className="text-xl text-yellow-500 mb-4">
          {editingGallery ? "Edit Gallery" : "Add New Gallery"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Gallery Event Name"
            className="bg-gray-800 text-white p-2 rounded"
            value={formData.event}
            onChange={(e) =>
              setFormData({ ...formData, event: e.target.value })
            }
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

          <div className="md:col-span-2 space-y-2">
            <input
              type="file"
              accept="image/*"
              multiple
              className="bg-gray-800 text-white p-2 rounded w-full"
              onChange={handleFileUpload}
            />
            {uploading && (
              <div className="text-yellow-500">Uploading images...</div>
            )}
            {formData.images.length > 0 && (
              <div className="flex space-x-2 mt-2 overflow-x-auto">
                {formData.images.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-32 h-32 object-cover rounded"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex space-x-4 mt-4">
          <button
            type="submit"
            className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
            disabled={uploading}
          >
            {editingGallery ? "Update Gallery" : "Add Gallery"}
          </button>

          {editingGallery && (
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
        <h3 className="text-xl text-yellow-500 mb-4">Galleries</h3>

        <div className="space-y-4">
          {galleries.map((gallery) => (
            <div
              key={gallery.id}
              className="flex flex-col space-y-2 bg-gray-800 p-4 rounded hover:bg-gray-750 transition-colors"
            >
              <div>
                <h4 className="text-white font-bold">{gallery.event}</h4>
                <p className="text-gray-400">{gallery.description}</p>
              </div>

              <div className="flex overflow-x-auto space-x-4">
                {gallery.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Gallery ${gallery.event} - Image ${index + 1}`}
                    className="w-32 h-32 object-cover rounded"
                  />
                ))}
              </div>

              <div className="flex space-x-2">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded focus:outline-none transition-colors"
                  onClick={() => handleEdit(gallery)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded focus:outline-none transition-colors"
                  onClick={() => handleDelete(gallery.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {galleries.length === 0 && (
            <div className="text-gray-400 text-center py-4">
              No galleries found. Add your first gallery above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
