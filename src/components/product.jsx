import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);
  const { categoryId } = useParams();
  const [categories, setCategories] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock:"",
    image: null,
    status: true,
  });

  /* ================= FETCH ================= */

  const fetchCategories = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/categories`);
    setCategories(res.data);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [categoryId]);
  const fetchProducts = async () => {
    try {
      let url = `${process.env.REACT_APP_API_URL}/api/products`;

      if (categoryId) {
        url = `${process.env.REACT_APP_API_URL}/api/products/category/${categoryId}`;
      }

      const res = await axios.get(url);
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  /* ================= ADD / UPDATE ================= */

  const handleSubmit = async () => {
    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("status", formData.status);
      data.append("stock",formData.stock);

      if (formData.image) {
        data.append("image", formData.image);
      }

      if (editingProduct) {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/products/${editingProduct._id}`,
          data,
        );
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/products`, data);
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id) => {
    await axios.delete(`${process.env.REACT_APP_API_URL}/api/products/${id}`);
    fetchProducts();
  };

  /* ================= EDIT ================= */

  const handleEdit = (product) => {
    setEditingProduct(product);

    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category?._id,
      image: null,
      status: product.status,
      stock:product.stock,
    });

    setShowForm(true);
  };

  /* ================= RESET ================= */

  const resetForm = () => {
    setShowForm(false);
    setEditingProduct(null);

    setFormData({
      name: "",
      price: "",
      description: "",
      category: "",
      image: null,
      status: true,
      stock:"",
    });
  };
const permissions = JSON.parse(localStorage.getItem("permissions"));


  return (
    <div className="container-fluid p-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">Product Management</h3>

        <button
          className="btn btn-primary px-4"
          onClick={() => setShowForm(true)}
        >
          + Add Product
        </button>
      </div>

      {/* PRODUCT CARDS */}

      <div className="row g-4 mt-2">
        {products.map((product) => (
          <div key={product._id} className="col-md-4 col-lg-3">
            <div className="product-card">
              {/* Image */}
              <div className="product-image">
                <img
                  style={{ objectFit: "contain" }}
                  src={`${process.env.REACT_APP_API_URL}/${product.image}`}
                  alt={product.name}
                />

                {/* Status Badge */}
                <span
                  className={`status-badge ${
                    product.status ? "active" : "inactive"
                  }`}
                >
                  {product.status ? "Active" : "Inactive"}
                </span>

                <div className="product-actions">
                    {permissions?.products?.edit  && (
                  <button
                    className="action-btn edit-btn"
                    onClick={() => handleEdit(product)}
                  >
                    ✏
                  </button>
                    )}
                    {permissions?.products?.delete && (

                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(product._id)}
                  >
                    🗑
                  </button>
                    )}
                </div>
              </div>

              {/* Card Body */}
              <div className="product-body">
                <h6 className="product-title">Product Name: {product.name}</h6>

                <p className="product-desc">{product.description}</p>

                <div className="product-price">Price: ₹{product.price}</div>
                <div className={product.stock < 5 ? "text-danger" : "text-success"}>Stock: {product.stock}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= MODAL FORM ================= */}

      {showForm && (
        <div className="edit-overlay">
          <div className="edit-card">
            <h5 className="mb-3">
              {editingProduct ? "Edit Product" : "Add Product"}
            </h5>
             {editingProduct && editingProduct.image && (
              <img
                src={`${process.env.REACT_APP_API_URL}/${editingProduct.image}`}
                alt="preview"
                width="80"
                className="mb-3 rounded"
              />
            )}
            <input
              className="form-control mb-2"
              placeholder="Product Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <input
              type="number"
              className="form-control mb-2"
              placeholder="Price"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
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

            {/* CATEGORY */}

            <select
              className="form-select mb-2"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value="">Select Category</option>

              {categories
                .filter((cat) => cat.parentCategory) // only child categories
                .map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
            </select>

            {/* IMAGE */}

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
           <input type="text"
           value={formData.stock}
            inputMode="numeric" 
           maxLength="6"
            className="form-control mb-3"
            placeholder="Enter no of stock"
           onChange={(e)=>setFormData({
            ...formData,
            stock:e.target.value
           })}
           />
            {/* STATUS */}

            <div className="form-check form-switch mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                checked={formData.status === true}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.checked,
                  })
                }
              />

              <label className="form-check-label">Active</label>
            </div>

            {/* BUTTONS */}

            <div className="d-flex justify-content-between">
              <button className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>

              <button className="btn btn-success" onClick={handleSubmit}>
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
