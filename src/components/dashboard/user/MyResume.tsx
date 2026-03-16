import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Upload,
  Download,
  CheckCircle,
  Award,
  Code,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import extractTextFromPDF from "pdf-parser-client-side";

// Define the user type (matching your es_users table)
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

const MyResume: React.FC = () => {
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileURL, setFileURL] = useState<string | null>(null);
  const [pdfText, setPdfText] = useState("");
  const [resumeAnalysis, setResumeAnalysis] = useState<string | null>(null);
  const [isAtsFriendly, setIsAtsFriendly] = useState<boolean | null>(null);
  const [strengths, setStrengths] = useState<string[]>([]);
  const [weaknesses, setWeaknesses] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);

  // Fetch current user info from /api/auth/me
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("https://eshielded.itshivam.in/api/auth/me", {
      // Adjust the URL as needed
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch((error) => console.error("Error fetching user info:", error));
  }, []);

  // Extract text from PDF using pdf-parser-client-side
  const extractTextFromFile = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const data = await pdfParse(arrayBuffer);
    return data.text;
  };

  // Call Gemini API to analyze the resume
  const analyzeResumeWithGemini = async (resumeText: string) => {
    const apiKey = "AIzaSyBwQEB9K1qrOG0AWlLjIJmDV1JwkB0Tbdw";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const prompt = `
Please analyze the following resume and provide the following information in this strict format:

ATS-Friendly: <Yes/No>

Strengths:
* <Strength 1>
* <Strength 2>
* <Strength 3>

Weaknesses:
* <Weakness 1>
* <Weakness 2>
* <Weakness 3>

Skills:
<Comma-separated list of skills>

Only include the analysis results in the response, no extra text or greetings.

--- Resume Start ---
${resumeText}
--- Resume End ---
`;
    const requestBody = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    };

    const response = await axios.post(apiUrl, requestBody, {
      headers: { "Content-Type": "application/json" },
    });
    const data = response.data;
    const analysisResults = data.candidates[0]?.content?.parts[0]?.text || "";
    return { analysisResults };
  };

  // Post the extracted skills to update-user-skills API using the current user's id
  const updateUserSkills = async (skills: string[]) => {
    if (!currentUser) {
      console.error("No current user available");
      return;
    }
    try {
      const response = await axios.put(
        "https://eshielded.itshivam.me/api/user/update-user-skills",
        {
          user_id: currentUser.id,
          skills,
        },
      );
      console.log("User skills updated:", response.data);
    } catch (error) {
      console.error("Error updating user skills:", error);
    }
  };

  // Parse analysis results and update state; then post skills to DB
  function parseAnalysis(obj: { analysisResults: string }) {
    const analysisText = obj.analysisResults;
    const lines = analysisText
      .trim()
      .split("\n")
      .map((line) => line.trim());

    // ATS-Friendly determination
    const atsLine = lines.find((line) => line.startsWith("ATS-Friendly:"));
    const atsResult = atsLine?.includes("Yes") ?? false;

    const strengths: string[] = [];
    const weaknesses: string[] = [];
    let skills: string[] = [];

    let currentSection: "strengths" | "weaknesses" | "skills" | null = null;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line === "Strengths:") {
        currentSection = "strengths";
      } else if (line === "Weaknesses:") {
        currentSection = "weaknesses";
      } else if (line.startsWith("Skills:")) {
        currentSection = "skills";
        const nextLine = lines[i + 1]?.trim();
        if (nextLine) {
          skills = nextLine
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean);
        }
        break;
      } else if (line.startsWith("*")) {
        const content = line.slice(1).trim();
        if (currentSection === "strengths") strengths.push(content);
        else if (currentSection === "weaknesses") weaknesses.push(content);
      }
    }

    setIsAtsFriendly(atsResult);
    setStrengths(strengths);
    setWeaknesses(weaknesses);
    setSkills(skills);

    console.log("ATS-Friendly:", atsResult);
    console.log("Strengths:", strengths);
    console.log("Weaknesses:", weaknesses);
    console.log("Skills:", skills);

    // Post the extracted skills to update-user-skills API
    if (skills.length > 0) {
      updateUserSkills(skills);
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setFileURL(URL.createObjectURL(file));
      try {
        // Using pdfParse from our helper below
        const text = await extractTextFromPDF(
          file,
          "alphanumericwithspaceandpunctuation",
        );
        if (text) {
          setPdfText(text);
          const analysisResultRes = await analyzeResumeWithGemini(text);
          if (analysisResultRes) {
            setResumeAnalysis(analysisResultRes.analysisResults);
            parseAnalysis(analysisResultRes);
          } else {
            console.error("Analysis result is undefined");
          }
        } else {
          console.error("Failed to extract text from PDF");
        }
      } catch (error) {
        console.error("Error extracting text from PDF:", error);
      }
    }
  };

  const goToSkillsQuiz = () => {
    navigate("/user-dashboard/skills-quiz");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-800">My Resume</h1>
        <div className="flex gap-2">
          <label htmlFor="resume-upload">
            <input
              id="resume-upload"
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={handleUpload}
            />
            <Button variant="outline" asChild>
              <span>
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </span>
            </Button>
          </label>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="analyze">Analysis</TabsTrigger>
        </TabsList>
        <TabsContent value="preview" className="py-4">
          <Card className="glass-card">
            <CardContent className="py-4">
              {uploadedFile && fileURL ? (
                <div className="w-full h-[800px]">
                  <iframe
                    src={fileURL}
                    title="Uploaded Resume"
                    className="w-full h-full border rounded"
                  />
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <p>No resume uploaded. Upload one to preview it here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="edit" className="py-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Resume Editor</CardTitle>
              <CardDescription>
                Edit your resume information below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Resume editor coming soon. In the future, you'll be able to
                  directly edit your resume here.
                </p>
                <Button variant="outline" disabled>
                  Edit Resume
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analyze" className="py-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>AI Resume Analysis</CardTitle>
              <CardDescription>
                Get insights and suggestions to improve your resume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {isAtsFriendly !== null && (
                  <div
                    className={`flex items-center gap-2 p-3 rounded-lg ${
                      isAtsFriendly
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">
                      {isAtsFriendly
                        ? "Your resume is ATS-friendly"
                        : "Your resume is not ATS-friendly"}
                    </span>
                  </div>
                )}
                <div className="space-y-4">
                  {strengths.length > 0 && (
                    <div>
                      <h4 className="font-medium text-purple-700">Strengths</h4>
                      <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                        {strengths.map((item, idx) => (
                          <li key={`strength-${idx}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {weaknesses.length > 0 && (
                    <div>
                      <h4 className="font-medium text-purple-700">
                        Suggestions
                      </h4>
                      <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                        {weaknesses.map((item, idx) => (
                          <li key={`weakness-${idx}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                {skills.length > 0 && (
                  <div className="border-t border-purple-100 pt-4">
                    <h4 className="font-medium text-purple-700 mb-2">
                      Skills Verification
                    </h4>
                    <p className="text-sm mb-3">
                      Verify your skills through quizzes to increase your
                      credibility to recruiters.
                    </p>
                    <Button onClick={goToSkillsQuiz} className="mb-4">
                      <Award className="h-4 w-4 mr-2" />
                      Take Skills Quiz
                    </Button>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, idx) => (
                        <span
                          key={`skill-${idx}`}
                          className="bg-purple-50 text-purple-800 text-sm px-3 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyResume;

async function pdfParse(arrayBuffer: ArrayBuffer): Promise<{ text: string }> {
  const textDecoder = new TextDecoder();
  const text = textDecoder.decode(arrayBuffer);
  return { text };
}
