
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { MobileNav } from "@/components/ui/MobileNav";
import { MainNav } from "@/components/ui/MainNav";
import { UserNav } from "@/components/ui/UserNav";
import { Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  role?: "user" | "recruiter" | "admin";
  children?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ role = "user", children }) => {
  const navigate = useNavigate();
  
  // Get role name for display
  const getRoleName = () => {
    switch (role) {
      case "user":
        return "Job Seeker";
      case "recruiter":
        return "Recruiter";
      case "admin":
        return "Admin";
      default:
        return "User";
    }
  };

  // Get dashboard home route
  const getDashboardRoute = () => {
    switch (role) {
      case "user":
        return "/user-dashboard";
      case "recruiter":
        return "/recruiter-dashboard";
      case "admin":
        return "/admin-dashboard";
      default:
        return "/";
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-purple-100 shadow-sm">
        <div className="container flex h-16 items-center px-4 sm:px-6">
          <div className="md:hidden mr-2">
            <MobileNav role={role} />
          </div>
          <div className="flex items-center">
            <Link to={getDashboardRoute()} className="flex items-center">
              <div className="bg-purple-700 text-white p-1.5 rounded-lg mr-2">
                <Shield className="h-5 w-5" />
              </div>
              <span className="font-bold text-xl hidden sm:inline-block text-purple-800">e-Shielded</span>
            </Link>
            <div className={cn(
              "ml-2 rounded-md px-2 py-1 text-xs font-medium",
              role === "user" && "bg-purple-100 text-purple-700",
              role === "admin" && "bg-yellow-50 text-yellow-700",
              role === "recruiter" && "bg-blue-50 text-blue-700"
            )}>
              {getRoleName()}
            </div>
          </div>
          <div className="flex-1 flex justify-end">
            <UserNav role={role} />
          </div>
        </div>
      </header>
      <div className="flex-1 container grid md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] md:gap-6 p-0 md:p-6">
        <aside className="hidden md:block border-r md:border-0 md:bg-white/70 backdrop-blur-sm rounded-xl p-4 h-fit shadow-sm border border-purple-100">
          <MainNav role={role} />
        </aside>
        <main className="flex flex-col flex-1 p-4 md:p-6 overflow-hidden bg-white/50 md:border border-purple-50 md:rounded-xl md:shadow-sm">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
