import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit2, MapPin, Mail, Phone, Github, Linkedin, Globe, CheckCircle, Award, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const allSkills = [
  "React",
  "TypeScript",
  "JavaScript",
  "HTML5",
  "CSS3",
  "Redux",
  "Next.js",
  "Tailwind CSS",
  "REST API",
  "GraphQL",
  "Git",
  "CI/CD",
  "Jest",
  "Webpack",
  "Node.js",
  "Express",
  "MongoDB",
  "PostgreSQL",
  "Python",
  "Django",
  "Flask",
  "Java",
  "Spring Boot",
  "C#",
  ".NET",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "Firebase",
];

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
  last_login: string | null;
  mobile: string | null;
  github: string | null;
  linkedin: string | null;
  portfolio: string | null;
  about: string | null;
  skills: string[] | null;
  resume: string | null;
  company_name: string | null;
  company_website: string | null;
  industry: string | null;
  location: string | null;
  company_logo: string | null;
}

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [editFormData, setEditFormData] = useState<Partial<UserData>>({
    name: "",
    mobile: "",
    github: "",
    linkedin: "",
    portfolio: "",
    about: "",
    location: "",
    skills: [],
  });
  const [skillsSearchOpen, setSkillsSearchOpen] = useState(false);

  // Fetch user data from the "me" API on component mount.
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        setIsLoading(true);
        const response = await fetch("https://eshielded.itshivam.in/api/auth/me", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        });

        const data = await response.json();
        if (data.user) {
          setUserData(data.user);
          setEditFormData({
            name: data.user.name,
            mobile: data.user.mobile,
            github: data.user.github,
            linkedin: data.user.linkedin,
            portfolio: data.user.portfolio,
            about: data.user.about,
            location: data.user.location,
            skills: data.user.skills || [],
          });
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch user data. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const goToSkillsQuiz = () => {
    navigate("/user-dashboard/skills-quiz");
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkillToggle = (skill: string) => {
    setEditFormData(prev => {
      const currentSkills = prev.skills || [];
      const newSkills = currentSkills.includes(skill)
        ? currentSkills.filter(s => s !== skill)
        : [...currentSkills, skill];
      return { ...prev, skills: newSkills };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setIsLoading(true);
      const response = await fetch("https://eshielded.itshivam.in/api/auth/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editFormData),
      });

      const data = await response.json();
      if (data.user) {
        setUserData(data.user);
        setIsEditModalOpen(false);
        toast({
          title: "Success",
          description: "Profile updated successfully!",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-800">My Profile</h1>
        <Button
          variant="outline"
          onClick={() => setIsEditModalOpen(true)}
          disabled={isLoading}
        >
          <Edit2 className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      {/* Edit Profile Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto scrollbar-hide">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit2 className="h-5 w-5" />
              Edit Profile
            </DialogTitle>
            <DialogDescription>
              Update your profile information below. Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={editFormData.name || ""}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile">Phone Number</Label>
                <Input
                  id="mobile"
                  name="mobile"
                  value={editFormData.mobile || ""}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Location
                </span>
              </Label>
              <Input
                id="location"
                name="location"
                value={editFormData.location || ""}
                onChange={handleInputChange}
                placeholder="Enter your location"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="github">
                  <span className="flex items-center gap-1">
                    <Github className="h-4 w-4" />
                    GitHub Profile
                  </span>
                </Label>
                <Input
                  id="github"
                  name="github"
                  value={editFormData.github || ""}
                  onChange={handleInputChange}
                  placeholder="https://github.com/username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">
                  <span className="flex items-center gap-1">
                    <Linkedin className="h-4 w-4" />
                    LinkedIn Profile
                  </span>
                </Label>
                <Input
                  id="linkedin"
                  name="linkedin"
                  value={editFormData.linkedin || ""}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="portfolio">
                <span className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  Portfolio Website
                </span>
              </Label>
              <Input
                id="portfolio"
                name="portfolio"
                value={editFormData.portfolio || ""}
                onChange={handleInputChange}
                placeholder="https://yourportfolio.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="about">About Me</Label>
              <Textarea
                id="about"
                name="about"
                value={editFormData.about || ""}
                onChange={handleInputChange}
                rows={4}
                placeholder="Tell us about yourself, your skills, and experience..."
                className="min-h-[120px]"
              />
            </div>

            {/* Skills Section */}
            <div className="space-y-4 pt-4 border-t">
              <div>
                <Label>Your Skills</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {editFormData.skills?.length ? (
                    editFormData.skills.map(skill => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="flex items-center gap-1 cursor-pointer"
                        onClick={() => handleSkillToggle(skill)}
                      >
                        {skill}
                        <X className="h-3 w-3" />
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No skills selected</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Add Skills</Label>
                <Popover open={skillsSearchOpen} onOpenChange={setSkillsSearchOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={skillsSearchOpen}
                      className="w-full justify-between"
                    >
                      Search skills...
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <Command>
                      <CommandInput placeholder="Search skills..." />
                      <CommandEmpty>No skill found.</CommandEmpty>
                      <CommandGroup className="max-h-[300px] overflow-y-auto">
                        {allSkills.map(skill => (
                          <CommandItem
                            key={skill}
                            value={skill}
                            onSelect={() => {
                              handleSkillToggle(skill);
                              setSkillsSearchOpen(false);
                            }}
                          >
                            <CheckCircle
                              className={`mr-2 h-4 w-4 ${editFormData.skills?.includes(skill)
                                  ? "opacity-100 text-green-500"
                                  : "opacity-0"
                                }`}
                            />
                            {skill}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToSkillsQuiz}
                  className="flex items-center gap-2"
                >
                  <Award className="h-4 w-4" />
                  Verify Your Skills
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Profile Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Sidebar */}
        <Card className="glass-card md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                {userData && userData.company_logo ? (
                  <AvatarImage src={userData.company_logo} alt={userData.name} />
                ) : (
                  <AvatarFallback className="bg-purple-100 text-purple-700 text-xl font-medium">
                    {userData && userData.name ? getInitials(userData.name) : "N/A"}
                  </AvatarFallback>
                )}
              </Avatar>
              <h2 className="text-xl font-bold">
                {userData && userData.name ? userData.name : "Complete your profile"}
              </h2>
              <p className="text-muted-foreground">
                {userData
                  ? userData.role === "candidate"
                    ? "Developer"
                    : userData.role === "recruiter"
                      ? "Recruiter"
                      : "Admin"
                  : "N/A"}
              </p>
              <div className="flex items-center mt-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{userData && userData.location ? userData.location : "N/A"}</span>
              </div>
              <div className="w-full mt-6 space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {userData && userData.email ? userData.email : "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {userData && userData.mobile ? userData.mobile : "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Github className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {userData && userData.github ? userData.github : "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {userData && userData.linkedin ? userData.linkedin : "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {userData && userData.portfolio ? userData.portfolio : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Profile Details */}
        <div className="md:col-span-2 space-y-6">
          {/* About Me */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>About Me</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                {userData && userData.about
                  ? userData.about
                  : "Complete your profile to let others know more about you."}
              </p>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Skills</CardTitle>
              <Button variant="outline" size="sm" onClick={goToSkillsQuiz}>
                <Award className="h-4 w-4 mr-2" />
                Verify Skills
              </Button>
            </CardHeader>
            <CardContent>
              {userData && userData.skills && userData.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {userData.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className={
                        userData.skills && userData.skills.includes(skill)
                          ? "bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
                          : "bg-purple-50 text-purple-700 border-purple-200"
                      }
                    >
                      {userData.skills && userData.skills.includes(skill) && (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      )}
                      {skill}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No skills added. Complete your profile.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;