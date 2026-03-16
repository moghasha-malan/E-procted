
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import AuthLayout from "./components/auth/AuthLayout";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import UserDashboard from "./components/dashboard/UserDashboard";
import RecruiterDashboard from "./components/dashboard/RecruiterDashboard";
import AdminDashboard from "./components/dashboard/AdminDashboard";

// User Dashboard Pages
import SearchJobs from "./components/dashboard/user/SearchJobs";
import ActiveJobs from "./components/dashboard/user/ActiveJobs";
import AppliedJobs from "./components/dashboard/user/AppliedJobs";
import MyResume from "./components/dashboard/user/MyResume";
import UserProfile from "./components/dashboard/user/UserProfile";
import UserSettings from "./components/dashboard/user/UserSettings";
import SkillsQuiz from "./components/dashboard/user/SkillsQuiz";
import CodingAssessment from "./components/dashboard/user/CodingAssessment";

// Recruiter Dashboard Pages
import JobPostings from "./components/dashboard/recruiter/JobPostings";
import NewJobPosting from "./components/dashboard/recruiter/NewJobPosting";
import Applications from "./components/dashboard/recruiter/Applications";
import Assessments from "./components/dashboard/recruiter/Assessments";
import Interviews from "./components/dashboard/recruiter/Interviews";
import CompanyProfile from "./components/dashboard/recruiter/CompanyProfile";
import RecruiterSettings from "./components/dashboard/recruiter/RecruiterSettings";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-b from-purple-50/50 to-white">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<Index />} />
            
            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
            </Route>
            
            {/* User Dashboard Routes */}
            <Route path="/user-dashboard" element={<DashboardLayout role="user" />}>
              <Route index element={<UserDashboard />} />
              <Route path="search" element={<SearchJobs />} />
              <Route path="active" element={<ActiveJobs />} />
              <Route path="applied" element={<AppliedJobs />} />
              <Route path="resume" element={<MyResume />} />
              <Route path="skills-quiz" element={<SkillsQuiz />} />
              <Route path="coding-assessment" element={<CodingAssessment />} />
              <Route path="profile" element={<UserProfile />} />
              <Route path="settings" element={<UserSettings />} />
            </Route>
            
            {/* Recruiter Dashboard Routes */}
            <Route path="/recruiter-dashboard" element={<DashboardLayout role="recruiter" />}>
              <Route index element={<RecruiterDashboard />} />
              <Route path="jobs" element={<JobPostings />} />
              <Route path="jobs/new" element={<NewJobPosting />} />
              <Route path="applications" element={<Applications />} />
              <Route path="assessments" element={<Assessments />} />
              <Route path="interviews" element={<Interviews />} />
              <Route path="profile" element={<CompanyProfile />} />
              <Route path="settings" element={<RecruiterSettings />} />
            </Route>
            
            {/* Admin Dashboard Routes */}
            <Route path="/admin-dashboard" element={<DashboardLayout role="admin" />}>
              <Route index element={<AdminDashboard />} />
              {/* Add other admin dashboard routes here */}
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

