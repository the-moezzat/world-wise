import React, { useEffect } from 'react';
import { useFakeAuth } from '../contexts/FakeAuthContext';
import { useNavigate } from 'react-router-dom';

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticate } = useFakeAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticate) navigate('/login');
  }, [isAuthenticate, navigate]);

  return isAuthenticate ? <>{children}</> : null;
}
