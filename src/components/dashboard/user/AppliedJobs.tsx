
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, ExternalLink } from "lucide-react";

const AppliedJobs: React.FC = () => {
  const appliedJobs = [
    {
      id: 1,
      title: "Software Engineer",
      company: "Tech Innovations",
      status: "Rejected",
      location: "Boston, MA",
      applicationDate: "2025-02-10",
    },
    {
      id: 2,
      title: "Frontend Developer",
      company: "WebSolutions",
      status: "Hired",
      location: "Remote",
      applicationDate: "2025-01-15",
    },
    {
      id: 3,
      title: "UI Developer",
      company: "DesignWorks",
      status: "Pending",
      location: "Austin, TX",
      applicationDate: "2025-03-25",
    },
    {
      id: 4,
      title: "React Developer",
      company: "App Makers",
      status: "Pending",
      location: "Remote",
      applicationDate: "2025-03-28",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-purple-800">Applied Jobs</h1>
          <p className="text-muted-foreground">Track all your past and recent job applications</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline">Filter</Button>
          <Button variant="outline">Export CSV</Button>
        </div>
      </div>
      
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Application Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-muted-foreground">Applied</p>
              <p className="text-2xl font-bold text-purple-700">28</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-muted-foreground">Interviews</p>
              <p className="text-2xl font-bold text-purple-700">12</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-muted-foreground">Offers</p>
              <p className="text-2xl font-bold text-purple-700">3</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Application Success Rate</span>
              <span className="font-medium">42%</span>
            </div>
            <Progress value={42} className="h-2 bg-purple-100" />
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        {appliedJobs.map((job) => (
          <Card key={job.id} className="glass-card">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  <CardDescription>{job.company} • {job.location}</CardDescription>
                </div>
                <Badge 
                  className={
                    job.status === "Hired" 
                      ? "bg-green-600" 
                      : job.status === "Rejected" 
                        ? "bg-red-600" 
                        : "bg-yellow-600"
                  }
                >
                  {job.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  Applied on {job.applicationDate}
                </div>
                <Button variant="outline" size="sm" className="group">
                  <span>View Details</span>
                  <ExternalLink className="h-4 w-4 ml-2 opacity-70 group-hover:opacity-100" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AppliedJobs;
