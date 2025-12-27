import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AssignmentList from './pages/AssignmentList';
import AssignmentWorkspace from './pages/AssignmentWorkspace';
import Layout from './components/Layout';
import { ToastProvider } from './components/ToastContext';
import './styles/main.scss';

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<AssignmentList />} />
            <Route path="/assignment/:id" element={<AssignmentWorkspace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
