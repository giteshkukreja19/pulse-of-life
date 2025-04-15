
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Menu, X, Heart, LogOut, User } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// Mock authentication - in a real app, use a proper auth system
const isLoggedIn = false; // Default to logged out state

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center bg-blood rounded-full w-10 h-10">
            <Heart className="text-white h-5 w-5" />
          </div>
          <div className="font-bold text-xl">
            <span className="text-blood">Plus</span>
            <span className="text-navy"> of Life</span>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className="flex items-center gap-8">
            <Link to="/" className={isActive("/") ? "nav-link-active" : "nav-link"}>
              Home
            </Link>
            <Link to="/request" className={isActive("/request") ? "nav-link-active" : "nav-link"}>
              Request Blood
            </Link>
            <Link to="/donors" className={isActive("/donors") ? "nav-link-active" : "nav-link"}>
              Find Donors
            </Link>
            <Link to="/about" className={isActive("/about") ? "nav-link-active" : "nav-link"}>
              About Us
            </Link>
          </nav>
        )}
        
        {/* Auth Buttons or User Menu */}
        {!isMobile && (
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>My Account</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer w-full">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer w-full">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer text-destructive flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/register">
                  <Button className="btn-blood">Register</Button>
                </Link>
              </>
            )}
          </div>
        )}
        
        {/* Mobile Menu Toggle */}
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        )}
      </div>
      
      {/* Mobile Menu */}
      {isMobile && isOpen && (
        <div className="fixed inset-0 top-16 bg-white z-40 p-4">
          <nav className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className={`text-lg py-2 ${isActive("/") ? "nav-link-active" : "nav-link"}`}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/request" 
              className={`text-lg py-2 ${isActive("/request") ? "nav-link-active" : "nav-link"}`}
              onClick={() => setIsOpen(false)}
            >
              Request Blood
            </Link>
            <Link 
              to="/donors" 
              className={`text-lg py-2 ${isActive("/donors") ? "nav-link-active" : "nav-link"}`}
              onClick={() => setIsOpen(false)}
            >
              Find Donors
            </Link>
            <Link 
              to="/about" 
              className={`text-lg py-2 ${isActive("/about") ? "nav-link-active" : "nav-link"}`}
              onClick={() => setIsOpen(false)}
            >
              About Us
            </Link>
            
            <div className="border-t my-2 pt-4">
              {isLoggedIn ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="block py-2 text-lg nav-link" 
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/profile" 
                    className="block py-2 text-lg nav-link" 
                    onClick={() => setIsOpen(false)}
                  >
                    My Profile
                  </Link>
                  <button 
                    className="w-full mt-4 py-2 text-lg flex items-center gap-2 text-destructive"
                    onClick={() => setIsOpen(false)}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3 pt-2">
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full">Login</Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)}>
                    <Button className="w-full btn-blood">Register</Button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
