import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  Play,
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const { user, signOut } = useAuth();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/auth/signin");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  const navItems = [
    { label: "Home", href: "/dashboard" },
    { label: "Movies", href: "/movies" },
    { label: "TV Shows", href: "/tv-shows" },
    { label: "My List", href: "/my-list" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-streaming-dark/95 backdrop-blur-md border-b border-streaming-card transition-all duration-300",
        className,
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-netflix-600 rounded-lg flex items-center justify-center">
                <Play className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-xl font-bold text-white hidden sm:block">
                StreamFlix
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="text-streaming-gray-light hover:text-white transition-colors duration-200 text-sm font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative hidden sm:block">
              <Input
                type="text"
                placeholder="Search movies, TV shows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-streaming-darker border-streaming-card text-white placeholder:text-streaming-gray focus:border-netflix-600 w-64 pr-10"
              />
              <Button
                type="submit"
                size="sm"
                variant="ghost"
                className="absolute right-0 top-0 h-full px-3 text-streaming-gray hover:text-white"
              >
                <Search className="w-4 h-4" />
              </Button>
            </form>

            {/* Search button for mobile */}
            <Link to="/search" className="sm:hidden">
              <Button
                variant="ghost"
                size="sm"
                className="text-streaming-gray-light hover:text-white p-2 h-8 w-8"
              >
                <Search className="w-5 h-5" />
              </Button>
            </Link>

            {/* Wishlist */}
            <Link to="/my-list">
              <Button
                variant="ghost"
                size="sm"
                className="text-streaming-gray-light hover:text-white p-2 h-8 w-8 relative"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-netflix-600"
                  >
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              className="text-streaming-gray-light hover:text-white p-2 h-8 w-8"
            >
              <Bell className="w-5 h-5" />
            </Button>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-netflix-600 text-white text-sm">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 bg-streaming-card border-streaming-card"
                align="end"
                forceMount
              >
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-white">{user?.name}</p>
                    <p className="text-xs text-streaming-gray">{user?.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-streaming-gray/20" />
                <DropdownMenuItem className="text-streaming-gray-light hover:text-white hover:bg-streaming-darker">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-streaming-gray-light hover:text-white hover:bg-streaming-darker">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-streaming-gray/20" />
                <DropdownMenuItem
                  className="text-streaming-gray-light hover:text-white hover:bg-streaming-darker"
                  onSelect={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-streaming-gray-light hover:text-white p-2 h-8 w-8"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-streaming-card py-4">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="text-streaming-gray-light hover:text-white transition-colors duration-200 text-sm font-medium px-2 py-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {/* Mobile search */}
              <form onSubmit={handleSearch} className="relative px-2">
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-streaming-darker border-streaming-card text-white placeholder:text-streaming-gray focus:border-netflix-600 pr-10"
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="ghost"
                  className="absolute right-2 top-0 h-full px-3 text-streaming-gray hover:text-white"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </form>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
