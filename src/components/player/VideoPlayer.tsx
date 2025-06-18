import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  Settings,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  title: string;
  description?: string;
  posterUrl?: string;
  onClose: () => void;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  title,
  description,
  posterUrl,
  onClose,
  className,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [currentTime, setCurrentTime] = useState([0]);
  const [duration] = useState(7230); // Demo duration in seconds (2h 3m 30s)
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);

  const playerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isBuffering) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const newTime = prev[0] + 1;
          return newTime >= duration ? [duration] : [newTime];
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isBuffering, duration]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    if (currentTime[0] >= duration) {
      setCurrentTime([0]);
    }
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      // Simulate buffering
      setIsBuffering(true);
      setTimeout(() => setIsBuffering(false), 1500);
    }
  };

  const handleTimeChange = (value: number[]) => {
    setCurrentTime(value);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
    setIsMuted(value[0] === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const skipBackward = () => {
    setCurrentTime((prev) => [Math.max(0, prev[0] - 10)]);
  };

  const skipForward = () => {
    setCurrentTime((prev) => [Math.min(duration, prev[0] + 10)]);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={playerRef}
      className={cn(
        "relative bg-black overflow-hidden",
        isFullscreen ? "fixed inset-0 z-50" : "rounded-lg aspect-video w-full",
        className,
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video placeholder */}
      <div className="relative w-full h-full bg-streaming-darker flex items-center justify-center">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center">
            <Play className="w-16 h-16 text-white/50 mx-auto mb-4" />
            <p className="text-white/50">Video Preview</p>
          </div>
        )}

        {/* Loading/Buffering overlay */}
        {isBuffering && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        )}

        {/* Play button overlay */}
        {!isPlaying && !isBuffering && (
          <Button
            onClick={handlePlayPause}
            className="absolute inset-0 bg-transparent hover:bg-black/20 w-full h-full flex items-center justify-center group"
          >
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-all">
              <Play className="w-10 h-10 text-white fill-white ml-1" />
            </div>
          </Button>
        )}
      </div>

      {/* Controls overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50 transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0",
        )}
      >
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold text-lg">{title}</h3>
            {description && (
              <p className="text-white/70 text-sm">{description}</p>
            )}
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-2 h-8 w-8"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Center controls */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-4">
            <Button
              onClick={skipBackward}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-3 h-12 w-12"
            >
              <SkipBack className="w-6 h-6" />
            </Button>

            <Button
              onClick={handlePlayPause}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-4 h-16 w-16"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8 fill-white ml-1" />
              )}
            </Button>

            <Button
              onClick={skipForward}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-3 h-12 w-12"
            >
              <SkipForward className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
          {/* Progress bar */}
          <Slider
            value={currentTime}
            max={duration}
            step={1}
            onValueChange={handleTimeChange}
            className="w-full"
          />

          {/* Control buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={handlePlayPause}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 p-2 h-8 w-8"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4 fill-white" />
                )}
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  onClick={toggleMute}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 p-2 h-8 w-8"
                >
                  {isMuted || volume[0] === 0 ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </Button>
                <Slider
                  value={isMuted ? [0] : volume}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                  className="w-20"
                />
              </div>

              <div className="text-white text-sm">
                {formatTime(currentTime[0])} / {formatTime(duration)}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 p-2 h-8 w-8"
              >
                <Settings className="w-4 h-4" />
              </Button>

              <Button
                onClick={toggleFullscreen}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 p-2 h-8 w-8"
              >
                {isFullscreen ? (
                  <Minimize className="w-4 h-4" />
                ) : (
                  <Maximize className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
