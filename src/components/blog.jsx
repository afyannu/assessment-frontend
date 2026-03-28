import React, { useEffect, useState } from "react";
import axios from "axios";

function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    image: null,
    startDate: "",
    endDate: "",
    status: true,
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/blogs`)
    setBlogs(res.data);
  };

  const handleSubmit = async () => {
    const data = new FormData();

    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("content", formData.content);
    data.append("status", formData.status);
    data.append("startDate", formData.startDate);
    data.append("endDate", formData.endDate);

    if (formData.image) {
      data.append("image", formData.image);
    }

    if (editing) {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/blogs/${editing._id}`, data);
    } else {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/blogs`, data);
    }

    fetchBlogs();
    resetForm();
  };

  const resetForm = () => {
    setShowForm(false);
    setEditing(null);
    setFormData({
      title: "",
      description: "",
      content: "",
      image: null,
      status: true,
    });
  };

  const handleDelete = async (id) => {
    await axios.delete(`${process.env.REACT_APP_API_URL}/api/blogs/${id}`);
    fetchBlogs();
  };
  const permissions = JSON.parse(localStorage.getItem("permissions"));

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between mb-4">
        <h3>Blog Management</h3>

        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Add Blog
        </button>
      </div>

      <div className="row">
        {blogs.map((blog) => (
          <div key={blog._id} className="col-md-4 mb-4">
            <div className="card shadow blog-card">
              <img
                src={`${process.env.REACT_APP_API_URL}/${blog.image}`}
                className="card-img-top"
                height="200"
              />

              <div className="card-body">
                <h5>{blog.title}</h5>

                <p className="text-muted">{blog.description}</p>

                <span
                  className={`badge ${blog.status ? "bg-success" : "bg-secondary"}`}
                >
                  {blog.status ? "Published" : "Draft"}
                </span>

                <p className="text-muted">
                  📅 {new Date(blog.startDate).toLocaleDateString()}-
                  {new Date(blog.endDate).toLocaleDateString()}
                </p>

                <div className="mt-3">
                  {permissions?.blog?.edit && (
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => {
                        setEditing(blog);
                        setFormData({
                          title: blog.title,
                          description: blog.description,
                          content: blog.content,
                          image: null,
                          status: blog.status,
                        });
                        setShowForm(true);
                      }}
                    >
                      Edit
                    </button>
                  )}
                  {permissions?.blog?.delete && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(blog._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="edit-overlay">
          <div className="edit-card">
            <h5>{editing ? "Edit Blog" : "Add Blog"}</h5>

            <input
              className="form-control mb-2"
              placeholder="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
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

            <textarea
              className="form-control mb-2"
              placeholder="Content"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
            />

            <input
              type="file"
              className="form-control mb-2"
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.files[0] })
              }
            />

            <div className="form-check form-switch mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                checked={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.checked,
                  })
                }
              />

              <label>Published</label>
            </div>
            <input
              type="date"
              className="form-control mb-2"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
            />

            <input
              type="date"
              className="form-control mb-2"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
            />
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

export default Blog;
