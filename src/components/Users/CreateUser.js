import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { API } from '../Services/service';
import '../Users/Users.css';

const inputStyle = {
  width: '100%', padding: '8px 12px',
  border: '1px solid var(--vc-border)', borderRadius: 'var(--vc-radius)',
  fontSize: '13px', boxSizing: 'border-box', background: 'var(--vc-surface)',
  outline: 'none',
};

const labelStyle = { display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500 };

const CreateUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '',
    mobile: '', role: 'ADMIN', status: 'ACTIVE',
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    axios.get(API.user(id))
      .then(({ data }) => {
        const u = Array.isArray(data) ? data[0] : (data.data || data);
        setForm({
          firstName: u.firstName || '',
          lastName: u.lastName || '',
          email: u.email || '',
          password: '',
          mobile: u.mobile || '',
          role: u.role || 'ADMIN',
          status: u.status || 'ACTIVE',
        });
      })
      .catch(() => setError('Failed to load user.'))
      .finally(() => setFetching(false));
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = { ...form };
      if (isEdit && !payload.password) delete payload.password;
      if (isEdit) {
        await axios.put(API.user(id), payload);
      } else {
        await axios.post(API.createUser, payload);
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

      <div style={{ background: 'var(--vc-surface)', border: '1px solid var(--vc-border)', borderRadius: 'var(--vc-radius-lg)', boxShadow: 'var(--vc-shadow-sm)', padding: '28px', maxWidth: '520px' }}>
        <form onSubmit={handleSubmit}>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label style={labelStyle}>First Name</label>
              <input name="firstName" style={inputStyle} value={form.firstName} onChange={handleChange} required />
            </div>
            <div>
              <label style={labelStyle}>Last Name</label>
              <input name="lastName" style={inputStyle} value={form.lastName} onChange={handleChange} required />
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Email</label>
            <input type="email" name="email" style={inputStyle} value={form.email} onChange={handleChange} required />
          </div>

          {!isEdit && (
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Password</label>
              <input type="password" name="password" style={inputStyle} value={form.password} onChange={handleChange} required />
            </div>
          )}

          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Mobile</label>
            <input type="tel" name="mobile" style={inputStyle} value={form.mobile} onChange={handleChange} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>Role</label>
              <select name="role" value={form.role} onChange={handleChange}
                style={{ ...inputStyle }}>
                <option value="ADMIN">Admin</option>
                <option value="MANAGER">Manager</option>
                <option value="VIEWER">Viewer</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select name="status" value={form.status} onChange={handleChange}
                style={{ ...inputStyle }}>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>

          {error && <div className="alert alert-danger" style={{ fontSize: '13px', padding: '8px 12px', marginBottom: '14px' }}>{error}</div>}

          <button type="submit" className="btn-primary-vc" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Saving…' : isEdit ? 'Update User' : 'Create User'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
