import { ReactNode } from "react";
import useAuth from "./useAuth";
import { useLocation } from "react-router-dom";
import { Navigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

interface RequireAuthProps {
  children: ReactNode;
}

function RequireAuth({ children }: RequireAuthProps) {
  const { authed, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <CircularProgress size={72} />;
  }

  return (
    <>
      {authed ? (
        children
      ) : (
        <Navigate to="/" replace state={{ path: location.pathname }} />
      )}
    </>
  );
}

export default RequireAuth;
