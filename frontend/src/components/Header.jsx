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

      {/* Login/Profile Button */}
      <div className="flex items-center gap-4">
        {isAuthenticated && userProfile ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="rounded-full h-10 px-3 hover:bg-gray-800 transition-all"
              >
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={userProfile.images?.[0]?.url} alt={userProfile.display_name} />
                  <AvatarFallback className="bg-cyan-500 text-black font-semibold">
                    {userProfile.display_name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-white font-medium">{userProfile.display_name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-gray-900 border-gray-700">
              <DropdownMenuLabel className="text-gray-300">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold text-white">{userProfile.display_name}</p>
                  <p className="text-xs text-gray-400">{userProfile.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem 
                className="text-gray-300 hover:bg-gray-800 focus:bg-gray-800 cursor-pointer"
                onClick={() => window.open(userProfile.external_urls?.spotify, '_blank')}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open in Spotify
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem 
                className="text-red-400 hover:bg-gray-800 focus:bg-gray-800 cursor-pointer"
                onClick={onLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
