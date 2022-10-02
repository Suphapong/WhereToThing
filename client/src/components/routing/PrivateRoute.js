import React  from 'react';
import { Navigate, Route, Outlet } from "react-router-dom";

export const PrivateRoute = ({ children }) => {
  return localStorage.getItem("authToken") ? children : <Navigate to="/login" />;
};

export const AdminPrivateRoute = ({ children }) => {
  return localStorage.getItem("authToken") ? children : <Navigate to="/login" />;
};
// export const AdminPrivateRoute = ({ children, role }) => {
//   return localStorage.getItem("authToken") && role === "admin" ? children : <Navigate to="/login" />;
// };
//export default PrivateRoute;