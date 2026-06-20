import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { API } from '../Services/service';
import './Users.css';

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(API.users);
      const arr = Array.isArray(data) ? data : (data.data || []);
      setUsers(arr);
      setFiltered(arr);
    } catch {
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(users.filter(u =>
      (u.name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q)
    ));
  }, [search, users]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete User?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dd1e25',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Delete',
    });
    if (!result.isConfirmed) return;
    try {
      await axios.delete(API.user(id));
      setUsers(prev => prev.filter(u => u.id !== id));
      Swal.fire({ title: 'Deleted!', icon: 'success', timer: 1500, showConfirmButton: false });
    } catch {
      Swal.fire('Error', 'Failed to delete user.', 'error');
    }
  };

  const handleToggle = async (user) => {
    try {
      await axios.put(API.user(user.id), { ...user, active: !user.active });
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, active: !u.active } : u));
    } catch {
      Swal.fire('Error', 'Failed to update user status.', 'error');
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
      <div className="spinner-border text-danger" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Users</div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            className="search-bar"
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="btn-primary-vc" onClick={() => navigate('/users/create')}>
            + Add User
          </button>
        </div>
      </div>

      <div className="table-card">
        {filtered.length === 0 ? (
          <div className="no-data">No users found.</div>
        ) : (
          <table className="vc-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u.id}>
                  <td>{i + 1}</td>
                  <td>{u.name || '—'}</td>
                  <td>{u.email || '—'}</td>
                  <td>{u.role || '—'}</td>
                  <td>
                    <span className={u.active !== false ? 'badge-active' : 'badge-inactive'}>
                      {u.active !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button className="btn-sm-vc btn-sm-toggle" onClick={() => navigate(`/users/edit/${u.id}`)}>
                      Edit
                    </button>
                    <button className="btn-sm-vc btn-sm-toggle" onClick={() => handleToggle(u)}>
                      {u.active !== false ? 'Deactivate' : 'Activate'}
                    </button>
                    <button className="btn-sm-vc btn-sm-danger" onClick={() => handleDelete(u.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Users;
