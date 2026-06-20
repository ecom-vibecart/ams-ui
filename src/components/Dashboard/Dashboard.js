import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../Services/service';
import './Dashboard.css';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await axios.get(API.users);
      const arr = Array.isArray(data) ? data : (data.data || []);
      setUsers(arr);
    };
    const fetchCustomers = async () => {
      const { data } = await axios.get(API.customers);
      const arr = Array.isArray(data) ? data : (data.data || []);
      setCustomers(arr);
    };
    Promise.all([fetchUsers(), fetchCustomers()])
      .catch(() => setError('Failed to load dashboard data.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
      <div className="spinner-border text-danger" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (error) return <div className="alert alert-danger">{error}</div>;

  const activeUsers = users.filter(u => u.active !== false).length;
  const activeCustomers = customers.filter(c => c.active !== false).length;

  return (
    <div>
      <div className="dashboard-title">Dashboard Overview</div>
      <div className="stat-cards">
        <div className="stat-card">
          <h6>Total Users</h6>
          <div className="stat-value">{users.length}</div>
        </div>
        <div className="stat-card">
          <h6>Active Users</h6>
          <div className="stat-value">{activeUsers}</div>
        </div>
        <div className="stat-card">
          <h6>Total Customers</h6>
          <div className="stat-value">{customers.length}</div>
        </div>
        <div className="stat-card">
          <h6>Active Customers</h6>
          <div className="stat-value">{activeCustomers}</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
