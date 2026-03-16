
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const ActiveJobs: React.FC = () => {
  const activeJobs = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "TechSolutions Inc.",
      status: "Interview Scheduled",
      daysLeft: 2,
      location: "Remote",
      applicationDate: "2025-03-15",
    },
    {
      id: 2,
      title: "UI/UX Designer",
      company: "Creative Designs Co.",
      status: "Assessment",
      daysLeft: 5,
      location: "San Francisco, CA",
      applicationDate: "2025-03-18",
    },
    {
      id: 3,
      title: "Full Stack Developer",
      company: "Innovative Tech",
      status: "Application Received",
      daysLeft: 7,
      location: "Remote",
      applicationDate: "2025-03-20",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-800">Active Jobs</h1>
        <Button variant="outline">
          Track New Application
        </Button>
      </div>
      
      <div className="space-y-4">
        {activeJobs.map((job) => (
          <Card key={job.id} className="glass-card">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  <CardDescription>{job.company} • {job.location}</CardDescription>
                </div>
                <Badge className="bg-purple-700">{job.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-sm">
                  <p className="text-muted-foreground">Applied on {job.applicationDate}</p>
                  <p className="font-medium text-purple-700">{job.daysLeft} days until next step</p>
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

export default ActiveJobs;
