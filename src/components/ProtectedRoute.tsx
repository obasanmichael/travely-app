// import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// interface ProtectedRouteProps {
//   children: React.ReactNode;
// }

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
//   const { currentUser } = useAuth();
//   const location = useLocation();

//   if (!currentUser) {
//     // Redirect to login page if user is not authenticated
//     // Save the attempted location for redirecting after login
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   return <>{children}</>;
// };

// export default ProtectedRoute;