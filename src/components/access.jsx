import React, { useEffect, useState } from "react";
import api from "../services/api";

const AccessManagement = () => {
  const [view, setView] = useState(""); // role or user
  const [roles, setRoles] = useState([]);

  const [roleName, setRoleName] = useState("");
  const [permissions, setPermissions] = useState({
    users: { view: false, add: false, edit: false, delete: false },
    products: { view: false, add: false, edit: false, delete: false },
    blog: { view: false, add: false, edit: false, delete: false },
  });

  const [userForm, setUserForm] = useState({});

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    const res = await api.get("/api/roles");
    setRoles(res.data);
  };

  const handlePermissionChange = (module, action) => {
    setPermissions({
      ...permissions,
      [module]: {
        ...permissions[module],
        [action]: !permissions[module][action],
      },
    });
  };

  const createRole = async () => {
    await api.post("/roles/create", { name: roleName, permissions });
    alert("Role Created");
    setRoleName("");
    fetchRoles();
  };

  const createUser = async () => {
    await api.post("/users/create", userForm);
    alert("User Created");
  };

  return (
    <div className="container mt-4">

      {/* HEADER + DROPDOWN */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Access Management</h3>

        <div className="dropdown">
          <button
            className="btn btn-primary dropdown-toggle"
            data-bs-toggle="dropdown"
          >
            + Create
          </button>

          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <button
                className="dropdown-item"
                onClick={() => setView("role")}
              >
                Create Role
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => setView("user")}
              >
                Create User
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* ================= CREATE ROLE ================= */}
      {view === "role" && (
        <div className="card p-4 shadow-lg border-0">
          <h4>Create Role</h4>

          <input
            className="form-control mb-3"
            placeholder="Role Name"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
          />

          <table className="table text-center">
            <thead>
              <tr>
                <th>Module</th>
                <th>View</th>
                <th>Add</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>

            <tbody>
              {Object.keys(permissions).map((module) => (
                <tr key={module}>
                  <td className="text-capitalize">{module}</td>
                  {["view", "add", "edit", "delete"].map((action) => (
                    <td key={action}>
                      <input
                        type="checkbox"
                        checked={permissions[module][action]}
                        onChange={() =>
                          handlePermissionChange(module, action)
                        }
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <button className="btn btn-success" onClick={createRole}>
            Save Role
          </button>
        </div>
      )}

      {/* ================= CREATE USER ================= */}
      {view === "user" && (
        <div className="card p-4 shadow-lg border-0">
          <h4>Create Admin / Manager / Employee</h4>

          <input
            className="form-control mb-3"
            placeholder="Name"
            onChange={(e) =>
              setUserForm({ ...userForm, name: e.target.value })
            }
          />

          <input
            className="form-control mb-3"
            placeholder="Email"
            onChange={(e) =>
              setUserForm({ ...userForm, email: e.target.value })
            }
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            onChange={(e) =>
              setUserForm({ ...userForm, password: e.target.value })
            }
          />

          <select
            className="form-control mb-3"
            onChange={(e) =>
              setUserForm({ ...userForm, role: e.target.value })
            }
          >
            <option>Select Role</option>
            {roles.map((role) => (
              <option key={role._id} value={role._id}>
                {role.name}
              </option>
            ))}
          </select>

          <button className="btn btn-success" onClick={createUser}>
            Create User
          </button>
        </div>
      )}
    </div>
  );
};

export default AccessManagement;