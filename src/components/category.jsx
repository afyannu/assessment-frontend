import React, { useEffect, useState } from "react";
import axios from "axios";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parentCategory: "",
    status: true,
    image: null,
  });

  // ================= FETCH =================
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/categories`);
      setCategories(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ================= EDIT =================
  const handleEdit = (category) => {
    setEditing(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      parentCategory: category.parentCategory?._id || "",
      status: category.status,
      image: null,
    });
    setShowForm(true);
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    await axios.delete(`${process.env.REACT_APP_API_URL}/api/categories/${id}`);
    fetchCategories();
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("parentCategory", formData.parentCategory);
    data.append("status", formData.status);
    if (formData.image) data.append("image", formData.image);

    try {
      if (editing) {
        await axios.put(
        `${process.env.REACT_APP_API_URL}/api/categories/${editing._id}`,
          data
        );
      } else {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/categories`,
          data
        );
      }

      resetForm();
      fetchCategories();
    } catch (error) {
      console.error(error);
    }
  };

  // ================= RESET =================
  const resetForm = () => {
    setShowForm(false);
    setEditing(null);
    setFormData({
      name: "",
      description: "",
      parentCategory: "",
      status: true,
      image: null,
    });
  };
const permissions = JSON.parse(localStorage.getItem("permissions"));

  // ================= UI =================
  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between mb-4">
        <h3>Category Management</h3>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          + Add Category
        </button>
      </div>

      {/* ================= TREE VIEW ================= */}
      <div className="card shadow-sm rounded-4">
        <div className="card-body">

          {categories
            .filter((cat) => !cat.parentCategory)
            .map((parent) => (
              <div key={parent._id} className="mb-4">

                {/* Parent */}
                <div className="d-flex justify-content-between align-items-center fw-bold fs-5">
                  <div className="d-flex align-items-center">
                    {parent.image && (
                      <img
                        src={`${process.env.REACT_APP_API_URL}/${parent.image}`}
                        alt="category"
                        width="40"
                        height="40"
                        className="me-2 rounded"
                      />
                    )}
                    📁 {parent.name}
                    <span className="ms-3 badge bg-secondary">
                      {parent.status ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div>
                    {permissions?.category?.edit  && (
                    <button
                      className="btn btn-sm btn-light me-2"
                      onClick={() => handleEdit(parent)}
                    >
                      ✏️
                    </button>
                    )}
                     {permissions?.category?.delete  && (
                    <button
                      className="btn btn-sm btn-light"
                      onClick={() => handleDelete(parent._id)}
                    >
                      🗑️
                    </button>
                     )}
                  </div>
                </div>

                {/* Subcategories */}
                {categories
                  .filter(
                    (child) =>
                      child.parentCategory?._id === parent._id
                  )
                  .map((child) => (
                    <div
                      key={child._id}
                      className="ms-5 mt-2 d-flex justify-content-between align-items-center"
                    >
                      <div className="d-flex align-items-center">
                        {child.image && (
                          <img
                            src={`${process.env.REACT_APP_API_URL}/${child.image}`}
                            alt="subcategory"
                            width="35"
                            height="35"
                            className="me-2 rounded"
                          />
                        )}
                        └── 📂 {child.name}
                        <span className="ms-3 badge bg-info">
                          {child.status ? "Active" : "Inactive"}
                        </span>
                      </div>

                      <div>
                           {permissions?.category?.edit  && (
                        <button
                          className="btn btn-sm btn-light me-2"
                          onClick={() => handleEdit(child)}
                        >
                          ✏️
                        </button>
                           )}
                           {permissions?.category?.delete  && (
                        <button
                          className="btn btn-sm btn-light"
                          onClick={() => handleDelete(child._id)}
                        >
                          🗑️
                        </button>
                           )}
                      </div>
                    </div>
                  ))}

              </div>
            ))}
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {showForm && (
        <div className="edit-overlay">
          <div className="edit-card">
            <h5 className="mb-3">
              {editing ? "Edit Category" : "Add Category"}
            </h5>

            {editing && editing.image && (
              <img
                src={`${process.env.REACT_APP_API_URL}/${editing.image}`}
                alt="preview"
                width="80"
                className="mb-3 rounded"
              />
            )}

            <input
              className="form-control mb-2"
              placeholder="Category Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <textarea
              className="form-control mb-2"
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <select
              className="form-select mb-2"
              value={formData.parentCategory}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  parentCategory: e.target.value,
                })
              }
            >
              <option value="">Main Category</option>
              {categories
                .filter((cat) => !cat.parentCategory)
                .map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
            </select>

            <input
              type="file"
              className="form-control mb-3"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  image: e.target.files[0],
                })
              }
            />

            <div className="form-check form-switch mb-3">
              <input
                type="checkbox"
                className="form-check-input"
                checked={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.checked,
                  })
                }
              />
              <label className="form-check-label">Active</label>
            </div>

            <div className="d-flex justify-content-between">
              <button
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Cancel
              </button>
              <button
                className="btn btn-success"
                onClick={handleSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Categories;