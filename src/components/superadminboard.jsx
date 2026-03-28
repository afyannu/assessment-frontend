import React, { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import Dashboard from "./home";
import UsersList from "./users";
import CreateRole from "./createrole";
import CreateUser from "./createuser";
import Customers from "./customers";
import Categories from "./category";
import Products from "./product";
import Blog from "./blog";
import Profile from "./profile";
import ProtectedRoute from "./protectedroutes";

import {
  FaUserShield,
  FaUserCircle,
  FaUserFriends,
  FaBox,
  FaTags,
  FaBlog,
  FaSignOutAlt,
  FaTachometerAlt,
} from "react-icons/fa";


/* ================= PERMISSION FUNCTION ================= */
export const hasPermission = (module, action) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const permissions = JSON.parse(localStorage.getItem("permissions") || "{}");

  // Super Admin → full access
  if (user.role === "Super Admin") return true;

  // Safely check permissions
  return !!permissions?.[module]?.[action];
};

/* ================= SIDEBAR ================= */
const Sidebar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [categories, setCategories] = useState([]);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
  const fetchCategories = async () => {
  try {

    const token = localStorage.getItem("token");

    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/categories`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setCategories(res.data);

  } catch (err) {
    console.error(err);
  }
};
    fetchCategories();
  }, []);

  return (
    <div
      className="d-flex flex-column p-3 text-white position-fixed shadow-lg"
      style={{
        width: "260px",
        height: "100vh",
        background: "linear-gradient(180deg,#1e3c72,#2a5298)",
      }}
    >
      <h4 className="text-center mb-4 fw-bold">
        {user?.role?.toUpperCase()} PANEL
      </h4>

      <ul className="nav nav-pills flex-column mb-auto">
        {/* Dashboard */}
        <li className="nav-item mb-2">
          <NavLink to="/superadmin" end className="nav-link text-white">
            <FaTachometerAlt className="me-2" /> Dashboard
          </NavLink>
        </li>

        {/* Access Management */}
        {(hasPermission("users", "view") || hasPermission("users", "add")) && (
  <li className="mb-2">

    <a
      className="nav-link text-white d-flex justify-content-between"
      data-bs-toggle="collapse"
      href="#accessMenu"
    >
      <span><FaUserShield className="me-2" /> Access Management</span> ▾
    </a>

    <ul id="accessMenu" className="nav flex-column collapse mt-2">

    
      {(user.role === "Super Admin" || user.role === "Admin") && (
        <li>
          <NavLink to="/superadmin/access/create-role" className="nav-link text-white">
            Create Role
          </NavLink>
        </li>
      )}

  {(user.role === "Super Admin" || user.role === "Admin" || hasPermission("users", "add")) && (
        <li>
          <NavLink to="/superadmin/access/create-user" className="nav-link text-white">
            Create User
          </NavLink>
        </li>
      )}

      {hasPermission("users", "view") && (
        <li>
          <NavLink to="/superadmin/users" className="nav-link text-white">
            Users List
          </NavLink>
        </li>
      )}

    </ul>

  </li>
)}

        {/* Customers */}
        <li className="mb-2">
          <NavLink to="/superadmin/customers" className="nav-link text-white">
            <FaUserFriends className="me-2" /> Customers
          </NavLink>
        </li>

        {/* Category */}
        {hasPermission("category", "view") && (
          <li className="mb-2">
            <NavLink to="/superadmin/category" className="nav-link text-white">
              <FaTags className="me-2" /> Category
            </NavLink>
          </li>
        )}

        {/* Products */}
        {hasPermission("products", "view") && (
          <li className="mb-2">
            <a
              className="nav-link text-white d-flex justify-content-between"
              data-bs-toggle="collapse"
              href="#productMenu"
            >
              <span>
                <FaBox className="me-2" /> Products
              </span>{" "}
              ▾
            </a>
            <div className="collapse ps-3" id="productMenu">
              <ul className="nav flex-column mt-2">
                {categories
                  .filter((cat) => !cat.parentCategory)
                  .map((parent) => (
                    <li key={parent._id}>
                      <NavLink
                        to={`/superadmin/products/${parent._id}`}
                        className="nav-link text-white"
                      >
                        {parent.name}
                      </NavLink>
                      {categories
                        .filter(
                          (child) => child.parentCategory?._id === parent._id,
                        )
                        .map((child) => (
                          <NavLink
                            key={child._id}
                            to={`/superadmin/products/${child._id}`}
                            className="nav-link text-white ms-3"
                          >
                            └ {child.name}
                          </NavLink>
                        ))}
                    </li>
                  ))}
              </ul>
            </div>
          </li>
        )}

        {/* Blog */}
        {hasPermission("blog", "view") && (
          <li className="mb-2">
            <NavLink to="/superadmin/blog" className="nav-link text-white">
              <FaBlog className="me-2" /> Blog
            </NavLink>
          </li>
        )}
      </ul>
<li className="mb-2">
  <NavLink to="/superadmin/profile" className="nav-link text-white">
    <FaUserCircle className="me-2" /> My Profile
  </NavLink>
</li>
      <hr />
      <button onClick={logout} className="btn btn-light text-danger fw-bold">
        <FaSignOutAlt className="me-2" /> Logout
      </button>
    </div>
  );
};

/* ================= TOPBAR ================= */
const Topbar = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return (
    <nav className="navbar navbar-expand bg-white shadow-sm px-4">
      <div className="ms-auto">
        Welcome, <strong>{user?.name}</strong>
      </div>
    </nav>
  );
};

/* ================= MAIN DASHBOARD ================= */
const SuperAdminDashboard = () => {
  return (
    <div>
      <Sidebar />
      <div
        style={{
          marginLeft: "260px",
          minHeight: "100vh",
          backgroundColor: "#f4f6f9",
        }}
      >
        <Topbar />
        <Routes>
          <Route index element={<Dashboard />} />

          <Route path="access">
            <Route path="create-role" element={<CreateRole />} />
            <Route
              path="create-user"
              element={
                <ProtectedRoute module="users" action="add">
                  <CreateUser />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route
            path="users"
            element={
              <ProtectedRoute module="users" action="view">
                <UsersList />
              </ProtectedRoute>
            }
          />

          <Route path="customers" element={<Customers />} />

          <Route
            path="category"
            element={
              <ProtectedRoute module="category" action="view">
                <Categories />
              </ProtectedRoute>
            }
          />

          <Route path="products/:categoryId" element={<Products />} />
          <Route path="products" element={<Products />} />

          <Route
            path="blog"
            element={
              <ProtectedRoute module="blog" action="view">
                <Blog />
              </ProtectedRoute>
            }
          />
          <Route path="profile"
          element={
            <ProtectedRoute>
              <Profile/>
            </ProtectedRoute>
          }
          />
        </Routes>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
