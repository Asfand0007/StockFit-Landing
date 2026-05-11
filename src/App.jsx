import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Questionnaire from './pages/Questionnaire';
import QuestionnaireResults from './pages/QuestionnaireResults';
import Recommendations from './pages/Recommendations';
import Portfolio from './pages/Portfolio';
import ProtectedRoute from './components/global/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
      <Route path="/questionnaire" element={<ProtectedRoute element={<Questionnaire />} />} />
      <Route path="/questionnaire/results" element={<ProtectedRoute element={<QuestionnaireResults />} />} />
      <Route path="/recommendations" element={<ProtectedRoute element={<Recommendations />} />} />
      <Route path="/portfolio" element={<ProtectedRoute element={<Portfolio />} />} />
    </Routes>
  );
}

export default App;
