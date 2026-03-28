import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { hasPermission } from "./superadminboard";


function UsersList() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const usersPerPage = 5;
  const token = localStorage.getItem("token");

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // FETCH USERS
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/all`, axiosConfig);
       console.log("fetched:",res.data.data)
     setUsers(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error("Fetch Users Error:", err);
       setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // EDIT
  const handleEdit = (user) => {
    setEditingUser({ _id: user._id, name: user.name, email: user.email });
  };

  // UPDATE
  const handleSave = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/${editingUser._id}`,
        { name: editingUser.name, email: editingUser.email },
        axiosConfig
      );
      alert("User updated successfully");
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error("Update Error:", err);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/users/${id}`, axiosConfig);
      fetchUsers();
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  // SEARCH FILTER
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
  );

  // PAGINATION
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="container-fluid mt-4">
      <div className="card shadow border-0">
        <div className="card-body">
          {/* HEADER */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-bold">Users Management</h4>
            <div className="input-group" style={{ width: "250px" }}>
              <span className="input-group-text bg-primary text-white">
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search user..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* TABLE */}
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  {(hasPermission("users","edit") || hasPermission("users","delete")) && (
                  <th className="text-center">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                       <span
                          className={`badge ${
                            user.role?.name?.toLowerCase()=== "admin"
                              ? "bg-danger"
                              : user.role?.name?.toLowerCase() === "manager"
                              ? "bg-primary"
                              : "bg-success"
                          }`}
                        >
                          {user.roleType?.toUpperCase() || "USER"}
                        </span>
                      </td>
                      <td className="text-center">
                        {hasPermission("users","edit") && (
                        <button
                          onClick={() => handleEdit(user)}
                          className="btn btn-sm btn-outline-primary me-2"
                        >
                          <FaEdit />
                        </button>
                        )}
                        {hasPermission("users","delete") && (
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="btn btn-sm btn-outline-danger"
                        >
                          <FaTrash />
                        </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No Users Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* EDIT MODAL */}
          {editingUser && (
            <div className="edit-overlay">
              <div className="edit-card">
                <h4 className="text-center mb-4">Edit User</h4>
                <input
                  className="form-control mb-3"
                  value={editingUser.name}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, name: e.target.value })
                  }
                />
                <input
                  className="form-control mb-3"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                />
                <div className="d-flex justify-content-between">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setEditingUser(null)}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleSave}>
                    Update
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PAGINATION */}
          <div className="d-flex justify-content-end mt-3">
            <ul className="pagination">
              {[...Array(totalPages)].map((_, index) => (
                <li
                  key={index}
                  className={`page-item ${
                    currentPage === index + 1 ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UsersList;