import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Movies: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-streaming-dark">
      <Header />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              size="sm"
              className="border-white/30 bg-white/20 text-white hover:bg-white/30"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-white">Movies</h1>
          </div>

          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <h2 className="text-xl font-semibold text-white mb-4">
                Movies Page Coming Soon
              </h2>
              <p className="text-streaming-gray mb-8">
                This page will feature a comprehensive movie browsing experience
                with filtering, sorting, and detailed movie information.
              </p>
              <Button
                onClick={() => navigate("/dashboard")}
                className="bg-netflix-600 hover:bg-netflix-700 text-white"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Movies;
