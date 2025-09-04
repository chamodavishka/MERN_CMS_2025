// Import necessary hooks and components
import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/auth-context";

// Import UI components from shadcn/ui
import { Button } from "../ui/button";

// *** THIS IS THE CORRECTED IMPORT PATH ***
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Import icons from lucide-react
import { GraduationCap, Menu, X, BookMarked, User, Settings, LogOut, BookOpen, Calendar, MessageSquare, FileText, BarChart3 } from "lucide-react";

function StudentViewCommonHeader() {
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get the current page path
  const { auth, resetCredentials } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get user initials for Avatar fallback
  const userInitials = auth?.user?.name
    ? auth.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "ST";

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
  }

  // Helper function to create navigation links, avoiding code repetition
  const navLinks = [
    { href: "/courses", label: "My Courses" },
  ];

  return (
    <>
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
          
          <Link to="/home" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              COURSE STUDIO
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-all py-2 px-1 border-b-2 ${
                  location.pathname.includes(link.href)
                    ? "text-indigo-600 font-semibold border-indigo-600"
                    : "text-gray-600 hover:text-gray-900 border-transparent hover:border-gray-300"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <Avatar className="h-9 w-9 border-2 border-indigo-100">
                      <AvatarImage src={auth?.user?.avatarUrl} alt={auth?.user?.name} />
                      <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:block">
                      <p className="text-sm font-medium text-gray-900">{auth?.user?.name}</p>
                      <p className="text-xs text-gray-500">Student</p>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 rounded-xl shadow-lg border-0 bg-white/95 backdrop-blur-sm mt-2 p-2">
                  <DropdownMenuLabel className="p-3 text-xs text-gray-500">MY ACCOUNT</DropdownMenuLabel>
                  
                  <DropdownMenuItem 
                    onClick={() => navigate("/student-profile")} 
                    className="flex items-center gap-3 p-3 rounded-lg cursor-pointer text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 focus:bg-indigo-50 focus:text-indigo-700"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    onClick={() => navigate("/student-profile")} 
                    className="flex items-center gap-3 p-3 rounded-lg cursor-pointer text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 focus:bg-indigo-50 focus:text-indigo-700"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>Grades</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    onClick={() => navigate("/student-profile")} 
                    className="flex items-center gap-3 p-3 rounded-lg cursor-pointer text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 focus:bg-indigo-50 focus:text-indigo-700"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Calendar</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    onClick={() => navigate("/student-profile")} 
                    className="flex items-center gap-3 p-3 rounded-lg cursor-pointer text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 focus:bg-indigo-50 focus:text-indigo-700"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Messages</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    onClick={() => navigate("/student-profile")} 
                    className="flex items-center gap-3 p-3 rounded-lg cursor-pointer text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 focus:bg-indigo-50 focus:text-indigo-700"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Private Files</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    onClick={() => navigate("/student-courses")} 
                    className="flex items-center gap-3 p-3 rounded-lg cursor-pointer text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 focus:bg-indigo-50 focus:text-indigo-700"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>My Courses</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator className="my-2 bg-gray-200" />
                  
                  <DropdownMenuItem 
                    onClick={() => navigate("/settings")} 
                    className="flex items-center gap-3 p-3 rounded-lg cursor-pointer text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 focus:bg-indigo-50 focus:text-indigo-700"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  
                  <div className="p-2">
                    <Button 
                      onClick={handleLogout} 
                      variant="outline" 
                      className="w-full flex items-center justify-center gap-2 rounded-lg border-gray-300 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-sm shadow-lg pb-4 border-b border-gray-200">
            <nav className="flex flex-col items-stretch gap-1 p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-base font-medium py-3 px-4 rounded-lg text-center ${
                    location.pathname.includes(link.href)
                      ? "bg-indigo-50 text-indigo-700 font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3 px-4 py-3">
                  <Avatar className="h-10 w-10 border-2 border-indigo-100">
                    <AvatarImage src={auth?.user?.avatarUrl} alt={auth?.user?.name} />
                    <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{auth?.user?.name}</p>
                    <p className="text-xs text-gray-500">Student</p>
                  </div>
                </div>
                
                <Button 
                  onClick={handleLogout} 
                  variant="outline" 
                  className="w-full mt-4 flex items-center justify-center gap-2 rounded-lg border-gray-300 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

export default StudentViewCommonHeader;