
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MoreVertical, Calendar, Mail, X, Check, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Applications: React.FC = () => {
  const applications = [
    {
      id: 1,
      name: "Sarah Johnson",
      position: "Senior Frontend Developer",
      applied: "2025-03-25",
      status: "New",
      avatar: "SJ",
      match: 92,
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      position: "Senior Frontend Developer",
      applied: "2025-03-24",
      status: "Screening",
      avatar: "MR",
      match: 88,
    },
    {
      id: 3,
      name: "Emily Clark",
      position: "UI/UX Designer",
      applied: "2025-03-22",
      status: "Interview",
      avatar: "EC",
      match: 94,
    },
    {
      id: 4,
      name: "David Lee",
      position: "Full Stack Developer",
      applied: "2025-03-20",
      status: "Assessment",
      avatar: "DL",
      match: 86,
    },
    {
      id: 5,
      name: "Jessica Thompson",
      position: "Full Stack Developer",
      applied: "2025-03-19",
      status: "Rejected",
      avatar: "JT",
      match: 72,
    },
    {
      id: 6,
      name: "Robert Wilson",
      position: "UI/UX Designer",
      applied: "2025-03-18",
      status: "Offer",
      avatar: "RW",
      match: 95,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-800">Applications</h1>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Search candidates..." 
            className="pl-8"
          />
        </div>
        <Button variant="outline">
          Filters
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="screening">Screening</TabsTrigger>
          <TabsTrigger value="interview">Interview</TabsTrigger>
          <TabsTrigger value="offer">Offer</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="py-4">
          <Card className="glass-card">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-purple-100">
                      <th className="px-4 py-3 text-left font-medium">Candidate</th>
                      <th className="px-4 py-3 text-left font-medium">Position</th>
                      <th className="px-4 py-3 text-left font-medium">Applied</th>
                      <th className="px-4 py-3 text-left font-medium">Status</th>
                      <th className="px-4 py-3 text-left font-medium">Match</th>
                      <th className="px-4 py-3 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app.id} className="border-b border-purple-100 hover:bg-purple-50/30">
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage src="" />
                              <AvatarFallback className="bg-purple-100 text-purple-700">
                                {app.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{app.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{app.position}</td>
                        <td className="px-4 py-3 text-muted-foreground">{app.applied}</td>
                        <td className="px-4 py-3">
                          <Badge 
                            className={
                              app.status === "New" 
                                ? "bg-blue-600" 
                                : app.status === "Screening" 
                                  ? "bg-yellow-600" 
                                  : app.status === "Interview"
                                    ? "bg-purple-700"
                                    : app.status === "Assessment"
                                      ? "bg-orange-600"
                                      : app.status === "Offer"
                                        ? "bg-green-600"
                                        : "bg-red-600"
                            }
                          >
                            {app.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="w-16 h-2 rounded-full bg-gray-200 mr-2">
                              <div 
                                className="h-2 rounded-full bg-green-500" 
                                style={{ width: `${app.match}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{app.match}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                              <Mail className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                              <Calendar className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="cursor-pointer">
                                  Move to Screening
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                  Move to Interview
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                  Move to Assessment
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer">
                                  <Check className="h-4 w-4 mr-2 text-green-600" />
                                  Make Offer
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer text-red-600">
                                  <X className="h-4 w-4 mr-2" />
                                  Reject
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="new" className="py-4">
          <Card className="glass-card p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {applications.filter(app => app.status === "New").map((app) => (
                <Card key={app.id} className="border border-purple-100">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-2">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-purple-100 text-purple-700">
                            {app.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">{app.name}</CardTitle>
                          <CardDescription>{app.position}</CardDescription>
                        </div>
                      </div>
                      <Badge className="bg-blue-600">New</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div className="w-full h-2 rounded-full bg-gray-200 mr-2">
                          <div 
                            className="h-2 rounded-full bg-green-500" 
                            style={{ width: `${app.match}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium whitespace-nowrap">{app.match}% Match</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Applied on {app.applied}
                      </div>
                      <div className="pt-2 flex justify-between">
                        <Button variant="outline" size="sm" className="text-red-600">
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button size="sm">
                          Review Application
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="screening" className="py-4">
          <Card className="glass-card p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {applications.filter(app => app.status === "Screening").map((app) => (
                <Card key={app.id} className="border border-purple-100">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-2">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-purple-100 text-purple-700">
                            {app.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">{app.name}</CardTitle>
                          <CardDescription>{app.position}</CardDescription>
                        </div>
                      </div>
                      <Badge className="bg-yellow-600">Screening</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div className="w-full h-2 rounded-full bg-gray-200 mr-2">
                          <div 
                            className="h-2 rounded-full bg-green-500" 
                            style={{ width: `${app.match}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium whitespace-nowrap">{app.match}% Match</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Applied on {app.applied}
                      </div>
                      <div className="pt-2 flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <Mail className="h-4 w-4 mr-1" />
                          Email
                        </Button>
                        <Button size="sm">
                          Schedule Call
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="interview" className="py-4">
          <Card className="glass-card p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {applications.filter(app => app.status === "Interview").map((app) => (
                <Card key={app.id} className="border border-purple-100">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-2">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-purple-100 text-purple-700">
                            {app.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">{app.name}</CardTitle>
                          <CardDescription>{app.position}</CardDescription>
                        </div>
                      </div>
                      <Badge className="bg-purple-700">Interview</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div className="w-full h-2 rounded-full bg-gray-200 mr-2">
                          <div 
                            className="h-2 rounded-full bg-green-500" 
                            style={{ width: `${app.match}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium whitespace-nowrap">{app.match}% Match</span>
                      </div>
                      <div className="text-sm font-medium text-purple-700">
                        Interview scheduled for April 10, 2025
                      </div>
                      <div className="pt-2 flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <Calendar className="h-4 w-4 mr-1" />
                          Reschedule
                        </Button>
                        <Button size="sm">
                          Join Interview
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="offer" className="py-4">
          <Card className="glass-card p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {applications.filter(app => app.status === "Offer").map((app) => (
                <Card key={app.id} className="border border-purple-100">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-2">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-purple-100 text-purple-700">
                            {app.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">{app.name}</CardTitle>
                          <CardDescription>{app.position}</CardDescription>
                        </div>
                      </div>
                      <Badge className="bg-green-600">Offer</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div className="w-full h-2 rounded-full bg-gray-200 mr-2">
                          <div 
                            className="h-2 rounded-full bg-green-500" 
                            style={{ width: `${app.match}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium whitespace-nowrap">{app.match}% Match</span>
                      </div>
                      <div className="text-sm font-medium text-green-600">
                        Offer sent on April 1, 2025
                      </div>
                      <div className="pt-2 flex justify-end gap-2">
                        <Button size="sm">
                          View Offer Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Applications;
