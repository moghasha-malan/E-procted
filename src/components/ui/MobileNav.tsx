
import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { MainNav } from "@/components/ui/MainNav";
import { Shield } from "lucide-react";

export function MobileNav({ role = "user" }: { role?: "user" | "recruiter" | "admin" }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Get dashboard home route based on role
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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6 text-purple-700" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[80%] max-w-[300px] border-r-purple-100">
        <div className="flex items-center mb-8 mt-4">
          <div className="bg-purple-700 text-white p-2 rounded-lg mr-3">
            <Shield className="h-5 w-5" />
          </div>
          <Link 
            to={getDashboardRoute()} 
            className="font-bold text-xl text-purple-800"
            onClick={() => setOpen(false)}
          >
            e-Shielded
          </Link>
        </div>
        <div className="mt-4 border-t border-purple-100 pt-4">
          <MainNav role={role} onClick={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
