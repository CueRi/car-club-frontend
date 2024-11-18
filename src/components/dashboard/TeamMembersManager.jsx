import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { uploadToCloudinary } from "../../utils/cloudinaryUtils";
import { createApiClient, handleApiError } from "../../utils/apiUtils";

export default function TeamMembersManager() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    role: "",
    image: null,
  });
  const [editingMember, setEditingMember] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const api = createApiClient(navigate);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await api.get("/team-members");
      if (Array.isArray(response.data)) {
        setTeamMembers(response.data);
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
      const memberData = {
        firstName: formData.firstName,
        secondName: formData.secondName,
        role: formData.role,
        image: formData.image,
      };

      if (editingMember) {
        await api.put(`/team-members/${editingMember.id}`, memberData);
      } else {
        await api.post("/team-members", memberData);
      }

      resetForm();
      fetchTeamMembers();
    } catch (error) {
      setError(handleApiError(error));
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      firstName: member.firstName,
      secondName: member.secondName,
      role: member.role,
      image: member.image,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this team member?")) {
      try {
        await api.delete(`/team-members/${id}`);
        fetchTeamMembers();
      } catch (error) {
        setError(handleApiError(error));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      secondName: "",
      role: "",
      image: null,
    });
    setEditingMember(null);
  };

  if (loading) return <div className="text-white">Loading team members...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-yellow-500 mb-6">
        Manage Team Members
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-6 rounded-lg space-y-4"
      >
        <h3 className="text-xl text-yellow-500 mb-4">
          {editingMember ? "Edit Team Member" : "Add New Team Member"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="First Name"
            className="bg-gray-800 text-white p-2 rounded"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            required
          />

          <input
            type="text"
            placeholder="Second Name"
            className="bg-gray-800 text-white p-2 rounded"
            value={formData.secondName}
            onChange={(e) =>
              setFormData({ ...formData, secondName: e.target.value })
            }
            required
          />

          <input
            type="text"
            placeholder="Role"
            className="bg-gray-800 text-white p-2 rounded md:col-span-2"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
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
            {editingMember ? "Update Member" : "Add Member"}
          </button>

          {editingMember && (
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
        <h3 className="text-xl text-yellow-500 mb-4">Current Team Members</h3>

        <div className="space-y-4">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between bg-gray-800 p-4 rounded hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-center space-x-4">
                {member.image && (
                  <img
                    src={member.image}
                    alt={`${member.firstName} ${member.secondName}`}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div>
                  <h4 className="text-white font-bold">
                    {member.firstName} {member.secondName}
                  </h4>
                  <p className="text-gray-400">{member.role}</p>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded focus:outline-none transition-colors"
                  onClick={() => handleEdit(member)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded focus:outline-none transition-colors"
                  onClick={() => handleDelete(member.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {teamMembers.length === 0 && (
            <div className="text-gray-400 text-center py-4">
              No team members found. Add your first team member above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
