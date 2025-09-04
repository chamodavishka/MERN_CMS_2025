import FormControls from "@/components/common-form/form-controls";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { courseLandingPageFormControls } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import { useContext } from "react";
import { BookOpen, Target, BarChart3, DollarSign, Users, Clock, Calendar, Globe, FileText, Sparkles, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

function CourseLanding() {
  const { courseLandingFormData, setCourseLandingFormData } =
    useContext(InstructorContext);
    
  // Calculate completion percentage
  const calculateCompletion = () => {
    if (!courseLandingFormData || !courseLandingPageFormControls) return 0;
    
    const totalFields = courseLandingPageFormControls.length;
    const filledFields = Object.values(courseLandingFormData).filter(
      value => value !== undefined && value !== null && value !== ''
    ).length;
    
    return Math.round((filledFields / totalFields) * 100);
  };
  
  const completionPercentage = calculateCompletion();

  return (
    <div className="space-y-6">
      

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Main form content */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg border-0 rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-800">Course Details</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Provide comprehensive information about your course
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <FormControls
                formControls={courseLandingPageFormControls}
                formData={courseLandingFormData}
                setFormData={setCourseLandingFormData}
              />
            </CardContent>
          </Card>
        </div>

        
      </div>
    </div>
  );
}

export default CourseLanding;