import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppStateProvider, useAppState } from './contexts/AppStateContext';
import Login from './components/Login';
import EmployeeDashboard from './components/dashboards/EmployeeDashboard';
import ITPersonDashboard from './components/dashboards/ITPersonDashboard';
import ManagerL1Dashboard from './components/dashboards/ManagerL1Dashboard';
import ManagerL2Dashboard from './components/dashboards/ManagerL2Dashboard';
import COODashboard from './components/dashboards/COODashboard';
import CEODashboard from './components/dashboards/CEODashboard';
import ProtectedRoute from './components/ProtectedRoute';

function AppContent() {
  const { state } = useAppState();
  const { currentUser: user, isAuthenticated } = state;

  // Remove loading state since we're using localStorage

  const getRedirectPath = (role) => {
    switch (role) {
      case 'employee': return '/employee/dashboard';
      case 'it_person': return '/it-manager/dashboard';
      case 'manager_l1': return '/manager-l1/dashboard';
      case 'manager_l2': return '/manager-l2/dashboard';
      case 'coo': return '/coo/dashboard';
      case 'ceo': return '/ceo/dashboard';
      default: return '/login';
    }
  };

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login /> : <Navigate to={getRedirectPath(user.role)} replace />} 
        />
        
        {/* Employee Routes */}
        <Route 
          path="/employee/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['employee']}>
              <EmployeeDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/employee/tickets" 
          element={
            <ProtectedRoute allowedRoles={['employee']}>
              <EmployeeDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/employee/create-ticket" 
          element={
            <ProtectedRoute allowedRoles={['employee']}>
              <EmployeeDashboard />
            </ProtectedRoute>
          } 
        />

        {/* IT Person Routes */}
        <Route 
          path="/it-manager/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['it_person']}>
              <ITPersonDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/it-manager/create-ticket" 
          element={
            <ProtectedRoute allowedRoles={['it_person']}>
              <ITPersonDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/it-manager/tickets" 
          element={
            <ProtectedRoute allowedRoles={['it_person']}>
              <ITPersonDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/it-manager/agents" 
          element={
            <ProtectedRoute allowedRoles={['it_person']}>
              <ITPersonDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/it-manager/settings" 
          element={
            <ProtectedRoute allowedRoles={['it_person']}>
              <ITPersonDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/it-manager/myprofile" 
          element={
            <ProtectedRoute allowedRoles={['it_person']}>
              <ITPersonDashboard />
            </ProtectedRoute>
          } 
        />

        {/* L1 Manager Routes */}
        <Route 
          path="/manager-l1/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['manager_l1']}>
              <ManagerL1Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/manager-l1/tickets" 
          element={
            <ProtectedRoute allowedRoles={['manager_l1']}>
              <ManagerL1Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/manager-l1/approvals" 
          element={
            <ProtectedRoute allowedRoles={['manager_l1']}>
              <ManagerL1Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/manager-l1/reports" 
          element={
            <ProtectedRoute allowedRoles={['manager_l1']}>
              <ManagerL1Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/manager-l1/profile" 
          element={
            <ProtectedRoute allowedRoles={['manager_l1']}>
              <ManagerL1Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* L2 Manager Routes */}
        <Route 
          path="/manager-l2/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['manager_l2']}>
              <ManagerL2Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/manager-l2/tickets" 
          element={
            <ProtectedRoute allowedRoles={['manager_l2']}>
              <ManagerL2Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/manager-l2/approvals" 
          element={
            <ProtectedRoute allowedRoles={['manager_l2']}>
              <ManagerL2Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/manager-l2/reports" 
          element={
            <ProtectedRoute allowedRoles={['manager_l2']}>
              <ManagerL2Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/manager-l2/profile" 
          element={
            <ProtectedRoute allowedRoles={['manager_l2']}>
              <ManagerL2Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* COO Routes */}
        <Route 
          path="/coo/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['coo']}>
              <COODashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/coo/reports-and-metrics" 
          element={
            <ProtectedRoute allowedRoles={['coo']}>
              <COODashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/coo/sla-compliance" 
          element={
            <ProtectedRoute allowedRoles={['coo']}>
              <COODashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/coo/approval-query" 
          element={
            <ProtectedRoute allowedRoles={['coo']}>
              <COODashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/coo/export-data" 
          element={
            <ProtectedRoute allowedRoles={['coo']}>
              <COODashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/coo/my-profile" 
          element={
            <ProtectedRoute allowedRoles={['coo']}>
              <COODashboard />
            </ProtectedRoute>
          } 
        />

        {/* CEO Routes */}
        <Route 
          path="/ceo/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['ceo']}>
              <CEODashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/" 
          element={<Navigate to={isAuthenticated ? getRedirectPath(user.role) : "/login"} replace />} 
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AppStateProvider>
      <AppContent />
    </AppStateProvider>
  );
}

export default App;
