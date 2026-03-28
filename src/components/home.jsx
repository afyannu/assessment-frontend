import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function Home() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        users: 0,
        admins: 0,
        managers: 0,
        customers: 0,
        products: 0,
        categories: 0
    });

    const [categoryData, setCategoryData] = useState({ labels: [], counts: [] });
    const [recentBlogs, setRecentBlogs] = useState([]);

    useEffect(() => {
        fetchStats();
        fetchBlogs();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/stats`);
            
            setStats({
                users: res.data.users,
                admins: res.data.admins,
                managers: res.data.managers,
                customers: res.data.customers,
                products: res.data.products,
                categories: res.data.categories
            });

            setCategoryData({
                labels: res.data.categoryStats.map(c => c.name),
                counts: res.data.categoryStats.map(c => c.count)
            });

        } catch (err) {
            console.log(err);
        }
    };

    const fetchBlogs = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/blogs`);
            setRecentBlogs(res.data.slice(0, 5));
        } catch (err) {
            console.log(err);
        }
    };

    const chartData = {
        labels: categoryData.labels,
        datasets: [
            {
                data: categoryData.counts,
                backgroundColor: [
                    "#4f46e5", "#22c55e", "#f59e0b", "#ef4444",
                    "#8b5cf6", "#14b8a6", "#f97316", "#f43f5e"
                ],
                hoverBackgroundColor: [
                    "#6366f1", "#16a34a", "#fbbf24", "#dc2626",
                    "#a78bfa", "#2dd4bf", "#fb923c", "#f43f5e"
                ],
                borderWidth: 0
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    padding: 20,
                    boxWidth: 15,
                    font: { size: 13 }
                }
            }
        },
        cutout: "75%"
    };

    return (
        <div className="container-fluid">
            <h3 className="mb-4">Dashboard Overview</h3>

            {/* STATS CARDS */}
            <div className="row g-4 mb-4">
                <div className="col-md-3">
                    <div className="card stat-card shadow">
                        <div className="card-body">
                            <h6>Total Users</h6>
                            <h3>{stats.users}</h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card stat-card shadow">
                        <div className="card-body">
                            <h6>Total Customers</h6>
                            <h3>{stats.customers}</h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card stat-card shadow">
                        <div className="card-body">
                            <h6>Total Products</h6>
                            <h3>{stats.products}</h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card stat-card shadow">
                        <div className="card-body">
                            <h6>Total Categories</h6>
                            <h3>{stats.categories}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* DYNAMIC CHART */}
            <div className="card shadow mb-4">
                <div className="card-body">
                    <h5 className="mb-3">Product Categories</h5>
                    <div style={{ width: "1000px", margin: "auto", height: "500px" }}>
                        <Doughnut data={chartData} options={chartOptions} />
                    </div>
                </div>
            </div>

            {/* RECENT BLOGS */}
            <div className="card shadow mb-4">
                <div className="card-body">
                    <h5 className="mb-3">Recent Blogs</h5>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentBlogs.map(blog => (
                                <tr key={blog._id}>
                                    <td>{blog.title}</td>
                                    <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* QUICK ACTION */}
            <div className="card shadow">
                <div className="card-body">
                    <h5 className="mb-3">Quick Actions</h5>
                    <button className="btn btn-primary me-2" onClick={() => navigate("/superadmin/access/create-user")}>Create User</button>
                    <button className="btn btn-success me-2" onClick={() => navigate("/superadmin/products")}>Add Product</button>
                    <button className="btn btn-warning me-2" onClick={() => navigate("/superadmin/category")}>Add Category</button>
                    <button className="btn btn-info" onClick={() => navigate("/superadmin/blog")}>Create Blog</button>
                </div>
            </div>
        </div>
    );
}

export default Home;