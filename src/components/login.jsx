import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Validation
  const validate = () => {
    let err = {};

    if (!form.email.trim()) {
      err.email = "Email is required";
    }

    if (!form.password || form.password.length < 6) {
      err.password = "Password must be at least 6 characters";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // Login Submit
const submit = async (e) => {
  e.preventDefault();

  if (!validate()) return;

  setLoading(true);

  try {
    const res = await axios.post(
       `${process.env.REACT_APP_API_URL}/api/auth/login`,
      {
        email: form.email,
        password: form.password,
      }
    );
    

const user = res.data.user;

localStorage.setItem("token", res.data.token);
localStorage.setItem("user", JSON.stringify(res.data.user));
localStorage.setItem("permissions", JSON.stringify(res.data.user.permissions));

    // success alert
    await Swal.fire({
      icon: "success",
      title: "Login Successful 🚀",
      html: `<p style="font-size:16px">Welcome back <b>${user.email}</b></p>`,
      background: "#1e293b",
      color: "#fff",
      confirmButtonColor: "#22c55e",
      timer: 2000,
      showConfirmButton: false,
    });

    // ALWAYS go to same dashboard
    navigate("/superadmin");

  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Login Failed",
      text:
        err.response?.data?.message ||
        "Invalid email or password",
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h2 className="auth-title">Welcome Back</h2>

        {/* Email */}
        <input
          type="email"
          className={`form-control mb-1 ${errors.email && "is-invalid"}`}
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />
        <div className="text-danger small">{errors.email}</div>

        {/* Password */}
        <div className="position-relative mb-1">
          <input
            type={showPassword ? "text" : "password"}
            className={`form-control ${errors.password && "is-invalid"}`}
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <i
            className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
            style={{
              position: "absolute",
              right: "15px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              fontSize: "18px",
            }}
            onClick={() => setShowPassword(!showPassword)}
          />
        </div>

        <div className="text-danger small">{errors.password}</div>

        {/* Login Button */}
        <button
          className="btn btn-info w-100 mt-3"
          disabled={loading}
          onClick={submit}
        >
          {loading ? (
            <span className="spinner-border spinner-border-sm"></span>
          ) : (
            "Login"
          )}
        </button>

        <div className="mt-3 text-center">
          Don't have an account? <a href="/register">Signup</a>
        </div>

      </div>
    </div>
  );
}

export default Login;