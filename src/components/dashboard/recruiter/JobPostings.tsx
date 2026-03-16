"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Plus,
  X,
  Users,
  Clock,
  Edit,
  Trash2,
  MoreVertical,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type Job = {
  id: number;
  job_title: string;
  department: string;
  location: string;
  vacancy: number;
  status: "Active" | "Draft" | "Closed";
  skills: string[];
  created_at: string;
};

export default function JobPostings() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [department, setdepartment] = useState("");
  const [location, setLocation] = useState("");
  const [vacancy, setVacancy] = useState("");
  const [status, setStatus] = useState<"Active" | "Draft" | "Closed">("Active");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Fetch all jobs
  const fetchJobs = async () => {
    setLoadingJobs(true);
    try {
      const res = await fetch("https://eshielded.itshivam.me/api/job/list");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setJobs(data.jobs);
    } catch (err: any) {
      toast.error("Failed to load jobs: " + err.message);
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Create
  const handleCreate = async () => {
    if (!jobTitle || !department || !location || !vacancy || skills.length === 0) {
      toast.error("Fill all fields + add ≥1 skill");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("https://eshielded.itshivam.me/api/job/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          job_title: jobTitle,
          department,
          location,
          vacancy: parseInt(vacancy),
          status,
          skills,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Created!");
      // reset + refetch
      setShowForm(false);
      setJobTitle("");
      setdepartment("");
      setLocation("");
      setVacancy("");
      setStatus("Active");
      setSkills([]);
      fetchJobs();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this job?")) return;
    try {
      const res = await fetch(`https://eshielded.itshivam.me/api/job/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Deleted!");
      setJobs((j) => j.filter((x) => x.id !== id));
    } catch (err: any) {
      toast.error("Delete failed: " + err.message);
    }
  };

  // skill tag helpers
  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) {
      setSkills((arr) => [...arr, s]);
      setSkillInput("");
    }
  };
  const removeSkill = (s: string) => setSkills((arr) => arr.filter((x) => x !== s));

  // Filter helpers
  const byStatus = (st: string) => jobs.filter((j) => j.status === st);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-purple-800">Job Postings</h1>
        <Button onClick={() => setShowForm((v) => !v)}>
          {showForm ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
          {showForm ? "Cancel" : "Create New Job"}
        </Button>
      </div>

      {/* Inline Create Form */}
      {showForm && (
        <Card className="p-6 border border-purple-200 bg-purple-50/40">
          <CardHeader>
            <CardTitle>New Job</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/** Title */}
            <div>
              <Label>Job Title</Label>
              <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
            </div>
            {/** department */}
            <div>
              <Label>Department</Label>
              <Input value={department} onChange={(e) => setdepartment(e.target.value)} />
            </div>
            {/** Location */}
            <div>
              <Label>Location</Label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            {/** Vacancy */}
            <div>
              <Label>Vacancy</Label>
              <Input
                type="number"
                value={vacancy}
                onChange={(e) => setVacancy(e.target.value)}
              />
            </div>
            {/** Status */}
            <div>
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/** Skills */}
            <div className="col-span-full">
              <Label>Skills</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter & Enter"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addSkill())
                  }
                />
                <Button variant="outline" onClick={addSkill}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((s) => (
                  <Badge key={s} className="flex items-center gap-1">
                    {s}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeSkill(s)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
          <div className="pt-4 flex justify-end">
            <Button disabled={submitting} onClick={handleCreate}>
              {submitting ? "Posting..." : "Submit Job"}
            </Button>
          </div>
        </Card>
      )}

      {/* Tabs & Listings */}
      <Tabs defaultValue="all">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="Active">Active</TabsTrigger>
          <TabsTrigger value="Draft">Draft</TabsTrigger>
          <TabsTrigger value="Closed">Closed</TabsTrigger>
        </TabsList>

        {/** Render a table for each tab */}
        {[
          ["all", jobs],
          ["Active", byStatus("Active")],
          ["Draft", byStatus("Draft")],
          ["Closed", byStatus("Closed")],
        ].map(([tab, list]) => (
          <TabsContent key={tab as string} value={tab as string}>
            <Card className="glass-card">
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-purple-100">
                      {[
                        "Title",
                        "department",
                        "Location",
                        "Vacancy",
                        "Skills",
                        "Status",
                        "Created",
                        "Actions",
                      ].map((h) => (
                        <th key={h} className="px-4 py-3 text-left font-medium">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loadingJobs ? (
                      <tr>
                        <td colSpan={8} className="p-4 text-center">
                          Loading…
                        </td>
                      </tr>
                    ) : list.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-4 text-center text-muted-foreground">
                          No jobs here.
                        </td>
                      </tr>
                    ) : (
                      (list as Job[]).map((j) => (
                        <tr
                          key={j.id}
                          className="border-b border-purple-100 hover:bg-purple-50/30"
                        >
                          <td className="px-4 py-3">{j.job_title}</td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {j.department}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {j.location}
                          </td>
                          <td className="px-4 py-3">{j.vacancy}</td>
                          <td className="px-4 py-3">
                            {j.skills.join(", ")}
                          </td>
                          <td className="px-4 py-3">
                            <Badge
                              className={
                                j.status === "Active"
                                  ? "bg-green-600"
                                  : j.status === "Draft"
                                  ? "bg-yellow-600"
                                  : "bg-red-600"
                              }
                            >
                              {j.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {new Date(j.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => handleDelete(j.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
