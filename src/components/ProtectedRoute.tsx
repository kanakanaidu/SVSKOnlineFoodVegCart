import { Navigate } from "react-router-dom";
import { fetchRole } from "../utils/fetchLocalStorage";
import React, { ReactElement } from "react";

interface ProtectedRouteProps {
    element: ReactElement;
    allowedRoles: string[];
  }

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, allowedRoles }) => {
  const userRole = fetchRole();

  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }

  return element;
};

export default ProtectedRoute;
