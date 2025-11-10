import React from 'react';
import { ChevronLeft, ChevronRight, User, LogOut, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const Header = ({ onLoginClick, onLogout, isAuthenticated, userProfile }) => {
  return (
    <div className="h-16 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-sm flex items-center justify-between px-8 absolute top-0 left-64 right-0 z-10">
      {/* Navigation Arrows */}
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-black/40 hover:bg-black/60 text-white"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-black/40 hover:bg-black/60 text-white"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Login/Logout Button */}
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <Button
            variant="outline"
            className="rounded-full border-gray-600 text-white hover:border-red-500 hover:text-red-400 hover:scale-105 transition-all"
            onClick={onLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        ) : (
          <Button
            variant="outline"
            className="rounded-full border-gray-600 text-white hover:border-cyan-400 hover:text-cyan-400 hover:scale-105 transition-all"
            onClick={onLoginClick}
          >
            <User className="mr-2 h-4 w-4" />
            Log in with Spotify
          </Button>
        )}
      </div>
    </div>
  );
};

export default Header;
