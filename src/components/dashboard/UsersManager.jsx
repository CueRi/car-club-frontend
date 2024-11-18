import { useState, useEffect } from "react";
import { createApiClient, handleApiError } from "../../utils/apiUtils";

function UsersManager() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await createApiClient().get("/admins");
        setUsers(response.data);
      } catch (error) {
        handleApiError(error);
      }
    };
    fetchUsers();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await createApiClient().post(
        "/admins/register",
        newUser
      );
      setUsers([...users, response.data]);
      setNewUser({ username: "", password: "" });
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleRemoveUser = async (id) => {
    try {
      await createApiClient().delete(`/admins/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-yellow-500 mb-6">Manage Users</h2>

      <form
        onSubmit={handleAddUser}
        className="bg-gray-900 p-6 rounded-lg space-y-4"
      >
        <h3 className="text-xl text-yellow-500 mb-4">Add New User</h3>
        <input
          type="text"
          placeholder="Username"
          className="bg-gray-800 text-white p-2 rounded w-full"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="bg-gray-800 text-white p-2 rounded w-full"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
        />
        <button
          type="submit"
          className="bg-yellow-500 text-black px-4 py-2 rounded"
        >
          Add User
        </button>
      </form>

      <table className="w-full bg-gray-900 rounded-lg overflow-hidden">
        <thead className="bg-gray-800">
          <tr>
            <th className="p-4 text-left text-yellow-500">Username</th>
            <th className="p-4 text-left text-yellow-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t border-gray-800">
              <td className="p-4 text-white">{user.username}</td>
              <td className="p-4">
                <button
                  onClick={() => handleRemoveUser(user.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsersManager;
