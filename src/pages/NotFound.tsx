import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Play } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const NotFound: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-streaming-dark flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-streaming-dark via-streaming-darker to-black" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-md mx-auto">
        {/* Logo */}
        <div className="inline-flex items-center gap-2 mb-8">
          <div className="w-12 h-12 bg-netflix-600 rounded-lg flex items-center justify-center">
            <Play className="w-7 h-7 text-white fill-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">StreamFlix</h1>
        </div>

        {/* Error message */}
        <div className="mb-8">
          <h2 className="text-6xl font-bold text-netflix-600 mb-4">404</h2>
          <h3 className="text-2xl font-semibold text-white mb-2">
            Page Not Found
          </h3>
          <p className="text-streaming-gray-light">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action buttons */}
        <div className="space-y-4">
          <Link to={isAuthenticated ? "/dashboard" : "/"}>
            <Button
              size="lg"
              className="bg-netflix-600 hover:bg-netflix-700 text-white font-semibold w-full"
            >
              <Home className="w-5 h-5 mr-2" />
              {isAuthenticated ? "Go to Dashboard" : "Go Home"}
            </Button>
          </Link>

          <Button
            size="lg"
            variant="outline"
            className="border-white/30 bg-white/10 text-white hover:bg-white/20 font-semibold w-full"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Help text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-streaming-gray">
            If you believe this is an error, please{" "}
            <a
              href="#"
              className="text-netflix-500 hover:text-netflix-400 underline"
            >
              contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
