import { ReactNode } from "react";
import useAuth from "./useAuth";
import { useLocation } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface RequireAuthProps {
  children: ReactNode;
}

function RequireAuth({ children }: RequireAuthProps) {
  const { authed, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
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
