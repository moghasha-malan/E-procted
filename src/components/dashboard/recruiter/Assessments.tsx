import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileCode, Users, Clock, MoreVertical, Copy, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateAssessmentDialog } from "./assessment/CreateAssessmentDialog";

interface Assessment {
  id: number;
  title: string;
  description: string;
  type: string;
  duration: number;
  questions: number;
  assigned: number;
  completed: number;
  createdAt: string;
}

const Assessments: React.FC = () => {
  const initialAssessments: Assessment[] = [
    {
      id: 1,
      title: "Frontend Developer Technical Test",
      description: "React, JavaScript, and CSS assessment for frontend roles",
      type: "Coding",
      duration: 90,
      questions: 12,
      assigned: 24,
      completed: 18,
      createdAt: "2025-02-10",
    },
    {
      id: 2,
      title: "UI/UX Design Challenge",
      description: "Design a mobile app interface based on requirements",
      type: "Design",
      duration: 120,
      questions: 3,
      assigned: 15,
      completed: 12,
      createdAt: "2025-02-15",
    },
    {
      id: 3,
      title: "Backend Developer Assessment",
      description: "Node.js, Express, and database design challenge",
      type: "Coding",
      duration: 120,
      questions: 10,
      assigned: 18,
      completed: 14,
      createdAt: "2025-02-20",
    },
    {
      id: 4,
      title: "Project Management Skills",
      description: "Assessment of project management methodologies and problem-solving",
      type: "Multiple Choice",
      duration: 60,
      questions: 30,
      assigned: 8,
      completed: 8,
      createdAt: "2025-03-01",
    },
    {
      id: 5,
      title: "DevOps Technical Assessment",
      description: "CI/CD, Docker, and cloud infrastructure knowledge test",
      type: "Coding",
      duration: 90,
      questions: 15,
      assigned: 5,
      completed: 3,
      createdAt: "2025-03-15",
    },
  ];

  const [assessments, setAssessments] = useState<Assessment[]>(initialAssessments);

  const handleAssessmentCreated = (newAssessment: Omit<Assessment, 'id' | 'createdAt' | 'assigned' | 'completed'>) => {
    const assessmentWithId: Assessment = {
      ...newAssessment,
      id: Math.max(...assessments.map(a => a.id), 0) + 1,
      createdAt: new Date().toISOString().split('T')[0],
      assigned: 0,
      completed: 0
    };
    setAssessments([...assessments, assessmentWithId]);
  };

  const handleDeleteAssessment = (id: number) => {
    setAssessments(assessments.filter(assessment => assessment.id !== id));
  };

  const renderAssessmentCards = (filteredAssessments: Assessment[]) => {
    return filteredAssessments.map((assessment) => (
      <Card key={assessment.id} className="glass-card hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex justify-between">
            <CardTitle className="text-lg">{assessment.title}</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="cursor-pointer">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Users className="h-4 w-4 mr-2" />
                  Assign
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600"
                  onClick={() => handleDeleteAssessment(assessment.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardDescription>{assessment.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                {assessment.type}
              </Badge>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                <Clock className="h-3 w-3 mr-1" />
                {assessment.duration} min
              </Badge>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                {assessment.questions} questions
              </Badge>
            </div>

            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Assigned</span>
                <span className="font-medium">{assessment.assigned}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Completed</span>
                <span className="font-medium">{assessment.completed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Completion Rate</span>
                <span className="font-medium">
                  {assessment.assigned > 0
                    ? `${Math.round((assessment.completed / assessment.assigned) * 100)}%`
                    : '0%'}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button variant="outline" size="sm">
                <Users className="h-4 w-4 mr-1" />
                Assign
              </Button>
              <Button size="sm">
                <FileCode className="h-4 w-4 mr-1" />
                View
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-purple-800">Assessments</h1>
          <p className="text-muted-foreground">Create and manage technical assessments for job candidates</p>
        </div>
        <CreateAssessmentDialog onAssessmentCreated={handleAssessmentCreated} />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="coding">Coding</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="quiz">Quiz</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderAssessmentCards(assessments)}
          </div>
        </TabsContent>

        <TabsContent value="coding" className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderAssessmentCards(assessments.filter(a => a.type === "Coding"))}
          </div>
        </TabsContent>

        <TabsContent value="design" className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderAssessmentCards(assessments.filter(a => a.type === "Design"))}
          </div>
        </TabsContent>

        <TabsContent value="quiz" className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderAssessmentCards(assessments.filter(a => a.type === "Multiple Choice"))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Assessments;