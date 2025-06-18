import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = "/auth/signin",
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-streaming-dark flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-netflix-600 animate-spin mx-auto mb-4" />
          <p className="text-streaming-gray">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to sign-in page with return url
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
