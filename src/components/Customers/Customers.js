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
    setFiltered(customers.filter(c => {
      const name = `${c.firstName || ''} ${c.lastName || ''}`.toLowerCase();
      const addr = c.customerAddressDTOList?.[0];
      const phone = addr?.mobile || '';
      return name.includes(q) || (c.email || '').toLowerCase().includes(q) || phone.includes(q);
    }));
  }, [search, customers]);

  const handleDelete = async (customerId) => {
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
      await axios.delete(API.customer(customerId));
      setCustomers(prev => prev.filter(c => c.customerId !== customerId));
      Swal.fire({ title: 'Deleted!', icon: 'success', timer: 1500, showConfirmButton: false });
    } catch {
      Swal.fire('Error', 'Failed to delete customer.', 'error');
    }
  };

  const handleToggle = async (customer) => {
    const newStatus = customer.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await axios.patch(API.patchCustomerStatus(customer.customerId, newStatus));
      setCustomers(prev => prev.map(c => c.customerId === customer.customerId ? { ...c, status: newStatus } : c));
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
                <th>Mobile</th>
                <th>City</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => {
                const addr = c.customerAddressDTOList?.[0];
                return (
                  <tr key={c.customerId}>
                    <td>{i + 1}</td>
                    <td>{[c.firstName, c.lastName].filter(Boolean).join(' ') || '—'}</td>
                    <td>{c.email || '—'}</td>
                    <td>{addr?.mobile || '—'}</td>
                    <td>{addr?.cityName || '—'}</td>
                    <td>
                      <span className={c.status === 'ACTIVE' ? 'badge-active' : 'badge-inactive'}>
                        {c.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button className="btn-sm-vc btn-sm-toggle" onClick={() => navigate(`/customers/edit/${c.customerId}`)}>
                        Edit
                      </button>
                      <button className="btn-sm-vc btn-sm-toggle" onClick={() => handleToggle(c)}>
                        {c.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button className="btn-sm-vc btn-sm-danger" onClick={() => handleDelete(c.customerId)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Customers;
