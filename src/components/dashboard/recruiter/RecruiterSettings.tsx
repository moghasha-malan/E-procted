
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Shield, Bell, Lock, Globe, Users, CreditCard } from "lucide-react";

const RecruiterSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-800">Settings</h1>
      </div>
      
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="py-4 space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Manage your account details and company information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" defaultValue="TechRecruit Co." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue="info@techrecruitco.example" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="(555) 987-6543" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" defaultValue="https://techrecruitco.example" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Primary Location</Label>
                  <Input id="location" defaultValue="San Francisco, CA" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Primary Industry</Label>
                  <Select defaultValue="technology">
                    <SelectTrigger id="industry">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Update your password and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
              </div>
              <div className="flex items-center justify-between pt-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable two-factor authentication for enhanced security
                  </p>
                </div>
                <Switch />
              </div>
              <div className="pt-4 flex justify-end">
                <Button>Update Security</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="py-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how and when you want to be notified
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">New Applications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications when candidates apply to your job postings
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Interview Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Get reminders about upcoming interviews
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Assessment Completions</Label>
                    <p className="text-sm text-muted-foreground">
                      Be notified when candidates complete assessments
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Team Activity</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about your team's recruitment activities
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Marketing Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about new features and promotions
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                <h3 className="text-base font-medium">Notification Channels</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="email-notifications" className="flex-1">Email Notifications</Label>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="sms-notifications" className="flex-1">SMS Notifications</Label>
                    <Switch id="sms-notifications" />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="browser-notifications" className="flex-1">Browser Notifications</Label>
                    <Switch id="browser-notifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="app-notifications" className="flex-1">Mobile App Notifications</Label>
                    <Switch id="app-notifications" defaultChecked />
                  </div>
                </div>
              </div>
              
              <div className="pt-6 flex justify-end">
                <Button>Save Notification Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="team" className="py-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Team Management</CardTitle>
              <CardDescription>
                Manage your recruiting team and access permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-medium">Team Members</h3>
                  <Button size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Invite Team Member
                  </Button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-purple-100">
                        <th className="px-4 py-3 text-left font-medium">Name</th>
                        <th className="px-4 py-3 text-left font-medium">Email</th>
                        <th className="px-4 py-3 text-left font-medium">Role</th>
                        <th className="px-4 py-3 text-left font-medium">Status</th>
                        <th className="px-4 py-3 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: "Jennifer Williams", email: "jennifer@example.com", role: "Admin", status: "Active" },
                        { name: "Robert Chen", email: "robert@example.com", role: "Recruiter", status: "Active" },
                        { name: "Sarah Johnson", email: "sarah@example.com", role: "Recruiter", status: "Active" },
                        { name: "Michael Rodriguez", email: "michael@example.com", role: "Admin", status: "Active" },
                        { name: "Emily Davis", email: "emily@example.com", role: "Recruiter", status: "Invited" },
                      ].map((member, i) => (
                        <tr key={i} className="border-b border-purple-100 hover:bg-purple-50/30">
                          <td className="px-4 py-3 font-medium">{member.name}</td>
                          <td className="px-4 py-3 text-muted-foreground">{member.email}</td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className={member.role === "Admin" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : "bg-purple-50 text-purple-700 border-purple-200"}>
                              {member.role}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <Badge className={member.status === "Active" ? "bg-green-600" : "bg-yellow-600"}>
                              {member.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="pt-6 space-y-4">
                  <h3 className="text-base font-medium">Role Permissions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border border-purple-100">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Admin</CardTitle>
                        <CardDescription>Full access to all features</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          <li className="flex items-center">
                            <Shield className="h-3 w-3 mr-2 text-green-600" />
                            Manage team members and permissions
                          </li>
                          <li className="flex items-center">
                            <Shield className="h-3 w-3 mr-2 text-green-600" />
                            Access billing and subscription settings
                          </li>
                          <li className="flex items-center">
                            <Shield className="h-3 w-3 mr-2 text-green-600" />
                            Create and manage all job postings
                          </li>
                          <li className="flex items-center">
                            <Shield className="h-3 w-3 mr-2 text-green-600" />
                            View and edit all candidate data
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card className="border border-purple-100">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Recruiter</CardTitle>
                        <CardDescription>Limited access to recruitment functions</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          <li className="flex items-center">
                            <Shield className="h-3 w-3 mr-2 text-green-600" />
                            Create and manage assigned job postings
                          </li>
                          <li className="flex items-center">
                            <Shield className="h-3 w-3 mr-2 text-green-600" />
                            Review and manage candidate applications
                          </li>
                          <li className="flex items-center">
                            <Shield className="h-3 w-3 mr-2 text-green-600" />
                            Schedule and conduct interviews
                          </li>
                          <li className="flex items-center">
                            <Shield className="h-3 w-3 mr-2 text-red-600" />
                            Cannot access billing or team management
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing" className="py-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Billing & Subscription</CardTitle>
              <CardDescription>
                Manage your subscription plan and payment details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold text-purple-800">Premium Plan</h3>
                      <p className="text-sm text-muted-foreground">Billed annually at $4,999/year</p>
                    </div>
                    <Badge className="bg-green-600">Active</Badge>
                  </div>
                  <div className="mt-4 text-sm">
                    <div className="flex justify-between py-1">
                      <span>Next billing date</span>
                      <span className="font-medium">January 15, 2026</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Active job postings</span>
                      <span className="font-medium">24 / 50</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Team members</span>
                      <span className="font-medium">5 / 10</span>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm">Change Plan</Button>
                    <Button variant="outline" size="sm" className="text-red-600">Cancel Subscription</Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-base font-medium">Payment Method</h3>
                  <Card className="border border-purple-100">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="bg-purple-100 p-2 rounded-md mr-3">
                            <CreditCard className="h-5 w-5 text-purple-700" />
                          </div>
                          <div>
                            <p className="font-medium">Visa ending in 4242</p>
                            <p className="text-sm text-muted-foreground">Expires 12/2027</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Update</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-base font-medium">Billing History</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-purple-100">
                          <th className="px-4 py-3 text-left font-medium">Date</th>
                          <th className="px-4 py-3 text-left font-medium">Description</th>
                          <th className="px-4 py-3 text-left font-medium">Amount</th>
                          <th className="px-4 py-3 text-left font-medium">Status</th>
                          <th className="px-4 py-3 text-right font-medium">Invoice</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { date: "Jan 15, 2025", description: "Premium Plan - Annual", amount: "$4,999.00", status: "Paid" },
                          { date: "Jan 15, 2024", description: "Premium Plan - Annual", amount: "$4,999.00", status: "Paid" },
                          { date: "Jan 15, 2023", description: "Standard Plan - Annual", amount: "$2,999.00", status: "Paid" },
                        ].map((invoice, i) => (
                          <tr key={i} className="border-b border-purple-100 hover:bg-purple-50/30">
                            <td className="px-4 py-3">{invoice.date}</td>
                            <td className="px-4 py-3">{invoice.description}</td>
                            <td className="px-4 py-3 font-medium">{invoice.amount}</td>
                            <td className="px-4 py-3">
                              <Badge className="bg-green-600">{invoice.status}</Badge>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Button variant="ghost" size="sm">
                                Download
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecruiterSettings;
