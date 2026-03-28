import { Navigate } from "react-router-dom";
import { hasPermission } from "../utils/permission";

const ProtectedRoute = ({ children, module, action }) => {

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/" />;
  }

  if (module && action && !hasPermission(module, action)) {
    return <Navigate to="/superadmin" />;
  }

  return children;
};

export default ProtectedRoute;