import React, { useEffect, useState } from "react";
import axios from "axios";
import { hasPermission } from "./superadminboard";
function Customers() {
  const [customers, setCustomers] = useState([]);
  const [state, setState] = useState([]);
  const [city, setCity] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    states: "",
    cities: "",
    status: "Active",
  });

  // ✅ Fetch Customers
  const fetchCustomers = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/customers`);
    setCustomers(res.data);
  };

  const fetchStates = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/location/states`);
    setState(res.data);
  };

  const fetchCities = async (stateId) => {
    if (!stateId) return; // 🔥 STOP if empty

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/location/cities/${stateId}`,
      );
      setCity(res.data);
    } catch (error) {
      console.error("City fetch error:", error);
    }
  };
  useEffect(() => {
    fetchCustomers();
    fetchStates();
  }, []);

  // ✅ Handle Submit
  const handleSubmit = async () => {
    try {
      if (editingCustomer) {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/customers/${editingCustomer._id}`,
          formData,
        );
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/customers`, formData);
      }

      resetForm();
      fetchCustomers();
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ Reset Form
  const resetForm = () => {
    setShowForm(false);
    setEditingCustomer(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      states: "",
      cities: "",
      status: "Active",
    });
  };

  // ✅ Edit
  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      password: "",
      states: customer.states?._id || "",
      cities: customer.cities?._id || "",
      status: customer.status,
    });
    setShowForm(true);
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    await axios.delete(`${process.env.REACT_APP_API_URL}/api/customers/${id}`);
    fetchCustomers();
  };


  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">Customer Management</h3>
        {hasPermission("customers", "add") && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            + Add Customer
          </button>
        )}
      </div>

      {/* Table */}
      <div className="card shadow-sm rounded-4">
        <div className="card-body">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>State</th>
                <th>City</th>
                <th>Status</th>
                {(hasPermission("customers", "edit") || hasPermission("customers", "delete")) && (
                  <th className="text-center">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {customers.map((cust) => (
                <tr key={cust._id}>
                  <td>
                    <div className="d-flex align-items-center">
                      {" "}
                      <div className="avatar-circle me-2">
                        {" "}
                        {cust.name.charAt(0).toUpperCase()}{" "}
                      </div>{" "}
                      {cust.name}{" "}
                    </div>
                  </td>
                  <td>{cust.email}</td>
                  <td>{cust.phone}</td>
                  <td>{cust.states?.name}</td>
                  <td>{cust.cities?.name}</td>
                  <td>
                    <span
                      className={`badge bg-${cust.status === "Active" ? "success" : "secondary"
                        }`}
                    >
                      {cust.status}
                    </span>
                  </td>

                  <td className="text-center">
                    {hasPermission("customers", "edit") && (
                      <button
                        className="btn btn-sm btn-light me-2"
                        onClick={() => handleEdit(cust)}
                      >
                        ✏️
                      </button>
                    )}

                    {hasPermission("customers", "delete") && (
                      <button
                        className="btn btn-sm btn-light"
                        onClick={() => handleDelete(cust._id)}
                      >
                        🗑️
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {customers.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-muted">
                    No customers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="edit-overlay">
          <div className="edit-card">
            <h5 className="mb-3">
              {editingCustomer ? "Edit Customer" : "Add Customer"}
            </h5>

            <input
              className="form-control mb-2"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <input
              type="email"
              className="form-control mb-2"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            <input
              className="form-control mb-2"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />

            {!editingCustomer && (
              <input
                type="password"
                className="form-control mb-2"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            )}

            <select
              className="form-select mb-2"
              value={formData.states}
              onChange={(e) => {
                const selectedState = e.target.value;
                setFormData({ ...formData, states: selectedState, city: "" });
                fetchCities(selectedState);
              }}
            >
              <option value="">Select State</option>
              {state.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>

            <select
              className="form-select mb-3"
              value={formData.cities}
              onChange={(e) =>
                setFormData({ ...formData, cities: e.target.value })
              }
            >
              <option value="">Select City</option>
              {city.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              className="form-select mb-3"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <div className="d-flex justify-content-between">
              <button className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
              <button className="btn btn-success" onClick={handleSubmit}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customers;
