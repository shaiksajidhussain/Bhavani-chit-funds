import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import LoginForm from './components/LoginForm';

const App = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route 
              path="/" 
              element={<Home onShowLogin={() => setShowLoginModal(true)} />} 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute requiredRoles={['ADMIN', 'AGENT', 'COLLECTOR']}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/customers" 
              element={
                <ProtectedRoute requiredRoles={['ADMIN', 'AGENT', 'COLLECTOR']}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/schemes" 
              element={
                <ProtectedRoute requiredRoles={['ADMIN', 'AGENT', 'COLLECTOR']}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/collections" 
              element={
                <ProtectedRoute requiredRoles={['ADMIN', 'AGENT', 'COLLECTOR']}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/auctions" 
              element={
                <ProtectedRoute requiredRoles={['ADMIN', 'AGENT', 'COLLECTOR']}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/reports" 
              element={
                <ProtectedRoute requiredRoles={['ADMIN', 'AGENT', 'COLLECTOR']}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/passbook" 
              element={
                <ProtectedRoute requiredRoles={['ADMIN', 'AGENT', 'COLLECTOR']}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
          
          {/* Global Login Modal - Inside Router */}
          <LoginForm 
            isOpen={showLoginModal} 
            onClose={() => setShowLoginModal(false)} 
          />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;