import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { API } from '../Services/service';
import '../Users/Users.css';

const Customers = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCustomers = async () => {
    try {
      const { data } = await axios.get(API.customers);
      const arr = Array.isArray(data) ? data : (data.data || []);
      setCustomers(arr);
      setFiltered(arr);
    } catch {
      setError('Failed to load customers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(customers.filter(c =>
      (c.name || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.phone || '').toLowerCase().includes(q)
    ));
  }, [search, customers]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Customer?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dd1e25',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Delete',
    });
    if (!result.isConfirmed) return;
    try {
      await axios.delete(API.customer(id));
      setCustomers(prev => prev.filter(c => c.id !== id));
      Swal.fire({ title: 'Deleted!', icon: 'success', timer: 1500, showConfirmButton: false });
    } catch {
      Swal.fire('Error', 'Failed to delete customer.', 'error');
    }
  };

  const handleToggle = async (customer) => {
    try {
      await axios.put(API.customer(customer.id), { ...customer, active: !customer.active });
      setCustomers(prev => prev.map(c => c.id === customer.id ? { ...c, active: !c.active } : c));
    } catch {
      Swal.fire('Error', 'Failed to update customer status.', 'error');
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
        <div className="page-title">Customers</div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            className="search-bar"
            placeholder="Search by name, email or phone…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="btn-primary-vc" onClick={() => navigate('/customers/create')}>
            + Add Customer
          </button>
        </div>
      </div>

      <div className="table-card">
        {filtered.length === 0 ? (
          <div className="no-data">No customers found.</div>
        ) : (
          <table className="vc-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id}>
                  <td>{i + 1}</td>
                  <td>{c.name || '—'}</td>
                  <td>{c.email || '—'}</td>
                  <td>{c.phone || '—'}</td>
                  <td>
                    <span className={c.active !== false ? 'badge-active' : 'badge-inactive'}>
                      {c.active !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button className="btn-sm-vc btn-sm-toggle" onClick={() => navigate(`/customers/edit/${c.id}`)}>
                      Edit
                    </button>
                    <button className="btn-sm-vc btn-sm-toggle" onClick={() => handleToggle(c)}>
                      {c.active !== false ? 'Deactivate' : 'Activate'}
                    </button>
                    <button className="btn-sm-vc btn-sm-danger" onClick={() => handleDelete(c.id)}>
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

export default Customers;
