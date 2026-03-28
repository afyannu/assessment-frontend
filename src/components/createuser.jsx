import React, { useEffect, useState } from "react";
import axios from "axios";

function CreateUser() {
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    roleId: ""
  });

  useEffect(() => {
    fetchRoles();
  }, []);

 const fetchRoles = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/api/roles`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  setRoles(res.data);
};
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");

  try {

    const selectedRole = roles.find(r => r._id === form.roleId);

    let url = "";

    if (selectedRole.name.toLowerCase() === "admin") {
      url = `${process.env.REACT_APP_API_URL}/api/admins/create`;
    } 
    else if (selectedRole.name.toLowerCase() === "manager") {
      url = `${process.env.REACT_APP_API_URL}/api/managers/create`;
    }

    await axios.post(
      url,
      form,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    alert("User Created Successfully");

    setForm({
      name: "",
      email: "",
      password: "",
      roleId: ""
    });

  } catch (err) {
    console.error(err);
    alert("Failed to create user");
  }
};

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create New User</h2>
        <p style={styles.subtitle}>Assign role and manage access permissions</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter full name"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email address"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label>Select Role</label>
            <select
              name="roleId"
              value={form.roleId}
              onChange={handleChange}
              required
              style={styles.input}
            >
              <option value="">-- Choose Role --</option>
              {roles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" style={styles.button}>
            Create User
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
 container: {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  // background: "linear-gradient(135deg, #667eea, #764ba2)",
  overflow: "hidden"
},

card: {
  background: "#fff",
  padding: "40px",
  width: "420px",
  maxHeight: "90vh",
  borderRadius: "15px",
  boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
  overflowY: "auto"  
},
  title: {
    marginBottom: "5px",
    fontWeight: "600"
  },
  subtitle: {
    marginBottom: "25px",
    fontSize: "14px",
    color: "#666"
  },
  form: {
    display: "flex",
    flexDirection: "column"
  },
  inputGroup: {
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    fontSize: "14px"
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    marginTop: "5px",
    fontSize: "14px",
    outline: "none"
  },
  button: {
    marginTop: "10px",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#667eea",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    transition: "0.3s"
  }
};

export default CreateUser;