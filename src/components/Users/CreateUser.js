import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { API } from '../Services/service';
import '../Users/Users.css';

const CreateUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'ADMIN', active: true });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    axios.get(API.user(id))
      .then(({ data }) => {
        const u = Array.isArray(data) ? data[0] : (data.data || data);
        setForm({ name: u.name || '', email: u.email || '', password: '', role: u.role || 'ADMIN', active: u.active !== false });
      })
      .catch(() => setError('Failed to load user.'))
      .finally(() => setFetching(false));
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isEdit) {
        await axios.put(API.user(id), form);
      } else {
        await axios.post(API.createUser, form);
      }
      Swal.fire({ title: isEdit ? 'User Updated!' : 'User Created!', icon: 'success', timer: 1500, showConfirmButton: false });
      navigate('/users');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save user.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
      <div className="spinner-border text-danger" role="status"><span className="visually-hidden">Loading...</span></div>
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <div className="page-title">{isEdit ? 'Edit User' : 'Create User'}</div>
        <button className="btn-primary-vc" onClick={() => navigate('/users')} style={{ background: '#6c757d' }}>
          &larr; Back
        </button>
      </div>

      <div style={{ background: 'var(--vc-surface)', border: '1px solid var(--vc-border)', borderRadius: 'var(--vc-radius-lg)', boxShadow: 'var(--vc-shadow-sm)', padding: '28px', maxWidth: '500px' }}>
        <form onSubmit={handleSubmit}>
          {[
            { label: 'Name', name: 'name', type: 'text' },
            { label: 'Email', name: 'email', type: 'email' },
            ...(!isEdit ? [{ label: 'Password', name: 'password', type: 'password' }] : []),
          ].map(f => (
            <div key={f.name} style={{ marginBottom: '14px' }}>
              <label className="login-label" style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500 }}>{f.label}</label>
              <input
                type={f.type}
                name={f.name}
                className="login-input"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--vc-border)', borderRadius: 'var(--vc-radius)', fontSize: '13px', boxSizing: 'border-box' }}
                value={form[f.name]}
                onChange={handleChange}
                required={f.name !== 'password' || !isEdit}
              />
            </div>
          ))}

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500 }}>Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--vc-border)', borderRadius: 'var(--vc-radius)', fontSize: '13px', background: 'var(--vc-surface)' }}
            >
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="VIEWER">Viewer</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="checkbox" name="active" id="active" checked={form.active} onChange={handleChange} />
            <label htmlFor="active" style={{ fontSize: '13px', margin: 0 }}>Active</label>
          </div>

          {error && <div className="alert alert-danger" style={{ fontSize: '13px', padding: '8px 12px' }}>{error}</div>}

          <button type="submit" className="btn-primary-vc" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Saving…' : isEdit ? 'Update User' : 'Create User'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
