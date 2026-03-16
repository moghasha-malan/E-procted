
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { 
  LayoutDashboard, Search, Briefcase, FileText, User, Settings, 
  Building, ListChecks, FileCode, Video, Award, Code
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

interface MainNavProps {
  role?: "user" | "recruiter" | "admin";
  onClick?: () => void;
}

const userNavItems: NavItem[] = [
  { title: "Dashboard", href: "/user-dashboard", icon: <LayoutDashboard className="mr-2 h-4 w-4" /> },
  { title: "Search Jobs", href: "/user-dashboard/search", icon: <Search className="mr-2 h-4 w-4" /> },
  { title: "Active Jobs", href: "/user-dashboard/active", icon: <Briefcase className="mr-2 h-4 w-4" /> },
  { title: "Applied Jobs", href: "/user-dashboard/applied", icon: <ListChecks className="mr-2 h-4 w-4" /> },
  { title: "Mock Interview", href: "https://mock-interview.eshielded.itshivam.in/", icon: <User className="mr-2 h-4 w-4" /> },
  { title: "My Resume", href: "/user-dashboard/resume", icon: <FileText className="mr-2 h-4 w-4" /> },
  { title: "Skills Quiz", href: "/user-dashboard/skills-quiz", icon: <Award className="mr-2 h-4 w-4" /> },
  { title: "Coding Assessment", href: "/user-dashboard/coding-assessment", icon: <Code className="mr-2 h-4 w-4" /> },
  { title: "My Profile", href: "/user-dashboard/profile", icon: <User className="mr-2 h-4 w-4" /> },
  { title: "Settings", href: "/user-dashboard/settings", icon: <Settings className="mr-2 h-4 w-4" /> }
];

const recruiterNavItems: NavItem[] = [
  { title: "Dashboard", href: "/recruiter-dashboard", icon: <LayoutDashboard className="mr-2 h-4 w-4" /> },
  { title: "Job Postings", href: "/recruiter-dashboard/jobs", icon: <Briefcase className="mr-2 h-4 w-4" /> },
  { title: "Applications", href: "/recruiter-dashboard/applications", icon: <ListChecks className="mr-2 h-4 w-4" /> },
  { title: "Assessments", href: "/recruiter-dashboard/assessments", icon: <FileCode className="mr-2 h-4 w-4" /> },
  { title: "Interviews", href: "/recruiter-dashboard/interviews", icon: <Video className="mr-2 h-4 w-4" /> },
  { title: "Company Profile", href: "/recruiter-dashboard/profile", icon: <Building className="mr-2 h-4 w-4" /> },
  { title: "Settings", href: "/recruiter-dashboard/settings", icon: <Settings className="mr-2 h-4 w-4" /> }
];

const adminNavItems: NavItem[] = [
  { title: "Dashboard", href: "/admin-dashboard", icon: <LayoutDashboard className="mr-2 h-4 w-4" /> },
  { title: "User Management", href: "/admin-dashboard/users", icon: <User className="mr-2 h-4 w-4" /> },
  { title: "Recruiter Management", href: "/admin-dashboard/recruiters", icon: <Building className="mr-2 h-4 w-4" /> },
  { title: "Analytics", href: "/admin-dashboard/analytics", icon: <FileText className="mr-2 h-4 w-4" /> },
  { title: "Settings", href: "/admin-dashboard/settings", icon: <Settings className="mr-2 h-4 w-4" /> }
];

export function MainNav({ role = "user", onClick }: MainNavProps) {
  const location = useLocation();
  
  // Choose navigation items based on role
  const navItems = role === "user" 
    ? userNavItems 
    : role === "recruiter" 
      ? recruiterNavItems 
      : adminNavItems;

  return (
    <nav className="flex flex-col space-y-1">
      {navItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          onClick={onClick}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            location.pathname === item.href
              ? "bg-purple-50 text-purple-700 font-medium"
              : "text-muted-foreground hover:bg-purple-50 hover:text-purple-700",
            "justify-start"
          )}
        >
          {item.icon}
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
