
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const SearchJobs: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-800">Search Jobs</h1>
      </div>

      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle>Find Your Next Opportunity</CardTitle>
          <CardDescription>
            Search through thousands of job listings tailored to your skills and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input 
                type="text" 
                placeholder="Job title, keywords, or company"
                className="w-full"
              />
            </div>
            <div className="flex-1">
              <Input 
                type="text" 
                placeholder="Location"
                className="w-full"
              />
            </div>
            <Button className="shrink-0">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i} className="glass-card hover-scale">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Senior React Developer</CardTitle>
              <CardDescription>TechCorp Inc. • Remote</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  We're looking for an experienced React developer to join our growing team. The ideal candidate will have 3+ years of experience with React and related technologies.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    React
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    TypeScript
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Remote
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SearchJobs;
