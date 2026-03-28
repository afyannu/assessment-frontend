  import React, { useState, useEffect, useMemo } from "react";
  import axios from "axios";
  import Swal from "sweetalert2";
  import { useNavigate } from "react-router-dom";

  function Register() {
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();
    const [form, setForm] = useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      state: "",
      city: "",
      pincode: "",
    });

    const [errors, setErrors] = useState({});

    // Fetch States
    useEffect(() => {
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/location/states`)
        .then((res) => setStates(res.data))
        .catch((err) => console.log(err));
    }, []);

    // Fetch Cities based on state
    const handleStateChange = async (stateId) => {
      setForm({ ...form, state: stateId, city: "" });
      if (!stateId) return setCities([]);

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/location/cities/${stateId}`,
      );
      setCities(res.data);
    };

    // Password Strength Logic
    const getPasswordStrength = (password) => {
      let strength = 0;
      if (password.length >= 6) strength++;
      if (/[A-Z]/.test(password)) strength++;
      if (/[0-9]/.test(password)) strength++;
      if (/[^A-Za-z0-9]/.test(password)) strength++;
      return strength;
    };

    const strength = useMemo(() => {
      return getPasswordStrength(form.password);
    }, [form.password]);

    // Validation
    const validate = () => {
      let newErrors = {};

      if (!form.name.trim()) newErrors.name = "Name is required";

      if (!/^\S+@\S+\.\S+$/.test(form.email))
        newErrors.email = "Enter valid email";

      if (!/^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{6,}$/.test(form.password))
        newErrors.password =
          "Min 6 chars, 1 uppercase, 1 number, 1 special character";

      if (form.password !== form.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";

      if (!form.state) newErrors.state = "Select state";

      if (!form.city) newErrors.city = "Select city";

      if (!/^[0-9]{6}$/.test(form.pincode))
        newErrors.pincode = "Pincode must be 6 digits";

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    // Submit
    const submit = async (e) => {
      e.preventDefault();
      if (!validate()) return;

      try {
        setLoading(true);
        const selectedState = states.find((s) => s._id === form.state);
        const selectedCity = cities.find((c) => c._id === form.city);

        const payload = {
          ...form,
          stateName: selectedState?.name,
          cityName: selectedCity?.name,
        };

        await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, payload);

        setLoading(false);

        await Swal.fire({
          icon: "success",
          title: "🎉 Registration Successful!",
          html: `
      <p style="font-size:16px">
        Welcome <b>${form.name}</b> 🚀
      </p>
      <p>Redirecting to login page...</p>
    `,
          background: "#adf58c",
          color: "#fff",
          confirmButtonColor: "#c0f57b",
          timer: 2500,
          showConfirmButton: false,
          showClass: {
            popup: "animate__animated animate__zoomIn",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutDown",
          },
        });
        navigate("/");
        setForm({
          name: "",
          email: "",
          phone:"",
          password: "",
          confirmPassword: "",
          state: "",
          city: "",
          pincode: "",
        });
      } catch (err) {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: err.response?.data?.message || "Something went wrong",
        });
      }
    };

    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Create Account</h2>

          {/* Name */}
          <input
            className={`form-control mb-2 ${errors.name ? "is-invalid" : ""}`}
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <div className="text-danger small">{errors.name}</div>

          {/* Email */}
          <input
            type="email"
            className={`form-control mb-2 ${errors.email ? "is-invalid" : ""}`}
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          
          <div className="text-danger small">{errors.email}</div>
  {/* Phone */}
  <input
    type="text"
    className="form-control mb-2"
    placeholder="Phone Number"
    value={form.phone}
    onChange={(e) => setForm({ ...form, phone: e.target.value })}
  />
          {/* Password */}
          <div className="position-relative mb-2">
            <input
              type={showPassword ? "text" : "password"}
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
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
                color: "black",
              }}
              onClick={() => setShowPassword((prev) => !prev)}
            ></i>
          </div>

          {/* Strength Meter */}
          <div className="progress mb-1" style={{ height: "6px" }}>
            <div
              className={`progress-bar ${
                strength === 1
                  ? "bg-danger"
                  : strength === 2
                    ? "bg-warning"
                    : strength === 3
                      ? "bg-info"
                      : strength === 4
                        ? "bg-success"
                        : ""
              }`}
              style={{
                width: `${strength * 25}%`,
                transition: "width 0.4s ease-in-out",
              }}
            ></div>
          </div>

          <small className="fw-bold">
            {strength === 1 && <span className="text-danger">Weak</span>}
            {strength === 2 && <span className="text-warning">Fair</span>}
            {strength === 3 && <span className="text-info">Good</span>}
            {strength === 4 && <span className="text-success">Strong</span>}
          </small>

          <div className="text-danger small mt-1">{errors.password}</div>

          {/* Confirm Password */}
          <div className="position-relative mb-2">
            <input
              type={showConfirm ? "text" : "password"}
              className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
            />
            <i
              className={`bi ${showConfirm ? "bi-eye-slash" : "bi-eye"}`}
              style={{
                position: "absolute",
                right: "15px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                fontSize: "18px",
                color: "black",
              }}
              onClick={() => setShowConfirm((prev) => !prev)}
            ></i>
          </div>
          <div className="text-danger small">{errors.confirmPassword}</div>

          {/* State */}
          <select
            className={`form-control mb-2 ${errors.state ? "is-invalid" : ""}`}
            value={form.state}
            onChange={(e) => handleStateChange(e.target.value)}
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state._id} value={state._id}>
                {state.name}
              </option>
            ))}
          </select>
          <div className="text-danger small">{errors.state}</div>

          {/* City */}
          <select
            className={`form-control mb-2 ${errors.city ? "is-invalid" : ""}`}
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city._id} value={city._id}>
                {city.name}
              </option>
            ))}
          </select>
          <div className="text-danger small">{errors.city}</div>

          {/* Pincode */}
          <input
            type="text"
            inputMode="numeric"
            maxLength="6"
            className={`form-control mb-2 ${errors.pincode ? "is-invalid" : ""}`}
            placeholder="Pincode"
            value={form.pincode}
            onChange={(e) => setForm({ ...form, pincode: e.target.value })}
          />
          <div className="text-danger small">{errors.pincode}</div>

          {/* Submit */}
          <button
            className="btn btn-light w-100 mt-3"
            disabled={loading}
            onClick={submit}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm"></span>
            ) : (
              "Register"
            )}
          </button>
          <span>Already have an account?<a href="/login">Signin</a></span>
        </div>
      </div>
    );
  }

  export default Register;
