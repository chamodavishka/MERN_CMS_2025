import { courseCategories } from "@/config";
import { Button } from "@/components/ui/button";
import { useContext, useEffect, useState } from "react";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  ChevronRight,
  Star,
  Users,
  Clock,
  Award,
  GraduationCap,
  Bookmark,
  Library,
  Search,
  BarChart3,
  Calendar,
  ShieldCheck,
  Play,
  FileText,
  Download,
  HelpCircle,
  Mail,
} from "lucide-react";

function StudentHomePage() {
  const { studentViewCoursesList, setStudentViewCoursesList } =
    useContext(StudentContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  function handleNavigateToCoursesPage(getCurrentId) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      category: [getCurrentId],
    };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate("/courses");
  }

  async function fetchAllStudentViewCourses() {
    setIsLoading(true);
    const response = await fetchStudentViewCourseListService();
    if (response?.success) setStudentViewCoursesList(response?.data);
    setIsLoading(false);
  }

  function handleCourseNavigate(getCurrentCourseId) {
    navigate(`/course/details/${getCurrentCourseId}`);
  }

  useEffect(() => {
    fetchAllStudentViewCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Gradient */}
      <section className="bg-gradient-to-r from-pink-500 via-purple-600 to-purple-800 text-white">
        <div className="container mx-auto py-20 px-4 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <ShieldCheck className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Secure Academic Platform</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-tight">
              Elevate Your Learning Experience
            </h1>
            <p className="text-lg text-purple-100 mb-8">
              Access courses, track your progress, and connect with your academic community through our comprehensive university platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={() => navigate('/courses')} 
                className="bg-white text-purple-700 hover:bg-purple-50 font-semibold rounded-full px-8 shadow-lg hover:shadow-xl transition-all"
              >
                Explore Courses
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-transparent border-white text-white hover:bg-white/20 rounded-full px-8"
                onClick={() => navigate('/my-courses')}
              >
                My Dashboard
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 px-4 lg:px-8 bg-white -mt-8 rounded-t-3xl relative z-10 shadow-sm">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-pink-50 rounded-2xl">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">24</h3>
              <p className="text-gray-600">My Courses</p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-2xl">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">86%</h3>
              <p className="text-gray-600">Completion Rate</p>
            </div>
            <div className="text-center p-6 bg-pink-50 rounded-2xl">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">12</h3>
              <p className="text-gray-600">Hours This Week</p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-2xl">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">3</h3>
              <p className="text-gray-600">Upcoming Deadlines</p>
            </div>
          </div>
        </div>
      </section>

      {/* My Courses Section */}
      <section className="py-16 px-4 lg:px-8 bg-gray-50">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Continue Learning</h2>
              <p className="text-gray-600 mt-2">Pick up where you left off</p>
            </div>
            <Button 
              onClick={() => navigate('/courses')}
              className="rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 px-6 shadow-md hover:shadow-lg transition-all"
            >
              Browse All Courses
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all">
                  <Skeleton className="w-full h-40 rounded-t-2xl" />
                  <div className="p-6">
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <Skeleton className="h-10 w-full rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : studentViewCoursesList && studentViewCoursesList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {studentViewCoursesList.slice(0, 3).map((courseItem) => (
                <div
                  onClick={() => handleCourseNavigate(courseItem?._id)}
                  key={courseItem?._id}
                  className="bg-white rounded-2xl overflow-hidden shadow-md cursor-pointer group hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative overflow-hidden">
                    <div className="h-40 bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-white opacity-90" />
                    </div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full w-9 h-9 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <Bookmark className="h-5 w-5" />
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-purple-700">
                        {Math.round(Math.random() * 100)}% Complete
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-medium px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                        {courseItem.category || 'Core Course'}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span>4.8</span>
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 h-14">{courseItem?.title}</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Professor <span className="font-medium text-purple-600">{courseItem?.instructorName}</span>
                    </p>
                    
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                      <span className="text-sm font-medium text-gray-700">{courseItem.credits || '3'} Credits</span>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{courseItem.duration || '15 weeks'}</span>
                      </div>
                    </div>
                    
                    <Button className="w-full mt-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 py-3">
                      <Play className="h-4 w-4 mr-2" />
                      Continue Learning
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl shadow-md">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No courses enrolled yet</h3>
              <p className="text-gray-500 mb-6">Discover our catalog to find courses for your program</p>
              <Button 
                onClick={() => navigate('/courses')}
                className="rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 px-8 py-3 shadow-md hover:shadow-lg transition-all"
              >
                Explore Courses
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Course Categories Section */}
      <section className="py-16 px-4 lg:px-8 bg-white">
        <div className="container mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Browse By Category</h2>
            <p className="text-gray-600">Explore courses across our university's faculties and departments</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {courseCategories.map((categoryItem) => (
              <div 
                key={categoryItem.id}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md hover:border-purple-200 transition-all duration-300 cursor-pointer text-center group"
                onClick={() => handleNavigateToCoursesPage(categoryItem.id)}
              >
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  {categoryItem.icon || <BookOpen className="h-6 w-6 text-white" />}
                </div>
                <h3 className="font-semibold text-gray-800 group-hover:text-purple-700 transition-colors">{categoryItem.label}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Deadlines */}
      <section className="py-16 px-4 lg:px-8 bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Upcoming Deadlines</h2>
              <p className="text-gray-600 mt-2">Stay on track with your assignments</p>
            </div>
            <Button 
              variant="outline" 
              className="rounded-full border-gray-300 text-gray-700 hover:bg-white"
              onClick={() => navigate('/calendar')}
            >
              View Full Calendar
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-pink-100 text-pink-700 p-2 rounded-lg mr-3">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Research Paper</h3>
                  <p className="text-sm text-gray-500">Advanced Psychology</p>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm font-medium text-pink-600">Due in 3 days</span>
                <Button size="sm" className="rounded-full bg-pink-100 text-pink-700 hover:bg-pink-200">
                  <Download className="h-4 w-4 mr-1" />
                  Materials
                </Button>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 text-purple-700 p-2 rounded-lg mr-3">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Midterm Exam</h3>
                  <p className="text-sm text-gray-500">Calculus II</p>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm font-medium text-purple-600">Due in 1 week</span>
                <Button size="sm" className="rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200">
                  <Download className="h-4 w-4 mr-1" />
                  Study Guide
                </Button>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-gray-100 text-gray-700 p-2 rounded-lg mr-3">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Group Project</h3>
                  <p className="text-sm text-gray-500">Software Engineering</p>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm font-medium text-gray-600">Due in 2 weeks</span>
                <Button size="sm" className="rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200">
                  <Users className="h-4 w-4 mr-1" />
                  Team
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Resources Section */}
      <section className="py-16 px-4 lg:px-8 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Academic Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-2xl text-center group hover:shadow-md transition-all cursor-pointer">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                <Library className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Digital Library</h3>
              <p className="text-gray-600 text-sm">Access journals, research papers, and eBooks</p>
            </div>
            
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-2xl text-center group hover:shadow-md transition-all cursor-pointer">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Tutoring</h3>
              <p className="text-gray-600 text-sm">Get help from subject matter experts</p>
            </div>
            
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-2xl text-center group hover:shadow-md transition-all cursor-pointer">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Analytics</h3>
              <p className="text-gray-600 text-sm">Track your academic performance</p>
            </div>
            
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-2xl text-center group hover:shadow-md transition-all cursor-pointer">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                <HelpCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Support</h3>
              <p className="text-gray-600 text-sm">Get technical and academic help</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Need Academic Assistance?</h2>
          <p className="text-xl text-pink-100 mb-10 max-w-2xl mx-auto">
            Our support team is available to help with technical issues, course access, and platform questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-purple-700 hover:bg-pink-50 px-8 py-4 font-semibold rounded-full shadow-md hover:shadow-lg transition-all"
              onClick={() => navigate('/support')}
            >
              <Mail className="h-5 w-5 mr-2" />
              Contact Support
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white/10 border-white text-white hover:bg-white/20 px-8 py-4 font-semibold rounded-full"
              onClick={() => navigate('/faq')}
            >
              <HelpCircle className="h-5 w-5 mr-2" />
              FAQ Portal
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default StudentHomePage;