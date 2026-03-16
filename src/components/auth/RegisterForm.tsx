import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const RegisterForm = () => {
  const [userRole, setUserRole] = useState("user"); // "user" or "recruiter"
  const [step, setStep] = useState(1);             // recruiter: 1,2,3; user: always 1

  // Shared fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Recruiter-specific
  const [company, setCompany] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const baseRecruiterUrl = "http://localhost:3000/api/auth/recruiter/register/";
  const baseCandidateUrl = "https://eshielded.itshivam.in/api/auth/register";

  // --- Candidate (Job Seeker) registration ---
  const handleCandidateRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords don't match.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(baseCandidateUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: 'candidate' }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Registered successfully");
        navigate("/login");
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Recruiter Step 1: send OTP ---
  const handleRecruiterStep1 = async (e) => {
    e.preventDefault();
    if (!name || !email || !company || !mobile) {
      toast.error("All fields are required.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(baseRecruiterUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: 1, name, email, company, mobile }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setStep(2);
      } else {
        toast.error(data.message || "Error sending OTP");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Recruiter Step 2: verify OTP ---
  const handleRecruiterStep2 = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Enter OTP.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(baseRecruiterUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: 2, email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setStep(3);
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Recruiter Step 3: set password + create account ---
  const handleRecruiterStep3 = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords don't match.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(baseRecruiterUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: 3, name, email, company, mobile, password }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        navigate("/login");
      } else {
        toast.error(data.message || "Error creating account");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fade-up">
      <Toaster />
      <div className="md:hidden flex flex-col items-center mb-8 text-center">
        <div className="bg-eshield-500 text-white rounded-full p-3 mb-4">
          <Shield size={32} />
        </div>
        <h1 className="text-2xl font-bold text-eshield-800">e-Shielded</h1>
        <p className="text-sm text-muted-foreground mt-1">
          AI-powered hiring platform
        </p>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Create Account
          </CardTitle>
          <CardDescription className="text-center">
            Choose your role and create your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs
            defaultValue="user"
            className="w-full mb-6"
            onValueChange={(val) => {
              setUserRole(val);
              setStep(1);
            }}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="user">Job Seeker</TabsTrigger>
              <TabsTrigger value="recruiter">Recruiter</TabsTrigger>
            </TabsList>
          </Tabs>

          {userRole === "user" ? (
            <form onSubmit={handleCandidateRegister}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Your full name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating..." : "Create Account"}
                </Button>
              </div>
            </form>
          ) : (
            // Recruiter flow
            <form
              onSubmit={
                step === 1
                  ? handleRecruiterStep1
                  : step === 2
                  ? handleRecruiterStep2
                  : handleRecruiterStep3
              }
            >
              <div className="space-y-4">
                {step === 1 && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name">Recruiter Name</Label>
                      <Input
                        id="name"
                        placeholder="Recruiter Name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Work Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name</Label>
                      <Input
                        id="company"
                        placeholder="Company Name"
                        required
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile Number</Label>
                      <Input
                        id="mobile"
                        placeholder="9876543210"
                        required
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                      />
                    </div>
                  </>
                )}

                {step === 2 && (
                  <div className="space-y-2">
                    <Label htmlFor="otp">Enter OTP</Label>
                    <Input
                      id="otp"
                      placeholder="6-digit code"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>
                )}

                {step === 3 && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Please wait..."
                    : step === 1
                    ? "Send OTP"
                    : step === 2
                    ? "Verify OTP"
                    : "Create Account"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-eshield-600 hover:text-eshield-800 font-medium"
            >
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterForm;
