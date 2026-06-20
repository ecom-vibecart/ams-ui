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

const emptyAddr = { doorNo: '', streetName: '', landMark: '', cityName: '', stateName: '', zipCode: '', mobile: '', email: '' };

const CreateCustomer = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', status: 'ACTIVE',
  });
  const [address, setAddress] = useState(emptyAddr);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    axios.get(API.customer(id))
      .then(({ data }) => {
        const c = Array.isArray(data) ? data[0] : (data.data || data);
        setForm({
          firstName: c.firstName || '',
          lastName: c.lastName || '',
          email: c.email || '',
          password: '',
          status: c.status || 'ACTIVE',
        });
        const addr = c.customerAddressDTOList?.[0] || {};
        setAddress({
          addressId: addr.addressId,
          doorNo: addr.doorNo || '',
          streetName: addr.streetName || '',
          landMark: addr.landMark || '',
          cityName: addr.cityName || '',
          stateName: addr.stateName || '',
          zipCode: addr.zipCode || '',
          mobile: addr.mobile || '',
          email: addr.email || '',
        });
      })
      .catch(() => setError('Failed to load customer.'))
      .finally(() => setFetching(false));
  }, [id, isEdit]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddrChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...form,
        role: 'GUEST',
        customerAddressDTOList: [address],
      };
      if (isEdit && !payload.password) delete payload.password;
      if (isEdit) {
        await axios.put(API.customer(id), payload);
      } else {
        await axios.post(API.createCustomer, payload);
      }
      Swal.fire({ title: isEdit ? 'Customer Updated!' : 'Customer Created!', icon: 'success', timer: 1500, showConfirmButton: false });
      navigate('/customers');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save customer.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
      <div className="spinner-border text-danger" role="status"><span className="visually-hidden">Loading...</span></div>
    </div>
  );

  const sectionHead = { fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--vc-text-muted)', margin: '20px 0 12px' };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">{isEdit ? 'Edit Customer' : 'Create Customer'}</div>
        <button className="btn-primary-vc" onClick={() => navigate('/customers')} style={{ background: '#6c757d' }}>
          &larr; Back
        </button>
      </div>

      <div style={{ background: 'var(--vc-surface)', border: '1px solid var(--vc-border)', borderRadius: 'var(--vc-radius-lg)', boxShadow: 'var(--vc-shadow-sm)', padding: '28px', maxWidth: '560px' }}>
        <form onSubmit={handleSubmit}>

          <p style={sectionHead}>Personal Information</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label style={labelStyle}>First Name</label>
              <input name="firstName" style={inputStyle} value={form.firstName} onChange={handleFormChange} required />
            </div>
            <div>
              <label style={labelStyle}>Last Name</label>
              <input name="lastName" style={inputStyle} value={form.lastName} onChange={handleFormChange} required />
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Email</label>
            <input type="email" name="email" style={inputStyle} value={form.email} onChange={handleFormChange} required />
          </div>

          {!isEdit && (
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Password</label>
              <input type="password" name="password" style={inputStyle} value={form.password} onChange={handleFormChange} required />
            </div>
          )}

          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Status</label>
            <select name="status" value={form.status} onChange={handleFormChange} style={inputStyle}>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          <p style={sectionHead}>Address</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label style={labelStyle}>Door / Unit No.</label>
              <input name="doorNo" style={inputStyle} value={address.doorNo} onChange={handleAddrChange} />
            </div>
            <div>
              <label style={labelStyle}>Street</label>
              <input name="streetName" style={inputStyle} value={address.streetName} onChange={handleAddrChange} />
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Landmark</label>
            <input name="landMark" style={inputStyle} value={address.landMark} onChange={handleAddrChange} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label style={labelStyle}>City</label>
              <input name="cityName" style={inputStyle} value={address.cityName} onChange={handleAddrChange} />
            </div>
            <div>
              <label style={labelStyle}>State</label>
              <input name="stateName" style={inputStyle} value={address.stateName} onChange={handleAddrChange} />
            </div>
            <div>
              <label style={labelStyle}>Zip Code</label>
              <input name="zipCode" style={inputStyle} value={address.zipCode} onChange={handleAddrChange} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>Mobile</label>
              <input type="tel" name="mobile" style={inputStyle} value={address.mobile} onChange={handleAddrChange} />
            </div>
            <div>
              <label style={labelStyle}>Address Email</label>
              <input type="email" name="email" style={inputStyle} value={address.email} onChange={handleAddrChange} />
            </div>
          </div>

          {error && <div className="alert alert-danger" style={{ fontSize: '13px', padding: '8px 12px', marginBottom: '14px' }}>{error}</div>}

          <button type="submit" className="btn-primary-vc" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Saving…' : isEdit ? 'Update Customer' : 'Create Customer'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCustomer;
