import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { User, Settings, LogOut } from "lucide-react";

export function UserNav({ role = "user" }: { role?: "user" | "recruiter" | "admin" }) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<{ name: string; email: string } | null>(null);

  // Fetch user data using the "me" API
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("https://eshielded.itshivam.in/api/auth/me", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUserData({ name: data.user.name, email: data.user.email });
        }
      })
      .catch((error) => console.error("Error fetching user info:", error));
  }, []);

  const handleLogout = () => {
    // Clear token and navigate to landing page or login
    localStorage.removeItem("token");
    navigate("/");
  };

  const goToProfile = () => {
    navigate(`/${role}-dashboard/profile`);
  };

  const goToSettings = () => {
    navigate(`/${role}-dashboard/settings`);
  };

  // Fallback initials if userData is not available
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full border-2 border-purple-100 p-0">
          <Avatar className="h-9 w-9">
            <AvatarImage src="" alt="User Avatar" />
            <AvatarFallback className="bg-purple-100 text-purple-700 font-medium">
              {userData ? getInitials(userData.name) : role === "user" ? "JS" : role === "recruiter" ? "RC" : "AD"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white shadow-md border border-purple-100" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {userData ? userData.name : role === "user" ? "John Smith" : role === "recruiter" ? "Recruit Co." : "Admin User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {userData ? userData.email : role === "user" ? "job.seeker@example.com" : role === "recruiter" ? "recruiter@example.com" : "admin@example.com"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={goToProfile} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={goToSettings} className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
