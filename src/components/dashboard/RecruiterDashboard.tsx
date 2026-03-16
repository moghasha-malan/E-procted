
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Briefcase, User, FileText, Video, Building } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    activeJobs: 5,
    applications: 27,
    interviews: 8,
    shortlisted: 12
  });

  // Navigation functions
  const goToJobs = () => navigate("/recruiter-dashboard/jobs");
  const goToApplications = () => navigate("/recruiter-dashboard/applications");
  const goToInterviews = () => navigate("/recruiter-dashboard/interviews");
  const goToAssessments = () => navigate("/recruiter-dashboard/assessments");
  const goToProfile = () => navigate("/recruiter-dashboard/profile");
  
  // Function to create a new job posting
  const handleCreateJob = () => {
    navigate("/recruiter-dashboard/jobs/new");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Manage your recruitment activities.</p>
        </div>
        <Button className="bg-eshield-600 hover:bg-eshield-700" onClick={handleCreateJob}>
          <Plus className="mr-2 h-4 w-4" /> Post New Job
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-scale card-shadow cursor-pointer" onClick={goToJobs}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeJobs}</div>
            <p className="text-xs text-muted-foreground">
              Currently active postings
            </p>
          </CardContent>
        </Card>
        <Card className="hover-scale card-shadow cursor-pointer" onClick={goToApplications}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.applications}</div>
            <p className="text-xs text-muted-foreground">
              Total applications received
            </p>
          </CardContent>
        </Card>
        <Card className="hover-scale card-shadow cursor-pointer" onClick={goToInterviews}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Interviews</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.interviews}</div>
            <p className="text-xs text-muted-foreground">
              Scheduled or completed
            </p>
          </CardContent>
        </Card>
        <Card className="hover-scale card-shadow cursor-pointer" onClick={goToApplications}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Shortlisted</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.shortlisted}</div>
            <p className="text-xs text-muted-foreground">
              Candidates in consideration
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1 card-shadow">
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>
              Latest candidates for your job postings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentApplications.map((application) => (
                <div key={application.id} className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="font-medium">{application.name}</div>
                    <div className="text-sm text-muted-foreground">Applied for: {application.role}</div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate(`/recruiter-dashboard/applications/${application.id}`)}>
                    Review
                  </Button>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4" onClick={goToApplications}>
                View All Applications
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 card-shadow">
          <CardHeader>
            <CardTitle>Job Postings</CardTitle>
            <CardDescription>
              Your active job listings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {jobPostings.map((job) => (
                <div key={job.id} className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="font-medium">{job.role}</div>
                    <div className="text-sm text-muted-foreground">{job.applicants} applicants • {job.postedAt}</div>
                  </div>
                  <Badge>{job.status}</Badge>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4" onClick={goToJobs}>
                Manage Job Postings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Recruitment Pipeline</CardTitle>
          <CardDescription>
            Track candidates through your hiring process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">New Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">14</div>
                <div className="mt-4 space-y-2">
                  {pipelineStages.new.map((candidate) => (
                    <div 
                      key={candidate.id} 
                      className="text-sm p-2 rounded-md bg-eshield-50 cursor-pointer hover:bg-eshield-100"
                      onClick={() => navigate(`/recruiter-dashboard/applications/${candidate.id}`)}
                    >
                      {candidate.name} - {candidate.role}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <div className="mt-4 space-y-2">
                  {pipelineStages.assessment.map((candidate) => (
                    <div 
                      key={candidate.id} 
                      className="text-sm p-2 rounded-md bg-eshield-50 cursor-pointer hover:bg-eshield-100"
                      onClick={() => navigate(`/recruiter-dashboard/applications/${candidate.id}`)}
                    >
                      {candidate.name} - {candidate.role}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Interview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <div className="mt-4 space-y-2">
                  {pipelineStages.interview.map((candidate) => (
                    <div 
                      key={candidate.id} 
                      className="text-sm p-2 rounded-md bg-eshield-50 cursor-pointer hover:bg-eshield-100"
                      onClick={() => navigate(`/recruiter-dashboard/applications/${candidate.id}`)}
                    >
                      {candidate.name} - {candidate.role}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Offer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <div className="mt-4 space-y-2">
                  {pipelineStages.offer.map((candidate) => (
                    <div 
                      key={candidate.id} 
                      className="text-sm p-2 rounded-md bg-eshield-50 cursor-pointer hover:bg-eshield-100"
                      onClick={() => navigate(`/recruiter-dashboard/applications/${candidate.id}`)}
                    >
                      {candidate.name} - {candidate.role}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Sample data
const recentApplications = [
  { id: 1, name: "David Miller", role: "Frontend Developer" },
  { id: 2, name: "Sarah Johnson", role: "UX Designer" },
  { id: 3, name: "Michael Brown", role: "Product Manager" },
];

const jobPostings = [
  { id: 1, role: "Frontend Developer", applicants: 12, postedAt: "5d ago", status: "Active" },
  { id: 2, role: "UX Designer", applicants: 8, postedAt: "1w ago", status: "Active" },
  { id: 3, role: "Product Manager", applicants: 7, postedAt: "2w ago", status: "Active" },
];

const pipelineStages = {
  new: [
    { id: 1, name: "Alice Smith", role: "Frontend Developer" },
    { id: 2, name: "Bob Johnson", role: "UX Designer" },
  ],
  assessment: [
    { id: 3, name: "Charlie Brown", role: "Frontend Developer" },
    { id: 4, name: "Diana Prince", role: "Product Manager" },
  ],
  interview: [
    { id: 5, name: "Edward Stark", role: "UX Designer" },
    { id: 6, name: "Fiona Banner", role: "Frontend Developer" },
  ],
  offer: [
    { id: 7, name: "George Lucas", role: "Product Manager" },
    { id: 8, name: "Helen Troy", role: "Frontend Developer" },
  ]
};

export default RecruiterDashboard;
