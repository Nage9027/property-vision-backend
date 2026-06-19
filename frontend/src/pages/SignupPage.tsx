import { Navigate } from 'react-router-dom';

/** Registration is handled on the login page (toggle or deep-link). */
export function SignupPage() {
  return <Navigate to="/login" replace state={{ signup: true }} />;
}
