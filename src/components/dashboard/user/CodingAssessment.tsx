import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  Clock,
  Code,
  Play,
  Save,
  Terminal,
  ChevronRight,
  AlertCircle,
  Lock,
  Maximize,
  Minimize,
  Award,
  Camera,
  MonitorUp,
  AlertTriangle,
  X,
  Check,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import CodeMirror from "@uiw/react-codemirror";
import axios from "axios";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { EditorView } from "@codemirror/view";

const CodingAssessment: React.FC = () => {
  // Existing states
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [isLoading, setIsLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [remainingTime, setRemainingTime] = useState(45 * 60); // 45 minutes in seconds
  const [remainingAttempts, setRemainingAttempts] = useState(3);
  const [completedQuestions, setCompletedQuestions] = useState<number[]>([]);
  const [tab, setTab] = useState("code");
  const [showInstructions, setShowInstructions] = useState(true); // New state for instructions
  const [isTimeRunning, setIsTimeRunning] = useState(false); // Timer starts paused
  const [rewrittenQuestions, setRewrittenQuestions] = useState<
    Record<string, { title: string; description: string }>
  >({});

  // New states for camera and screen sharing
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<{
    camera: "pending" | "granted" | "denied";
    screen: "pending" | "granted" | "denied";
    fullscreen: "pending" | "granted" | "denied";
  }>({
    camera: "pending",
    screen: "pending",
    fullscreen: "pending",
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const [proctoringActive, setProctoringActive] = useState(true);
  const [showProctoringAlert, setShowProctoringAlert] = useState(false);

  const checkProctoringStatus = () => {
    const cameraActive =
      cameraStream &&
      cameraStream.active &&
      cameraStream.getTracks().some((track) => track.readyState === "live");
    const screenActive =
      screenStream &&
      screenStream.active &&
      screenStream.getTracks().some((track) => track.readyState === "live");

    // Removed isFullScreen check
    return cameraActive && screenActive;
  };

  // Monitor proctoring status continuously
  useEffect(() => {
    if (showInstructions) return; // Only monitor when assessment is active

    const intervalId = setInterval(() => {
      const isActive = checkProctoringStatus();
      setProctoringActive(isActive);

      if (!isActive && !showProctoringAlert) {
        setShowProctoringAlert(true);
      }
    }, 2000);
    return () => clearInterval(intervalId);
  }, [cameraStream, screenStream, isFullScreen, showInstructions]);

  // Add event listeners for stream ending
  useEffect(() => {
    if (!screenStream) return;

    const handleScreenEnd = () => {
      console.log("Screen sharing ended");
      setShowProctoringAlert(true);
      setProctoringActive(false);
    };

    screenStream.getVideoTracks().forEach((track) => {
      track.addEventListener("ended", handleScreenEnd);
    });

    return () => {
      screenStream.getVideoTracks().forEach((track) => {
        track.removeEventListener("ended", handleScreenEnd);
      });
    };
  }, [screenStream]);

  // Updated request camera access
  const requestCameraAccess = async (): Promise<boolean> => {
    try {
      // Stop any existing stream first
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }

      setPermissionStatus((prev) => ({ ...prev, camera: "pending" }));
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false, // We only need video for proctoring
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setPermissionStatus((prev) => ({ ...prev, camera: "granted" }));
      return true;
    } catch (error) {
      console.error("Camera access error:", error);
      setPermissionError(
        "Camera access denied. Please enable your camera to continue.",
      );
      setPermissionStatus((prev) => ({ ...prev, camera: "denied" }));
      return false;
    }
  };

  // Updated request screen sharing
  const requestScreenSharing = async (): Promise<boolean> => {
    try {
      // Stop any existing stream first
      if (screenStream) {
        screenStream.getTracks().forEach((track) => track.stop());
      }

      setPermissionStatus((prev) => ({ ...prev, screen: "pending" }));
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: "monitor", // Prefer full monitor capture
        },
      });
      setScreenStream(stream);

      stream.getVideoTracks()[0].addEventListener("ended", () => {
        setShowProctoringAlert(true);
        setProctoringActive(false);
      });

      setPermissionStatus((prev) => ({ ...prev, screen: "granted" }));
      return true;
    } catch (error) {
      console.error("Screen sharing error:", error);
      setPermissionError(
        "Screen sharing denied. Please share your screen to continue.",
      );
      setPermissionStatus((prev) => ({ ...prev, screen: "denied" }));
      return false;
    }
  };

  // Restore proctoring function
  const restoreProctoring = async () => {
    let restoredCamera = true;
    let restoredScreen = true;

    if (
      !cameraStream ||
      !cameraStream.active ||
      !cameraStream.getTracks().some((track) => track.readyState === "live")
    ) {
      restoredCamera = await requestCameraAccess();
    }

    if (
      !screenStream ||
      !screenStream.active ||
      !screenStream.getTracks().some((track) => track.readyState === "live")
    ) {
      restoredScreen = await requestScreenSharing();
    }

    if (restoredCamera && restoredScreen && document.fullscreenElement) {
      setShowProctoringAlert(false);
      setProctoringActive(true);
    }
  };

  interface Question {
    id: number;
    title: string;
    difficulty: string;
    timeLimit: number;
    description: string;
    example: {
      input: string;
      output: string;
    };
    constraints: string[];
    testInput: string;
    expectedOutput: string;
    solutionPattern: string;
  }

  const [selectedQuestion, setSelectedQuestion] = useState<Question>(
    codingQuestions[0],
  ); // initially first question
  const [currentIndex, setCurrentIndex] = useState(0);

  // Rewrites the question in a storytelling format (existing function)
  const rewriteQuestionWithGemini = async (question: Question) => {
    const apiKey = "AIzaSyBwQEB9K1qrOG0AWlLjIJmDV1JwkB0Tbdw";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    if (rewrittenQuestions[question.id]) return; // Skip if already rewritten

    const prompt = `
Rewrite the following coding question with a fresh and engaging story/context, keeping the core problem intact.

Title: ${question.title}
Description: ${question.description}

Return it in this format:

Title: <rewritten title>
Description: <rewritten description>
`;

    const requestBody = {
      contents: [{ parts: [{ text: prompt }] }],
    };

    try {
      const response = await axios.post(apiUrl, requestBody, {
        headers: { "Content-Type": "application/json" },
      });
      const text =
        response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";

      const titleMatch = text.match(/Title:\s*(.*)/);
      const descriptionMatch = text.match(/Description:\s*([\s\S]*)/);

      if (titleMatch && descriptionMatch) {
        setRewrittenQuestions((prev) => ({
          ...prev,
          [question.id]: {
            title: titleMatch[1].trim(),
            description: descriptionMatch[1].trim(),
          },
        }));
      }
    } catch (err) {
      console.error("Gemini rewrite failed:", err);
    }
  };

  const languageExtensions: Record<string, any> = {
    javascript,
    python,
    cpp,
    java,
  };

  const getFileExtension = (lang: string) => {
    const map: Record<string, string> = {
      javascript: "js",
      python: "py",
      java: "java",
      cpp: "cpp",
      html: "html",
    };
    return map[lang.toLowerCase()] || "txt";
  };

  useEffect(() => {
    // Rewrite the first question on load
    rewriteQuestionWithGemini(codingQuestions[0]);
  }, []);

  useEffect(() => {
    // Prefetch the next question whenever selected changes
    const next = currentIndex + 1;
    if (codingQuestions[next]) {
      rewriteQuestionWithGemini(codingQuestions[next]);
    }
  }, [selectedQuestion]);

  // Initialize code with template based on selected language
  useEffect(() => {
    setCode(getCodeTemplate(language, selectedQuestion));
  }, [language, selectedQuestion]);

  // Timer effect
  useEffect(() => {
    if (!isTimeRunning) return;

    const timer = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          toast({
            title: "Time's up!",
            description: "Your assessment time has ended.",
            variant: "destructive",
          });
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimeRunning]);

  // Clean up media streams when component unmounts
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
      if (screenStream) {
        screenStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream, screenStream]);

  // Updated start assessment function to check permissions sequentially
  const startAssessment = async () => {
    setPermissionError(null);

    // Step 2: Request camera access
    const cameraGranted = await requestCameraAccess();
    if (!cameraGranted) {
      setPermissionStatus((prev) => ({ ...prev, fullscreen: "denied" }));
      return;
    }

    // Step 3: Request screen sharing
    const screenGranted = await requestScreenSharing();
    if (!screenGranted) {
      // Clean up camera and exit fullscreen if screen sharing denied
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
        setCameraStream(null);
      }
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullScreen(false);
      setPermissionStatus((prev) => ({ ...prev, fullscreen: "denied" }));
      return;
    }

    // All permissions granted, start the assessment
    setShowInstructions(false);
    setIsTimeRunning(true);
  };

  // Format time remaining
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Run code
  const runCode = async () => {
    setIsLoading(true);
    setOutput("");
    try {
      const response = await axios.request({
        method: "POST",
        url: "https://onecompiler-apis.p.rapidapi.com/api/v1/run",
        headers: {
          "x-rapidapi-key":
            "a136b8f2e9msh694f370060481b7p1d5124jsn320a635f6bd2",
          "x-rapidapi-host": "onecompiler-apis.p.rapidapi.com",
          "Content-Type": "application/json",
        },
        data: {
          language: language,
          stdin: "",
          files: [
            {
              name: `index.${getFileExtension(language)}`,
              content: code,
            },
          ],
        },
      });

      setOutput(response.data.stdout || "No output returned.");

      setTimeout(() => {
        setTab("output");
      }, 1000); // 1 second delay
    } catch (error: any) {
      console.error(error);
      setOutput("Error running the code.");
    } finally {
      setIsLoading(false);
    }
  };

  // Get language ID for Judge0 API
  const getLanguageId = (lang: string) => {
    const ids: Record<string, number> = {
      javascript: 63,
      python: 71,
      java: 62,
      cpp: 54,
    };
    return ids[lang] || 63;
  };

  // Toggle fullscreen mode
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);

    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message}`,
        );
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div
      className={`space-y-6 ${isFullScreen ? "fixed top-0 left-0 w-full h-full z-50 bg-white p-4 overflow-auto" : ""}`}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-800">
          Coding Assessment
        </h1>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formatTime(remainingTime)}</span>
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Terminal className="h-3 w-3" />
            <span>{remainingAttempts} attempts left</span>
          </Badge>
          <Button variant="outline" size="sm" onClick={toggleFullScreen}>
            {isFullScreen ? (
              <Minimize className="h-4 w-4" />
            ) : (
              <Maximize className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {showInstructions ? (
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Assessment Instructions</CardTitle>
            <CardDescription>
              Please read the instructions carefully before starting.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Clock className="h-5 w-5 mt-0.5 text-primary" />
                <div>
                  <h4 className="font-medium">Time Limit</h4>
                  <p className="text-sm text-muted-foreground">
                    You have {Math.floor(remainingTime / 60)} minutes to
                    complete the assessment. The timer will start when you
                    begin.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <AlertCircle className="h-5 w-5 mt-0.5 text-primary" />
                <div>
                  <h4 className="font-medium">Coding Environment</h4>
                  <p className="text-sm text-muted-foreground">
                    Write your solution in the code editor. You can run your
                    code to test it before submission.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Terminal className="h-5 w-5 mt-0.5 text-primary" />
                <div>
                  <h4 className="font-medium">Attempts</h4>
                  <p className="text-sm text-muted-foreground">
                    You have {remainingAttempts} attempts per question. Use them
                    wisely.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Award className="h-5 w-5 mt-0.5 text-primary" />
                <div>
                  <h4 className="font-medium">Scoring</h4>
                  <p className="text-sm text-muted-foreground">
                    Each question is weighted based on difficulty. Complete as
                    many as you can within the time limit.
                  </p>
                </div>
              </div>

              {/* Proctoring requirements */}
              <div className="flex items-start gap-4">
                <Maximize className="h-5 w-5 mt-0.5 text-primary" />
                <div>
                  <h4 className="font-medium">Full Screen Mode Required</h4>
                  <p className="text-sm text-muted-foreground">
                    The assessment must be completed in full screen mode to
                    prevent switching between applications.
                  </p>
                  <div className="mt-1 flex items-center">
                    <Badge
                      variant={
                        permissionStatus.fullscreen === "granted"
                          ? "default"
                          : "outline"
                      }
                      className={
                        permissionStatus.fullscreen === "granted"
                          ? "bg-green-500"
                          : permissionStatus.fullscreen === "denied"
                            ? "bg-red-500"
                            : ""
                      }
                    >
                      {permissionStatus.fullscreen === "granted" ? (
                        <Check className="h-3 w-3 mr-1" />
                      ) : permissionStatus.fullscreen === "denied" ? (
                        <X className="h-3 w-3 mr-1" />
                      ) : (
                        ""
                      )}
                      {permissionStatus.fullscreen === "granted"
                        ? "Granted"
                        : permissionStatus.fullscreen === "denied"
                          ? "Denied"
                          : "Required"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Camera className="h-5 w-5 mt-0.5 text-primary" />
                <div>
                  <h4 className="font-medium">Camera Access Required</h4>
                  <p className="text-sm text-muted-foreground">
                    Your camera must be enabled during the assessment for
                    proctoring purposes.
                  </p>
                  <div className="mt-1 flex items-center">
                    <Badge
                      variant={
                        permissionStatus.camera === "granted"
                          ? "default"
                          : "outline"
                      }
                      className={
                        permissionStatus.camera === "granted"
                          ? "bg-green-500"
                          : permissionStatus.camera === "denied"
                            ? "bg-red-500"
                            : ""
                      }
                    >
                      {permissionStatus.camera === "granted" ? (
                        <Check className="h-3 w-3 mr-1" />
                      ) : permissionStatus.camera === "denied" ? (
                        <X className="h-3 w-3 mr-1" />
                      ) : (
                        ""
                      )}
                      {permissionStatus.camera === "granted"
                        ? "Granted"
                        : permissionStatus.camera === "denied"
                          ? "Denied"
                          : "Required"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MonitorUp className="h-5 w-5 mt-0.5 text-primary" />
                <div>
                  <h4 className="font-medium">Screen Sharing Required</h4>
                  <p className="text-sm text-muted-foreground">
                    You must share your screen during the assessment for
                    proctoring purposes.
                  </p>
                  <div className="mt-1 flex items-center">
                    <Badge
                      variant={
                        permissionStatus.screen === "granted"
                          ? "default"
                          : "outline"
                      }
                      className={
                        permissionStatus.screen === "granted"
                          ? "bg-green-500"
                          : permissionStatus.screen === "denied"
                            ? "bg-red-500"
                            : ""
                      }
                    >
                      {permissionStatus.screen === "granted" ? (
                        <Check className="h-3 w-3 mr-1" />
                      ) : permissionStatus.screen === "denied" ? (
                        <X className="h-3 w-3 mr-1" />
                      ) : (
                        ""
                      )}
                      {permissionStatus.screen === "granted"
                        ? "Granted"
                        : permissionStatus.screen === "denied"
                          ? "Denied"
                          : "Required"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Error message display */}
            {permissionError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Permission Error</AlertTitle>
                <AlertDescription>{permissionError}</AlertDescription>
              </Alert>
            )}

            {/* Camera preview if enabled */}
            {cameraStream && (
              <div className="border rounded-md overflow-hidden">
                <h4 className="text-sm font-medium p-2 bg-gray-50">
                  Camera Preview
                </h4>
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-[200px] object-cover"
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">
              <ChevronRight className="mr-2 h-4 w-4" />
              Skip Assessment
            </Button>
            <Button
              onClick={startAssessment}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {permissionStatus.camera === "pending" ||
              permissionStatus.screen === "pending" ? (
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full"></div>
              ) : null}
              Start Assessment Now
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Questions sidebar */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Questions</CardTitle>
              <CardDescription>
                Select a coding challenge to solve
              </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                {codingQuestions.map((question) => (
                  <div
                    key={question.id}
                    onClick={() => setSelectedQuestion(question)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                      selectedQuestion.id === question.id
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-medium">
                        {rewrittenQuestions[question.id]?.title ||
                          question.title}
                      </h3>
                      {completedQuestions.includes(question.id) ? (
                        <Badge className="bg-green-500">Completed</Badge>
                      ) : (
                        <Badge variant="outline">{question.difficulty}</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {(
                        rewrittenQuestions[question.id]?.description ||
                        question.description
                      ).substring(0, 60)}
                      ...
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Coding area */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>
                      {rewrittenQuestions[selectedQuestion.id]?.title ||
                        selectedQuestion.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Badge variant="outline">
                        {selectedQuestion.difficulty}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Clock className="h-3 w-3" />
                        <span>{selectedQuestion.timeLimit} min</span>
                      </Badge>
                    </CardDescription>
                  </div>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="cpp">C++</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p>
                    {rewrittenQuestions[selectedQuestion.id]?.description ||
                      selectedQuestion.description}
                  </p>

                  <h4>Example:</h4>
                  <div className="my-2 p-3 bg-gray-50 rounded-md text-sm">
                    <p>
                      <strong>Input:</strong> {selectedQuestion.example.input}
                    </p>
                    <p>
                      <strong>Output:</strong> {selectedQuestion.example.output}
                    </p>
                  </div>

                  <h4>Constraints:</h4>
                  <ul className="list-disc pl-5">
                    {selectedQuestion.constraints.map((constraint, idx) => (
                      <li key={idx}>{constraint}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Solution</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs
                  defaultValue="code"
                  value={tab}
                  className="w-full"
                  onValueChange={(val) => setTab(val)}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="code">Code Editor</TabsTrigger>
                    <TabsTrigger value="output">Output</TabsTrigger>
                  </TabsList>
                  <TabsContent value="code" className="p-0 mt-4">
                    <div className="h-80 overflow-hidden rounded-md border">
                      <CodeMirror
                        value={code}
                        height="100%"
                        extensions={[
                          languageExtensions[language](),
                          EditorView.lineWrapping,
                        ]}
                        onChange={(c) => setCode(c)}
                        className="rounded border border-white/20"
                      />
                    </div>
                  </TabsContent>{" "}
                  <TabsContent value="output" className="p-0 mt-4">
                    <div className="font-mono text-sm bg-gray-900 text-white p-4 rounded-md h-80 overflow-auto">
                      {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="animate-pulse">Compiling...</div>
                        </div>
                      ) : output ? (
                        <pre>{output}</pre>
                      ) : (
                        <div className="text-gray-400 flex flex-col items-center justify-center h-full">
                          <Terminal className="h-6 w-6 mb-2" />
                          <p>Run your code to see output here</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-xs text-muted-foreground">
                  {remainingAttempts === 0 ? (
                    <div className="flex items-center text-red-500">
                      <Lock className="h-3 w-3 mr-1" />
                      <span>No attempts remaining</span>
                    </div>
                  ) : (
                    <span>Type your solution and run to test</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" disabled={isLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    onClick={runCode}
                    disabled={isLoading || remainingAttempts === 0}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isLoading ? (
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full"></div>
                    ) : (
                      <Play className="h-4 w-4 mr-2" />
                    )}
                    Run Code
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}

      {!showInstructions && (
        <div className="fixed bottom-4 right-4 border rounded-md overflow-hidden w-48 shadow-lg bg-white z-50">
          <div className="bg-gray-100 p-1 text-xs font-medium flex justify-between items-center">
            <span>Camera (Proctoring)</span>
            {/* Remove the close button to prevent users from closing the camera view */}
          </div>
          {cameraStream ? (
            <video ref={videoRef} autoPlay muted className="w-full h-auto" />
          ) : (
            <div className="h-36 flex items-center justify-center bg-gray-100">
              <Button size="sm" onClick={requestCameraAccess}>
                Enable Camera
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Sample coding questions
const codingQuestions = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    timeLimit: 15,
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    example: {
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
    },
    constraints: [
      "2 <= nums.length <= 104",
      "-109 <= nums[i] <= 109",
      "-109 <= target <= 109",
      "Only one valid answer exists.",
    ],
    testInput: "[2,7,11,15], 9",
    expectedOutput: "[0,1]",
    solutionPattern: "return [0, 1]",
  },
  {
    id: 2,
    title: "Valid Parentheses",
    difficulty: "Medium",
    timeLimit: 20,
    description:
      "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets. Open brackets must be closed in the correct order. Every close bracket has a corresponding open bracket of the same type.",
    example: {
      input: 's = "()[]{}"',
      output: "true",
    },
    constraints: [
      "1 <= s.length <= 104",
      "s consists of parentheses only '()[]{}'.",
    ],
    testInput: "()[]{}",
    expectedOutput: "true",
    solutionPattern: "return true",
  },
  {
    id: 3,
    title: "Reverse Linked List",
    difficulty: "Medium",
    timeLimit: 25,
    description:
      "Given the head of a singly linked list, reverse the list, and return the reversed list. Implement the solution without modifying the values in the list's nodes (i.e., only nodes themselves may be changed.)",
    example: {
      input: "head = [1,2,3,4,5]",
      output: "[5,4,3,2,1]",
    },
    constraints: [
      "The number of nodes in the list is the range [0, 5000]",
      "-5000 <= Node.val <= 5000",
    ],
    testInput: "[1,2,3,4,5]",
    expectedOutput: "[5,4,3,2,1]",
    solutionPattern: "return prev",
  },
  {
    id: 4,
    title: "Binary Search",
    difficulty: "Easy",
    timeLimit: 15,
    description:
      "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.",
    example: {
      input: "nums = [-1,0,3,5,9,12], target = 9",
      output: "4",
    },
    constraints: [
      "1 <= nums.length <= 104",
      "-104 < nums[i], target < 104",
      "All the integers in nums are unique.",
      "nums is sorted in ascending order.",
    ],
    testInput: "[-1,0,3,5,9,12], 9",
    expectedOutput: "4",
    solutionPattern: "return 4",
  },
  {
    id: 5,
    title: "Maximum Subarray",
    difficulty: "Hard",
    timeLimit: 30,
    description:
      "Given an integer array nums, find the subarray with the largest sum, and return its sum. A subarray is a contiguous non-empty sequence of elements within an array.",
    example: {
      input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
      output: "6",
    },
    constraints: ["1 <= nums.length <= 105", "-104 <= nums[i] <= 104"],
    testInput: "[-2,1,-3,4,-1,2,1,-5,4]",
    expectedOutput: "6",
    solutionPattern: "return 6",
  },
  // Other coding questions...
];

// Get code template based on language
const getCodeTemplate = (
  language: string,
  question: (typeof codingQuestions)[0],
) => {
  switch (language) {
    case "javascript":
      return `/**
 * ${question.title}
 * ${question.description}
 */

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // Your solution here
  
}

// Example usage:
// console.log(twoSum([2,7,11,15], 9)); // Should return [0,1]`;

    case "python":
      return `"""
${question.title}
${question.description}
"""

def two_sum(nums, target):
    # Your solution here
    pass

# Example usage:
# print(two_sum([2,7,11,15], 9)) # Should return [0,1]`;

    case "java":
      return `/**
 * ${question.title}
 * ${question.description}
 */
 
class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your solution here
        return new int[]{0, 0};
    }
    
    // Example usage:
    public static void main(String[] args) {
        Solution solution = new Solution();
        int[] result = solution.twoSum(new int[]{2,7,11,15}, 9);
        // Should return [0,1]
    }
}`;

    case "cpp":
      return `/**
 * ${question.title}
 * ${question.description}
 */
 
#include <vector>
#include <iostream>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your solution here
        return {0, 0};
    }
};

// Example usage:
// int main() {
//     Solution solution;
//     vector<int> nums = {2,7,11,15};
//     vector<int> result = solution.twoSum(nums, 9);
//     // Should return [0,1]
//     return 0;
// }`;

    default:
      return "";
  }
};

export default CodingAssessment;
