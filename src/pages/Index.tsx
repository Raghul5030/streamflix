import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Play, Loader2 } from "lucide-react";

const Index: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-streaming-dark flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-netflix-600 animate-spin mx-auto mb-4" />
          <p className="text-streaming-gray">Loading StreamFlix...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-streaming-dark">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-streaming-dark via-streaming-darker to-black" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-2xl mx-auto">
          {/* Logo */}
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="w-16 h-16 bg-netflix-600 rounded-xl flex items-center justify-center">
              <Play className="w-10 h-10 text-white fill-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              StreamFlix
            </h1>
          </div>

          {/* Hero text */}
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Unlimited movies, TV shows, and more
          </h2>
          <p className="text-xl text-streaming-gray-light mb-8">
            Watch anywhere. Cancel anytime.
          </p>

          {/* CTA */}
          <div className="space-y-4">
            <p className="text-streaming-gray-light">
              Ready to watch? Enter your email to create or restart your
              membership.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Button
                size="lg"
                className="bg-netflix-600 hover:bg-netflix-700 text-white font-semibold flex-1"
                onClick={() => navigate("/auth/signup")}
              >
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 bg-white/10 text-white hover:bg-white/20 font-semibold"
                onClick={() => navigate("/auth/signin")}
              >
                Sign In
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-left">
            <div className="text-center">
              <div className="w-12 h-12 bg-netflix-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Play className="w-6 h-6 text-netflix-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Watch everywhere
              </h3>
              <p className="text-streaming-gray text-sm">
                Stream unlimited movies and TV shows on your phone, tablet,
                laptop, and TV.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-netflix-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-netflix-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                No commitments
              </h3>
              <p className="text-streaming-gray text-sm">
                Cancel online anytime. No cancellation fees or long-term
                contracts.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-netflix-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-netflix-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Kids profiles
              </h3>
              <p className="text-streaming-gray text-sm">
                Create profiles for kids with content rated for their age level.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
