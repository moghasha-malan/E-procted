import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Award,
  AlertCircle,
  Clock,
  Maximize,
  Minimize,
  ArrowRight,
  Check,
  X,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  skills: string[] | null;
  // ...other fields if needed
}

const SkillsQuiz: React.FC = () => {
  const navigate = useNavigate();
  const quizContainerRef = useRef<HTMLDivElement>(null);

  // Quiz states
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // Will be updated based on number of questions
  const [isTimeRunning, setIsTimeRunning] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [isAssessmentLoading, setIsAssessmentLoading] = useState(true);

  // User skills fetched from the "me" API
  const [userSkills, setUserSkills] = useState<string[]>([]);
  // Current user info fetched from "me" API
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);

  // Fetch current user's info from the me API
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("https://eshielded.itshivam.in/api/auth/me", {
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
          // If user.skills is available, use them; otherwise, default to an empty array.
          setUserSkills(data.user.skills || []);
        }
      })
      .catch((error) => console.error("Error fetching user info:", error));
  }, []);

  // Generate skill-based questions once userSkills are fetched
  useEffect(() => {
    if (userSkills.length > 0) {
      generateSkillBasedQuestions(userSkills);
    } else {
      console.log("No user skills found; using default questions.");
      setQuestions(defaultQuestions);
      setIsAssessmentLoading(false);
    }
  }, [userSkills]);

  // Adjust timer based on number of questions (e.g., 60 seconds per question)
  useEffect(() => {
    if (questions.length > 0) {
      setTimeLeft(questions.length * 60);
    }
  }, [questions]);

  // Timer effect
  useEffect(() => {
    if (timeLeft === 0) {
      handleAnswer();
    }
    if (isTimeRunning && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isTimeRunning]);

  const startAssessment = () => {
    setShowInstructions(false);
    setIsTimeRunning(true);
  };

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const handleAnswer = () => {
    if (selectedOption === null) {
      toast({
        title: "Please select an answer.",
        variant: "destructive",
      });
      return;
    }
    if (selectedOption === questions[currentQuestion].correctAnswer) {
      setScore((prev) => prev + 1);
      toast({
        title: "Correct!",
        description: "You got it right.",
      });
    } else {
      toast({
        title: "Incorrect",
        description: `The correct answer was ${questions[currentQuestion].options[questions[currentQuestion].correctAnswer]}.`,
        variant: "destructive",
      });
    }
    setSelectedOption(null);
    setTimeLeft(60);
    setIsTimeRunning(true);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setQuizCompleted(true);
      setIsTimeRunning(false);
      exitFullScreen();
      submitSkillQuiz();
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setScore(0);
    setQuizCompleted(false);
    setTimeLeft(questions.length * 60);
    setIsTimeRunning(false);
    setShowInstructions(true);
  };

  const goToDashboard = () => {
    if (isFullScreen) exitFullScreen();
    navigate("/user-dashboard");
  };

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      enterFullScreen();
    } else {
      exitFullScreen();
    }
  };

  const enterFullScreen = () => {
    setIsFullScreen(true);
    if (quizContainerRef.current?.requestFullscreen) {
      quizContainerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error enabling full-screen mode: ${err.message}`);
      });
    }
  };

  const exitFullScreen = () => {
    setIsFullScreen(false);
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch((err) => {
        console.error(`Error exiting full-screen mode: ${err.message}`);
      });
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
  }, []);

  // Generate questions based on user skills (or default questions)
  const generateSkillBasedQuestions = async (skills: string[]) => {
    const prompt = `
Generate 20 practical multiple choice questions based on these skills: ${skills.join(
      ", ",
    )}. Each question should have 4 options and the correct answer index (0-3).
Format:

Question: <text>
Options: A. <opt1>, B. <opt2>, C. <opt3>, D. <opt4>
Answer: <correct option index>
`;
    const apiKey = "AIzaSyBwQEB9K1qrOG0AWlLjIJmDV1JwkB0Tbdw";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const requestBody = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    };

    try {
      const res = await axios.post(apiUrl, requestBody, {
        headers: { "Content-Type": "application/json" },
      });
      const resultText = res.data.candidates[0]?.content?.parts[0]?.text;
      const parsed = parseGeminiQuestions(resultText);
      setQuestions(parsed);
      setIsAssessmentLoading(false);
    } catch (err) {
      console.error("Failed to fetch questions", err);
      // Fallback to default questions if API fails
      setQuestions(defaultQuestions);
      setIsAssessmentLoading(false);
    }
  };

  // Parse Gemini API response into Question objects
  const parseGeminiQuestions = (text: string): Question[] => {
    const questionBlocks = text.split("Question: ").slice(1);
    return questionBlocks.map((block, idx) => {
      const [questionText, rest] = block.split("Options:");
      const [optionsLine, answerLine] = rest.split("Answer:");
      const options = optionsLine
        .trim()
        .split(/[A-D]\.\s/)
        .filter((opt) => opt.trim() !== "");
      const correctAnswer = parseInt(answerLine.trim());
      return {
        id: 100 + idx,
        text: questionText.trim(),
        options,
        correctAnswer,
      };
    });
  };

  // Default questions in case API fails or user skills are not available
  const defaultQuestions: Question[] = [
    {
      id: 1,
      text: "What does HTML stand for?",
      options: [
        "Hyper Text Markup Language",
        "Home Tool Markup Language",
        "Hyperlinks and Text Markup Language",
        "None of the above",
      ],
      correctAnswer: 0,
    },
    // ... add more default questions if needed
  ];

  // Submit quiz results and update resume verification using current user's ID
  const submitSkillQuiz = async () => {
    const token = localStorage.getItem("token");
    if (!token || !currentUser) {
      toast({
        title: "Error",
        description: "You are not authenticated.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(
        "https://eshielded.itshivam.me/api/user/update-user-resume",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: currentUser.id,
            resumeVerified: true,
          }),
        },
      );

      if (response.ok) {
        toast({
          title: "Quiz Completed",
          description:
            "Your quiz results have been submitted, and your resume has been verified.",
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description:
            errorData.message || "Failed to update resume verification.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting quiz results:", error);
      toast({
        title: "Error",
        description: "An error occurred while submitting your quiz results.",
        variant: "destructive",
      });
    }
  };

  // If assessment is still loading, show a loading message
  if (isAssessmentLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-semibold">Creating Assessment...</p>
      </div>
    );
  }

  return (
    <div
      ref={quizContainerRef}
      className={`${
        isFullScreen
          ? "fixed inset-0 w-screen h-screen bg-white p-4 z-50 overflow-auto flex flex-col"
          : "container mx-auto mt-8"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-purple-800">Skills Quiz</h1>
        <Button variant="outline" size="sm" onClick={toggleFullScreen}>
          {isFullScreen ? (
            <Minimize className="h-4 w-4" />
          ) : (
            <Maximize className="h-4 w-4" />
          )}
        </Button>
      </div>

      {quizCompleted ? (
        <Card
          className={`${isFullScreen ? "w-full max-w-2xl mx-auto my-auto" : "w-full max-w-md mx-auto"}`}
        >
          <CardHeader>
            <CardTitle>Quiz Completed!</CardTitle>
            <CardDescription>Your results are in.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <p>
              You scored {score} out of {questions.length}
            </p>
            <Progress value={(score / questions.length) * 100} />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={resetQuiz}>
              Retry Quiz
            </Button>
            <Button onClick={goToDashboard}>Go to Dashboard</Button>
          </CardFooter>
        </Card>
      ) : showInstructions ? (
        <Card
          className={`${isFullScreen ? "w-full max-w-4xl mx-auto my-auto" : "w-full max-w-lg mx-auto"}`}
        >
          <CardHeader>
            <CardTitle>Assessment Instructions</CardTitle>
            <CardDescription>
              Please read the instructions carefully before starting.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Clock className="h-5 w-5 mt-0.5 text-primary" />
                <div>
                  <h4 className="font-medium">Time Limit</h4>
                  <p className="text-sm text-muted-foreground">
                    You have {timeLeft} seconds in total for the quiz. The timer
                    starts when you begin.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <AlertCircle className="h-5 w-5 mt-0.5 text-primary" />
                <div>
                  <h4 className="font-medium">Answer Selection</h4>
                  <p className="text-sm text-muted-foreground">
                    Select one answer per question. You cannot change your
                    answer after submission.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Award className="h-5 w-5 mt-0.5 text-primary" />
                <div>
                  <h4 className="font-medium">Scoring</h4>
                  <p className="text-sm text-muted-foreground">
                    Each correct answer gives you 1 point. There is no penalty
                    for wrong answers.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={goToDashboard}>
              <ArrowRight className="mr-2 h-4 w-4" />
              Skip Assessment
            </Button>
            <Button onClick={startAssessment}>Start Assessment Now</Button>
          </CardFooter>
        </Card>
      ) : (
        <Card
          className={`${isFullScreen ? "w-full max-w-4xl mx-auto my-auto" : "w-full max-w-lg mx-auto"}`}
        >
          <CardHeader>
            <CardTitle>Skills Quiz</CardTitle>
            <CardDescription>
              Answer the following questions to test your knowledge.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex justify-between items-center">
              <span>
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <Badge variant="secondary">
                <Clock className="mr-2 h-4 w-4" />
                {timeLeft} seconds
              </Badge>
            </div>
            <CardDescription>{questions[currentQuestion].text}</CardDescription>
            <div className="grid gap-2">
              {questions[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`justify-start ${
                    selectedOption === index
                      ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      : ""
                  }`}
                  onClick={() => handleOptionSelect(index)}
                  disabled={selectedOption !== null}
                >
                  {option}
                </Button>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="secondary" onClick={goToDashboard}>
              <ArrowRight className="mr-2 h-4 w-4" />
              Skip Quiz
            </Button>
            <Button onClick={handleAnswer} disabled={selectedOption === null}>
              Submit Answer
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default SkillsQuiz;

async function pdfParse(arrayBuffer: ArrayBuffer): Promise<{ text: string }> {
  const textDecoder = new TextDecoder();
  const text = textDecoder.decode(arrayBuffer);
  return { text };
}
