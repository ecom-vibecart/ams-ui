import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { API } from '../Services/service';
import '../Users/Users.css';

const CreateCustomer = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', active: true });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    axios.get(API.customer(id))
      .then(({ data }) => {
        const c = Array.isArray(data) ? data[0] : (data.data || data);
        setForm({ name: c.name || '', email: c.email || '', phone: c.phone || '', address: c.address || '', active: c.active !== false });
      })
      .catch(() => setError('Failed to load customer.'))
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
        await axios.put(API.customer(id), form);
      } else {
        await axios.post(API.createCustomer, form);
      }
      Swal.fire({ title: isEdit ? 'Customer Updated!' : 'Customer Created!', icon: 'success', timer: 1500, showConfirmButton: false });
      navigate('/customers');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save customer.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '8px 12px', border: '1px solid var(--vc-border)', borderRadius: 'var(--vc-radius)', fontSize: '13px', boxSizing: 'border-box', background: 'var(--vc-surface)' };

  if (fetching) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
      <div className="spinner-border text-danger" role="status"><span className="visually-hidden">Loading...</span></div>
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <div className="page-title">{isEdit ? 'Edit Customer' : 'Create Customer'}</div>
        <button className="btn-primary-vc" onClick={() => navigate('/customers')} style={{ background: '#6c757d' }}>
          &larr; Back
        </button>
      </div>

      <div style={{ background: 'var(--vc-surface)', border: '1px solid var(--vc-border)', borderRadius: 'var(--vc-radius-lg)', boxShadow: 'var(--vc-shadow-sm)', padding: '28px', maxWidth: '500px' }}>
        <form onSubmit={handleSubmit}>
          {[
            { label: 'Name', name: 'name', type: 'text' },
            { label: 'Email', name: 'email', type: 'email' },
            { label: 'Phone', name: 'phone', type: 'tel' },
            { label: 'Address', name: 'address', type: 'text' },
          ].map(f => (
            <div key={f.name} style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500 }}>{f.label}</label>
              <input
                type={f.type}
                name={f.name}
                style={inputStyle}
                value={form[f.name]}
                onChange={handleChange}
                required={f.name === 'name' || f.name === 'email'}
              />
            </div>
          ))}

          <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="checkbox" name="active" id="active" checked={form.active} onChange={handleChange} />
            <label htmlFor="active" style={{ fontSize: '13px', margin: 0 }}>Active</label>
          </div>

          {error && <div className="alert alert-danger" style={{ fontSize: '13px', padding: '8px 12px' }}>{error}</div>}

          <button type="submit" className="btn-primary-vc" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Saving…' : isEdit ? 'Update Customer' : 'Create Customer'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCustomer;
