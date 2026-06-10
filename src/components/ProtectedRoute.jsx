import { Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  // Auth guard bypassed for local development
  return <Outlet />;
}
