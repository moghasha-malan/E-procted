
import React from "react";
import { Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

const AuthLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side branding */}
      <div className="hidden md:flex md:w-1/2 bg-purple-500 text-white flex-col justify-center items-center p-8">
        <div className="max-w-md mx-auto flex flex-col items-center text-center space-y-6 animate-fade-in">
          <div className="bg-white rounded-full p-4 mb-4">
            <Shield size={48} className="text-eshield-500" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">e-Shielded</h1>
          <p className="text-lg text-eshield-50 max-w-sm">
            AI-powered platform that automates the complete hiring process, from resume analysis to online assessments and interviews.
          </p>
          <div className="space-y-4 pt-8">
            <div className="flex items-center space-x-3">
              <div className="bg-eshield-400 rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
              </div>
              <span>Resume Analysis</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-eshield-400 rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <span>AI-Powered Job Search</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-eshield-400 rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-video"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
              </div>
              <span>Automated Interviews</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side authentication forms */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 bg-white">
        {children || <Outlet />}
      </div>
    </div>
  );
};

export default AuthLayout;
