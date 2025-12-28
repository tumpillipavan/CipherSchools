import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AssignmentList from './pages/AssignmentList';
import AssignmentWorkspace from './pages/AssignmentWorkspace';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import { ToastProvider } from './components/ToastContext';
import './styles/main.scss';

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <AssignmentList />
              </ProtectedRoute>
            } />
            <Route path="/assignment/:id" element={
              <ProtectedRoute>
                <AssignmentWorkspace />
              </ProtectedRoute>
            } />

            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
