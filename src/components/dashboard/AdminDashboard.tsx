
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Briefcase, Building, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform overview and management</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-scale card-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground">
              Active job seekers
            </p>
          </CardContent>
        </Card>
        <Card className="hover-scale card-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Recruiters</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87</div>
            <p className="text-xs text-muted-foreground">
              Registered companies
            </p>
          </CardContent>
        </Card>
        <Card className="hover-scale card-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">243</div>
            <p className="text-xs text-muted-foreground">
              Currently posted jobs
            </p>
          </CardContent>
        </Card>
        <Card className="hover-scale card-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,521</div>
            <p className="text-xs text-muted-foreground">
              Total job applications
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Platform Activity</CardTitle>
          <CardDescription>User registrations and job postings over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="users" stackId="1" stroke="#8884d8" fill="#8884d8" />
                <Area type="monotone" dataKey="jobs" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                <Area type="monotone" dataKey="applications" stackId="1" stroke="#ffc658" fill="#ffc658" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1 card-shadow">
          <CardHeader>
            <CardTitle>Recent User Registrations</CardTitle>
            <CardDescription>
              New job seekers on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">Joined: {user.joinDate}</div>
                  </div>
                  <Badge variant={user.status === "Pending" ? "outline" : "default"}>
                    {user.status}
                  </Badge>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link to="/admin-dashboard/users">Manage Users</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 card-shadow">
          <CardHeader>
            <CardTitle>Recent Recruiter Registrations</CardTitle>
            <CardDescription>
              New companies on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRecruiters.map((recruiter) => (
                <div key={recruiter.id} className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="font-medium">{recruiter.company}</div>
                    <div className="text-sm text-muted-foreground">Joined: {recruiter.joinDate}</div>
                  </div>
                  <Badge variant={recruiter.status === "Pending" ? "outline" : "default"}>
                    {recruiter.status}
                  </Badge>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link to="/admin-dashboard/recruiters">Manage Recruiters</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>System Performance</CardTitle>
          <CardDescription>
            Platform metrics and statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">API Response Time</div>
                <div className="text-2xl font-bold">124ms</div>
                <div className="text-xs text-green-600">↓ 12% from last week</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">AI Analysis Accuracy</div>
                <div className="text-2xl font-bold">97.8%</div>
                <div className="text-xs text-green-600">↑ 2.4% from last week</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Error Rate</div>
                <div className="text-2xl font-bold">0.02%</div>
                <div className="text-xs text-green-600">↓ 0.01% from last week</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">User Satisfaction</div>
                <div className="text-2xl font-bold">4.8/5</div>
                <div className="text-xs text-green-600">↑ 0.2 from last week</div>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link to="/admin-dashboard/analytics">View Detailed Analytics</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Sample data
const recentUsers = [
  { id: 1, name: "John Doe", joinDate: "Today", status: "Verified" },
  { id: 2, name: "Jane Smith", joinDate: "Yesterday", status: "Pending" },
  { id: 3, name: "Robert Johnson", joinDate: "2 days ago", status: "Verified" },
];

const recentRecruiters = [
  { id: 1, company: "Tech Solutions Inc.", joinDate: "Today", status: "Pending" },
  { id: 2, company: "Global Innovations", joinDate: "3 days ago", status: "Verified" },
  { id: 3, company: "Digital Services Co.", joinDate: "1 week ago", status: "Verified" },
];

const chartData = [
  { name: 'Jan', users: 40, jobs: 24, applications: 60 },
  { name: 'Feb', users: 30, jobs: 13, applications: 45 },
  { name: 'Mar', users: 20, jobs: 28, applications: 52 },
  { name: 'Apr', users: 27, jobs: 18, applications: 38 },
  { name: 'May', users: 18, jobs: 24, applications: 47 },
  { name: 'Jun', users: 23, jobs: 30, applications: 62 },
  { name: 'Jul', users: 34, jobs: 22, applications: 57 },
];

export default AdminDashboard;
