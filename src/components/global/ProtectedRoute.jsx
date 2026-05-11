import { Navigate } from 'react-router-dom';
import { getTokenFromCookie } from '../../services/auth';

export default function ProtectedRoute({ element }) {
  const token = getTokenFromCookie();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return element;
}
