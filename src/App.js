import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, isAdmin } from './components/Redux/authSlice';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Footer from './components/Footer/Footer';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Users from './components/Users/Users';
import CreateUser from './components/Users/CreateUser';
import Customers from './components/Customers/Customers';
import CreateCustomer from './components/Customers/CreateCustomer';

const ProtectedLayout = ({ children }) => (
  <>
    <Sidebar />
    <div className="main-content">
      {children}
    </div>
    <Footer />
  </>
);

function App() {
  const { isLoggedIn } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => dispatch(logout());

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Header onLogout={handleLogout} isLoggedIn={isLoggedIn} />
      <div className="app-shell">
        {!isLoggedIn ? (
          <Routes>
            <Route path="*" element={<Login />} />
          </Routes>
        ) : (
          <ProtectedLayout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
              <Route path="/users/create" element={isAdmin() ? <CreateUser /> : <Navigate to="/users" replace />} />
              <Route path="/users/edit/:id" element={isAdmin() ? <CreateUser /> : <Navigate to="/users" replace />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/customers/create" element={isAdmin() ? <CreateCustomer /> : <Navigate to="/customers" replace />} />
              <Route path="/customers/edit/:id" element={isAdmin() ? <CreateCustomer /> : <Navigate to="/customers" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </ProtectedLayout>
        )}
      </div>
    </Router>
  );
}

export default App;
