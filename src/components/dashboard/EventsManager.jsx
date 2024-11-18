import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate, formatDateForInput } from "../../utils/dateUtils";
import { uploadToCloudinary } from "../../utils/cloudinaryUtils";
import { createApiClient, handleApiError } from "../../utils/apiUtils";

export default function EventsManager() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    image: null,
  });
  const [editingEvent, setEditingEvent] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const api = createApiClient(navigate);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get("/events");
      if (Array.isArray(response.data)) {
        setEvents(response.data);
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
      const eventData = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        image: formData.image,
      };

      if (editingEvent) {
        await api.put(`/events/${editingEvent.id}`, eventData);
      } else {
        await api.post("/events", eventData);
      }

      resetForm();
      fetchEvents();
    } catch (error) {
      setError(handleApiError(error));
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: formatDateForInput(event.date),
      image: event.image,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await api.delete(`/events/${id}`);
        fetchEvents();
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
      image: null,
    });
    setEditingEvent(null);
  };

  if (loading) return <div className="text-white">Loading events...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-yellow-500 mb-6">Manage Events</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-6 rounded-lg space-y-4"
      >
        <h3 className="text-xl text-yellow-500 mb-4">
          {editingEvent ? "Edit Event" : "Add New Event"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Event Title"
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
            {editingEvent ? "Update Event" : "Add Event"}
          </button>

          {editingEvent && (
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
        <h3 className="text-xl text-yellow-500 mb-4">Current Events</h3>

        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between bg-gray-800 p-4 rounded hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-center space-x-4">
                {event.image && (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div>
                  <h4 className="text-white font-bold">{event.title}</h4>
                  <p className="text-gray-400">{formatDate(event.date)}</p>
                  <p className="text-gray-400 mt-1">{event.description}</p>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded focus:outline-none transition-colors"
                  onClick={() => handleEdit(event)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded focus:outline-none transition-colors"
                  onClick={() => handleDelete(event.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {events.length === 0 && (
            <div className="text-gray-400 text-center py-4">
              No events found. Add your first event above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
