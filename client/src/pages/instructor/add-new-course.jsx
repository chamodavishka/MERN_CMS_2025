import CourseCurriculum from "@/components/instructor-view/courses/add-new-course/course-curriculum";
import CourseLanding from "@/components/instructor-view/courses/add-new-course/course-landing";
import CourseSettings from "@/components/instructor-view/courses/add-new-course/course-settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import {
  addNewCourseService,
  fetchInstructorCourseDetailsService,
  updateCourseByIdService,
} from "@/services";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, BookOpen, FileText, Settings, Save, Play, CheckCircle } from "lucide-react";

function AddNewCoursePage() {
  const {
    courseLandingFormData,
    courseCurriculumFormData,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
    currentEditedCourseId,
    setCurrentEditedCourseId,
  } = useContext(InstructorContext);

  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const params = useParams();
  const [activeTab, setActiveTab] = useState("curriculum");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    }

    return value === "" || value === null || value === undefined;
  }

  function validateFormData() {
    for (const key in courseLandingFormData) {
      if (isEmpty(courseLandingFormData[key])) {
        return false;
      }
    }

    let hasFreePreview = false;

    for (const item of courseCurriculumFormData) {
      if (
        isEmpty(item.title) ||
        isEmpty(item.videoUrl) ||
        isEmpty(item.public_id)
      ) {
        return false;
      }

      if (item.freePreview) {
        hasFreePreview = true; //found at least one free preview
      }
    }

    return hasFreePreview;
  }

  async function handleCreateCourse() {
    setIsSubmitting(true);
    const courseFinalFormData = {
      instructorId: auth?.user?._id,
      instructorName: auth?.user?.userName,
      date: new Date(),
      ...courseLandingFormData,
      students: [],
      curriculum: courseCurriculumFormData,
      isPublised: true,
    };

    const response =
      currentEditedCourseId !== null
        ? await updateCourseByIdService(
            currentEditedCourseId,
            courseFinalFormData
          )
        : await addNewCourseService(courseFinalFormData);

    if (response?.success) {
      setCourseLandingFormData(courseLandingInitialFormData);
      setCourseCurriculumFormData(courseCurriculumInitialFormData);
      navigate(-1);
      setCurrentEditedCourseId(null);
    }
    setIsSubmitting(false);
  }

  async function fetchCurrentCourseDetails() {
    const response = await fetchInstructorCourseDetailsService(
      currentEditedCourseId
    );

    if (response?.success) {
      const setCourseFormData = Object.keys(
        courseLandingInitialFormData
      ).reduce((acc, key) => {
        acc[key] = response?.data[key] || courseLandingInitialFormData[key];

        return acc;
      }, {});

      setCourseLandingFormData(setCourseFormData);
      setCourseCurriculumFormData(response?.data?.curriculum);
    }
  }

  useEffect(() => {
    if (currentEditedCourseId !== null) fetchCurrentCourseDetails();
  }, [currentEditedCourseId]);

  useEffect(() => {
    if (params?.courseId) setCurrentEditedCourseId(params?.courseId);
  }, [params?.courseId]);

  const isFormValid = validateFormData();
  const progressPercentage = isFormValid ? 100 : 65;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-800 mb-4 transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to courses
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {currentEditedCourseId ? "Edit Course" : "Create New Course"}
              </h1>
              <p className="text-slate-600 mt-2">
                Build and organize your course content
              </p>
            </div>
            
            <div className="flex items-center space-x-3">  
              <Button
                
                className="px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-600/30 transition-all"
                onClick={handleCreateCourse}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-pulse">Processing...</span>
                  </>
                ) : currentEditedCourseId ? (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Update Course
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Submit Course
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>


        {/* Main Content Card */}
        <Card className="shadow-xl border-0 overflow-hidden rounded-xl">
          <CardContent className="p-0">
            <Tabs 
              defaultValue="curriculum" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="border-b border-slate-200 bg-white">
                <TabsList className="w-full justify-start rounded-none bg-white p-0 h-auto">
                  <TabsTrigger 
                    value="curriculum" 
                    className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 py-4 px-6 font-medium flex items-center transition-colors"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Course Content
                  </TabsTrigger>
                  <TabsTrigger 
                    value="course-landing-page"
                    className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 py-4 px-6 font-medium flex items-center transition-colors"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Course Details
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <div className="p-6 bg-white">
                <TabsContent value="curriculum" className="m-0 focus:outline-none">
                  <CourseCurriculum />
                </TabsContent>
                <TabsContent value="course-landing-page" className="m-0 focus:outline-none">
                  <CourseLanding />
                </TabsContent>
                <TabsContent value="settings" className="m-0 focus:outline-none">
                  <CourseSettings />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Bottom Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => {
              const tabs = ["curriculum", "course-landing-page", "settings"];
              const currentIndex = tabs.indexOf(activeTab);
              if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1]);
            }}
            disabled={activeTab === "curriculum"}
            className="flex items-center gap-1 border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          
          <Button
            onClick={() => {
              const tabs = ["curriculum", "course-landing-page", "settings"];
              const currentIndex = tabs.indexOf(activeTab);
              if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1]);
            }}
            disabled={activeTab === "settings"}
            className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/30"
          >
            Next
            <ChevronLeft className="w-4 h-4 rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AddNewCoursePage;