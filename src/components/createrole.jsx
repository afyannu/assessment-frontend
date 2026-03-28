import React, { useState } from "react";
import api from "../services/api";

const modulesList = ["users", "products", "customers", "category", "blog"];
const actionsList = ["view", "add", "edit", "delete"];

function CreateRole() {
  const [roleName, setRoleName] = useState("");
  const [loading, setLoading] = useState(false);

  const [permissions, setPermissions] = useState(
    modulesList.reduce((acc, module) => {
      acc[module] = actionsList.reduce((a, action) => {
        a[action] = false;
        return a;
      }, {});
      return acc;
    }, {})
  );

  const handlePermissionChange = (module, action) => {
    setPermissions({
      ...permissions,
      [module]: { ...permissions[module], [action]: !permissions[module][action] },
    });
  };

  const handleModuleSelectAll = (module) => {
    const allSelected = Object.values(permissions[module]).every(Boolean);
    const updatedModule = actionsList.reduce((a, action) => {
      a[action] = !allSelected;
      return a;
    }, {});
    setPermissions({ ...permissions, [module]: updatedModule });
  };

  const handleSelectAll = () => {
    const allSelected = modulesList.every((module) =>
      Object.values(permissions[module]).every(Boolean)
    );

    const updatedPermissions = modulesList.reduce((acc, module) => {
      acc[module] = actionsList.reduce((a, action) => {
        a[action] = !allSelected;
        return a;
      }, {});
      return acc;
    }, {});

    setPermissions(updatedPermissions);
  };

  const handleSubmit = async () => {
    if (!roleName) {
      alert("Role name is required");
      return;
    }

    try {
      setLoading(true);
      await api.post("/roles/create", { name: roleName, permissions });
      alert("Role Created Successfully");
      setRoleName("");
    } catch (error) {
      alert(error.response?.data?.message || "Error creating role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-10">

          <div className="card shadow">

            {/* Header */}
            <div
              className="card-header text-white"
              style={{
                background: "linear-gradient(135deg,#667eea,#764ba2)"
              }}
            >
              <h5 className="mb-0">Create Role</h5>
            </div>

            <div className="card-body">

              {/* Role name */}
              <div className="row mb-4 align-items-end">

                <div className="col-md-6">
                  <label className="form-label">Role Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Admin / Manager / Customer"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                  />
                </div>

                <div className="col-md-6 text-end">
                  <button
                    className="btn btn-outline-dark"
                    onClick={handleSelectAll}
                  >
                    Toggle Select All
                  </button>
                </div>

              </div>

              {/* Permissions Table */}

              <div className="table-responsive">
                <table className="table table-bordered text-center align-middle">

                  <thead className="table-light">
                    <tr>
                      <th style={{ width: 150 }}>Module</th>
                      <th style={{ width: 120 }}>Select All</th>

                      {actionsList.map((action) => (
                        <th key={action} style={{ width: 80 }}>
                          {action}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>

                    {modulesList.map((module) => (

                      <tr key={module}>

                        <td className="text-capitalize fw-semibold">
                          {module}
                        </td>

                        <td>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={Object.values(permissions[module]).every(Boolean)}
                            onChange={() => handleModuleSelectAll(module)}
                          />
                        </td>

                        {actionsList.map((action) => (
                          <td key={action}>
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={permissions[module][action]}
                              onChange={() => handlePermissionChange(module, action)}
                            />
                          </td>
                        ))}

                      </tr>

                    ))}

                  </tbody>

                </table>
              </div>

              {/* Save Button */}

              <div className="text-center mt-4">

                <button
                  className="btn btn-success btn-lg"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Role"}
                </button>

              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default CreateRole;