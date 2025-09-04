import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "@/context/auth-context";
import CommonForm from "@/components/common-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signInFormControls, signUpFormControls } from "@/config";
import {
  GraduationCap,
  BookOpen,
  University,
  Shield,
  Calendar,
  Users
} from "lucide-react";

function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin");
  const {
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    handleRegisterUser,
    handleLoginUser,
  } = useContext(AuthContext);

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const checkIfSignInFormIsValid = () => {
    return (
      signInFormData &&
      signInFormData.userEmail !== "" &&
      signInFormData.password !== ""
    );
  };

  const checkIfSignUpFormIsValid = () => {
    return (
      signUpFormData &&
      signUpFormData.userName !== "" &&
      signUpFormData.userEmail !== "" &&
      signUpFormData.password !== ""
    );
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-600/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-600/10 rounded-full translate-x-1/3 translate-y-1/3"></div>
      
      {/* Animated floating icons */}
      <div className="absolute top-1/4 left-1/4 animate-float">
        <BookOpen className="h-8 w-8 text-purple-500/40" />
      </div>
      <div className="absolute top-1/3 right-1/4 animate-float delay-1000">
        <Calendar className="h-8 w-8 text-pink-500/40" />
      </div>
      <div className="absolute bottom-1/4 left-1/3 animate-float delay-2000">
        <Users className="h-8 w-8 text-purple-600/40" />
      </div>

      <div className="flex-1 flex flex-col lg:flex-row z-10">
        {/* Left side - Branding and information */}
        <div className="lg:w-1/2 flex flex-col justify-between p-8 lg:p-12 bg-gradient-to-br from-purple-600 to-pink-500 text-white">
          <div>
            <Link to="/" className="flex items-center gap-3 mb-12">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <GraduationCap className="h-8 w-8" />
              </div>
              <span className="font-bold text-2xl">EDUPLATFORM</span>
            </Link>
            
            <div className="mt-16 max-w-md">
              <h1 className="text-4xl font-bold mb-6">University Course Management System</h1>
              <p className="text-lg text-white/90 mb-8">
                Access your courses, track your progress, and connect with your academic community through our comprehensive learning platform.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-full">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <span>Manage your course schedule</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-full">
                    <University className="h-5 w-5" />
                  </div>
                  <span>Access learning materials</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-full">
                    <Users className="h-5 w-5" />
                  </div>
                  <span>Connect with instructors and peers</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-white/80 mt-8">
            <Shield className="h-4 w-4" />
            <span>Secure Academic Portal • Trusted by 50+ institutions</span>
          </div>
        </div>
        
        {/* Right side - Login form */}
        <div className="lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to EDUPlatform</h2>
              <p className="text-gray-600">Sign in to access your courses</p>
            </div>
            
            <Tabs
              value={activeTab}
              defaultValue="signin"
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 p-1 bg-gray-100 rounded-xl mb-6">
                <TabsTrigger 
                  value="signin" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-purple-600 rounded-lg py-3 font-medium transition-all"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="signup" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-purple-600 rounded-lg py-3 font-medium transition-all"
                >
                  Create Account
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="animate-fade-in">
                <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-purple-600 to-pink-500"></div>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl text-gray-800">Welcome Back</CardTitle>
                    <CardDescription className="text-gray-600">
                      Enter your credentials to access your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CommonForm
                      formControls={signInFormControls}
                      buttonText={"Sign In"}
                      formData={signInFormData}
                      setFormData={setSignInFormData}
                      isButtonDisabled={!checkIfSignInFormIsValid()}
                      handleSubmit={handleLoginUser}
                    />
                    <div className="text-center pt-4 border-t border-gray-100 mt-6">
                      <a href="#" className="text-sm text-purple-600 hover:text-purple-800 hover:underline">
                        Forgot your password?
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="signup" className="animate-fade-in">
                <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-purple-600 to-pink-500"></div>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl text-gray-800">Create Account</CardTitle>
                    <CardDescription className="text-gray-600">
                      Join our academic community
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CommonForm
                      formControls={signUpFormControls}
                      buttonText={"Create Account"}
                      formData={signUpFormData}
                      setFormData={setSignUpFormData}
                      isButtonDisabled={!checkIfSignUpFormIsValid()}
                      handleSubmit={handleRegisterUser}
                    />
                    <div className="text-center pt-4 border-t border-gray-100 mt-6 text-sm text-gray-600">
                      By creating an account, you agree to our <a href="#" className="text-purple-600 hover:underline">Terms</a> and <a href="#" className="text-purple-600 hover:underline">Privacy Policy</a>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="text-center mt-6 text-sm text-gray-600">
              <p>Need help? Contact <a href="mailto:support@university.edu" className="text-purple-600 hover:underline">IT Support</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;