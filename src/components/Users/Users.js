import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { API } from '../Services/service';
import { isAdmin } from '../Redux/authSlice';
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
    setFiltered(users.filter(u => {
      const name = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
      return name.includes(q) || (u.email || '').toLowerCase().includes(q);
    }));
  }, [search, users]);

  const handleDelete = async (userId) => {
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
      await axios.delete(API.user(userId));
      setUsers(prev => prev.filter(u => u.userId !== userId));
      Swal.fire({ title: 'Deleted!', icon: 'success', timer: 1500, showConfirmButton: false });
    } catch {
      Swal.fire('Error', 'Failed to delete user.', 'error');
    }
  };

  const handleToggle = async (user) => {
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await axios.patch(API.patchUserStatus(user.userId, newStatus));
      setUsers(prev => prev.map(u => u.userId === user.userId ? { ...u, status: newStatus } : u));
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
          {isAdmin() && (
            <button className="btn-primary-vc" onClick={() => navigate('/users/create')}>
              + Add User
            </button>
          )}
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
                <th>Mobile</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u.userId}>
                  <td>{i + 1}</td>
                  <td>{[u.firstName, u.lastName].filter(Boolean).join(' ') || '—'}</td>
                  <td>{u.email || '—'}</td>
                  <td>{u.mobile || '—'}</td>
                  <td>{u.role || '—'}</td>
                  <td>
                    <span className={u.status === 'ACTIVE' ? 'badge-active' : 'badge-inactive'}>
                      {u.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    {isAdmin() && (
                      <>
                        <button className="btn-sm-vc btn-sm-toggle" onClick={() => navigate(`/users/edit/${u.userId}`)}>
                          Edit
                        </button>
                        <button className="btn-sm-vc btn-sm-toggle" onClick={() => handleToggle(u)}>
                          {u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button className="btn-sm-vc btn-sm-danger" onClick={() => handleDelete(u.userId)}>
                          Delete
                        </button>
                      </>
                    )}
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
