
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building, MapPin, Globe, Mail, Phone, Edit2, Users, Briefcase, Image } from "lucide-react";

const CompanyProfile: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-800">Company Profile</h1>
        <Button variant="outline">
          <Edit2 className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="culture">Culture</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-card md:col-span-1">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 flex items-center justify-center bg-purple-100 rounded-lg mb-4">
                    <Building className="h-12 w-12 text-purple-700" />
                  </div>
                  <h2 className="text-xl font-bold">TechRecruit Co.</h2>
                  <p className="text-muted-foreground">Technology Recruitment</p>
                  <div className="flex items-center mt-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>San Francisco, CA</span>
                  </div>
                  <div className="w-full mt-6 space-y-2">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">www.techrecruitco.example</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">info@techrecruitco.example</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">(555) 987-6543</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="md:col-span-2 space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>About Company</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    TechRecruit Co. is a forward-thinking technology recruitment firm dedicated to connecting top talent with innovative companies. 
                    With over 10 years of experience in the tech recruitment space, our team understands the unique challenges of the industry and 
                    is committed to providing personalized solutions for both candidates and clients.
                  </p>
                  <p className="text-sm mt-4">
                    Our expertise spans across various tech domains including software development, product management, UI/UX design, data science, 
                    and emerging technologies. By leveraging cutting-edge AI tools and a human-centered approach, we ensure the perfect match 
                    between talented professionals and growth-oriented organizations.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Company Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-purple-50 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">Employees</p>
                      <p className="text-2xl font-bold text-purple-700">125</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">Open Positions</p>
                      <p className="text-2xl font-bold text-purple-700">24</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">Founded</p>
                      <p className="text-2xl font-bold text-purple-700">2015</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">Locations</p>
                      <p className="text-2xl font-bold text-purple-700">3</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Industry Focus</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {["Software Development", "AI & Machine Learning", "FinTech", "HealthTech", "E-commerce", "EdTech", "Blockchain", "Cybersecurity"].map((industry) => (
                      <div key={industry} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                        {industry}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="team" className="py-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Recruitment Team</CardTitle>
              <CardDescription>
                Manage your recruitment team members and their roles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Showing 5 of 12 team members
                  </div>
                  <Button size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Add Team Member
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: "Jennifer Williams", title: "Recruiting Lead", email: "jennifer@example.com" },
                    { name: "Robert Chen", title: "Technical Recruiter", email: "robert@example.com" },
                    { name: "Sarah Johnson", title: "Talent Acquisition", email: "sarah@example.com" },
                    { name: "Michael Rodriguez", title: "HR Manager", email: "michael@example.com" },
                    { name: "Emily Davis", title: "Technical Recruiter", email: "emily@example.com" },
                  ].map((member, i) => (
                    <Card key={i} className="border border-purple-100">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-lg font-medium text-purple-700">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h4 className="font-medium">{member.name}</h4>
                            <p className="text-sm text-muted-foreground">{member.title}</p>
                            <p className="text-sm text-purple-700">{member.email}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-end">
                          <Button variant="outline" size="sm">
                            View Profile
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="branding" className="py-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Brand Identity</CardTitle>
              <CardDescription>
                Customize how your company appears to candidates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="logo">Company Logo</Label>
                      <div className="mt-2 flex items-center justify-center border-2 border-dashed border-purple-200 rounded-lg p-6 cursor-pointer hover:bg-purple-50 transition-colors">
                        <div className="text-center">
                          <Image className="mx-auto h-12 w-12 text-purple-400" />
                          <div className="mt-2">
                            <p className="text-sm text-muted-foreground">
                              Drag and drop or click to upload
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              PNG, JPG, or SVG (max. 1MB)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="primaryColor">Primary Brand Color</Label>
                      <div className="flex gap-2">
                        <div className="w-10 h-10 rounded-md bg-purple-700 border border-purple-800"></div>
                        <Input id="primaryColor" value="#6D28D9" className="w-32" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="secondaryColor">Secondary Brand Color</Label>
                      <div className="flex gap-2">
                        <div className="w-10 h-10 rounded-md bg-purple-200 border border-purple-300"></div>
                        <Input id="secondaryColor" value="#E9D5FF" className="w-32" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="slogan">Company Slogan</Label>
                      <Input id="slogan" placeholder="Enter your company slogan" defaultValue="Connecting talent with opportunity" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="videoURL">Company Introduction Video URL</Label>
                      <Input id="videoURL" placeholder="https://example.com/video" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="website">Company Website</Label>
                      <Input id="website" placeholder="https://example.com" defaultValue="https://techrecruitco.example" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="companyDescription">Company Description (for job postings)</Label>
                  <Textarea 
                    id="companyDescription" 
                    rows={5}
                    defaultValue="TechRecruit Co. is a leading technology recruitment firm connecting talented professionals with innovative companies across the tech industry. We pride ourselves on understanding both client and candidate needs to make the perfect match."
                  />
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button>Save Branding</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="culture" className="py-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Company Culture</CardTitle>
              <CardDescription>
                Showcase your company culture to attract the right talent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="coreValues">Core Values</Label>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { value: "Innovation", description: "We embrace new ideas and technologies" },
                        { value: "Collaboration", description: "We work together to achieve common goals" },
                        { value: "Integrity", description: "We uphold the highest ethical standards" },
                        { value: "Excellence", description: "We strive for exceptional quality in all we do" },
                      ].map((item, i) => (
                        <Card key={i} className="border border-purple-100">
                          <CardContent className="p-4">
                            <h4 className="font-medium text-purple-700">{item.value}</h4>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="benefits">Benefits & Perks</Label>
                    <Textarea 
                      id="benefits" 
                      rows={4}
                      defaultValue="• Competitive salary and comprehensive health benefits
• Flexible work arrangements with remote options
• Professional development budget and career growth opportunities
• Team building events and company retreats"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Work Environment</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {["Remote-friendly", "Flexible hours", "Collaborative", "Fast-paced", "Innovative", "Results-oriented"].map((item) => (
                        <div key={item} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="socialResponsibility">Social Responsibility</Label>
                    <Textarea 
                      id="socialResponsibility" 
                      rows={3}
                      defaultValue="Our company is committed to sustainable practices and giving back to the community through volunteer programs and charitable initiatives. We believe in using our resources to make a positive impact on society."
                    />
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button>Save Culture Information</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanyProfile;
