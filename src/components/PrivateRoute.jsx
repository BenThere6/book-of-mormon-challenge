import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Element, ...rest }) => {
  const localToken = localStorage.getItem('token');
  const localTokenExpiration = localStorage.getItem('tokenExpiration');
  const sessionToken = sessionStorage.getItem('token');
  const sessionTokenExpiration = sessionStorage.getItem('tokenExpiration');

  const isAuthenticated = (localToken && localTokenExpiration && Date.now() < parseInt(localTokenExpiration, 10)) ||
                          (sessionToken && sessionTokenExpiration && Date.now() < parseInt(sessionTokenExpiration, 10));

  return isAuthenticated ? <Element {...rest} /> : <Navigate to="/login" />;
};

export default PrivateRoute;