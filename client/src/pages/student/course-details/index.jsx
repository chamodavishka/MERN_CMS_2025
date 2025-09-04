import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  createPaymentService,
  fetchStudentViewCourseDetailsService,
} from "@/services";
import { CheckCircle, Globe, Lock, PlayCircle, Star, Users, Clock, Award, ChevronRight, BookOpen } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function StudentViewCourseDetailsPage() {
  const {
    studentViewCourseDetails,
    setStudentViewCourseDetails,
    currentCourseDetailsId,
    setCurrentCourseDetailsId,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);

  const { auth } = useContext(AuthContext);

  const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] =
    useState(null);
  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
  const [approvalUrl, setApprovalUrl] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  async function fetchStudentViewCourseDetails() {
    const response = await fetchStudentViewCourseDetailsService(
      currentCourseDetailsId
    );

    if (response?.success) {
      setStudentViewCourseDetails(response?.data);
      setLoadingState(false);
    } else {
      setStudentViewCourseDetails(null);
      setLoadingState(false);
    }
  }

  function handleSetFreePreview(getCurrentVideoInfo) {
    setDisplayCurrentVideoFreePreview(getCurrentVideoInfo?.videoUrl);
  }

  async function handleCreatePayment() {
    const paymentPayload = {
      userId: auth?.user?._id,
      userName: auth?.user?.userName,
      userEmail: auth?.user?.userEmail,
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "initiated",
      orderDate: new Date(),
      paymentId: "",
      payerId: "",
      instructorId: studentViewCourseDetails?.instructorId,
      instructorName: studentViewCourseDetails?.instructorName,
      courseImage: studentViewCourseDetails?.image,
      courseTitle: studentViewCourseDetails?.title,
      courseId: studentViewCourseDetails?._id,
      coursePricing: studentViewCourseDetails?.pricing,
    };

    const response = await createPaymentService(paymentPayload);

    if (response.success) {
      sessionStorage.setItem(
        "currentOrderId",
        JSON.stringify(response?.data?.orderId)
      );
      setApprovalUrl(response?.data?.approveUrl);
    }
  }

  useEffect(() => {
    if (displayCurrentVideoFreePreview !== null) setShowFreePreviewDialog(true);
  }, [displayCurrentVideoFreePreview]);

  useEffect(() => {
    if (currentCourseDetailsId !== null) fetchStudentViewCourseDetails();
  }, [currentCourseDetailsId]);

  useEffect(() => {
    if (id) setCurrentCourseDetailsId(id);
  }, [id]);

  useEffect(() => {
    if (!location.pathname.includes("course/details"))
      setStudentViewCourseDetails(null),
        setCurrentCourseDetailsId(null);
  }, [location.pathname]);

  if (loadingState) return (
    <div className="max-w-7xl mx-auto p-6">
      <Skeleton className="h-10 w-3/4 mb-4 rounded-lg" />
      <Skeleton className="h-6 w-1/2 mb-8 rounded-lg" />
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-grow space-y-6">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
        <div className="w-full lg:w-96">
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );

  if (approvalUrl !== "") {
    window.location.href = approvalUrl;
  }

  const getIndexOfFreePreviewUrl =
    studentViewCourseDetails !== null
      ? studentViewCourseDetails?.curriculum?.findIndex(
          (item) => item.freePreview
        )
      : -1;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-8 rounded-2xl mb-8 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 opacity-10">
          <div className="w-40 h-40 rounded-full bg-white"></div>
        </div>
        <h1 className="text-4xl font-bold mb-4 relative z-10">
          {studentViewCourseDetails?.title}
        </h1>
        <div className="flex gap-8">
        <p className="text-xl mb-6 opacity-90 max-w-3xl relative z-10">
          {studentViewCourseDetails?.subtitle}
        </p>
        <p className="text-xl mb-6 opacity-90 max-w-3xl relative z-10">
          {studentViewCourseDetails?.level}
        </p>
        </div>

      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <main className="flex-grow space-y-8">
        
          
          <Card className="rounded-2xl shadow-md border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-2xl border-b">
              <CardTitle className="text-2xl">Course Description</CardTitle>
            </CardHeader>
            <CardContent className="p-6 prose max-w-none text-gray-700">
              {studentViewCourseDetails?.description}
            </CardContent>
          </Card>
          
          <Card className="rounded-2xl shadow-md border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-2xl border-b">
              <CardTitle className="text-2xl flex items-center">
                <BookOpen className="mr-2 h-6 w-6" />
                Course Curriculum
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {studentViewCourseDetails?.curriculum?.map(
                  (curriculumItem, index) => (
                    <div
                      key={index}
                      className={`flex items-center p-4 rounded-xl transition-all duration-200 ${
                        curriculumItem?.freePreview
                          ? "cursor-pointer bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 shadow-sm"
                          : "bg-gray-50 border border-gray-100"
                      }`}
                      onClick={
                        curriculumItem?.freePreview
                          ? () => handleSetFreePreview(curriculumItem)
                          : null
                      }
                    >
                      {curriculumItem?.freePreview ? (
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 mr-4">
                          <PlayCircle className="h-5 w-5 text-blue-600" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 mr-4">
                          <Lock className="h-5 w-5 text-gray-500" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{curriculumItem?.title}</p>
                        {curriculumItem?.freePreview && (
                          <p className="text-sm text-blue-600 font-medium">Free preview</p>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        10 min
                        {curriculumItem?.freePreview && (
                          <ChevronRight className="h-4 w-4 ml-2 text-gray-400" />
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </main>
        
      
      </div>
      
      <Dialog
        open={showFreePreviewDialog}
        onOpenChange={() => {
          setShowFreePreviewDialog(false);
          setDisplayCurrentVideoFreePreview(null);
        }}
      >
        <DialogContent className="max-w-4xl rounded-2xl bg-white/95 backdrop-blur-sm border-0 shadow-xl">
          <DialogHeader className="pb-4 border-b border-gray-200">
            <DialogTitle className="text-2xl flex items-center">
              <PlayCircle className="h-6 w-6 mr-2 text-indigo-600" />
              Course Preview
            </DialogTitle>
          </DialogHeader>
          <div className="aspect-video rounded-xl overflow-hidden bg-black mt-4">
            <VideoPlayer
              url={displayCurrentVideoFreePreview}
              width="100%"
              height="100%"
            />
          </div>
          <div className="py-4">
            <h4 className="font-semibold mb-3 text-gray-900">Free Preview Videos</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
              {studentViewCourseDetails?.curriculum
                ?.filter((item) => item.freePreview)
                .map((filteredItem, index) => (
                  <div
                    key={index}
                    onClick={() => handleSetFreePreview(filteredItem)}
                    className="cursor-pointer p-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center group"
                  >
                    <PlayCircle className="h-4 w-4 mr-3 text-indigo-600 group-hover:text-indigo-700" />
                    <span className="font-medium text-gray-900 group-hover:text-indigo-700">{filteredItem?.title}</span>
                    <span className="ml-auto text-sm text-gray-500">10 min</span>
                  </div>
                ))}
            </div>
          </div>
          <DialogFooter className="sm:justify-start pt-4 border-t border-gray-200">
            <DialogClose asChild>
              <Button 
                type="button" 
                variant="outline" 
                className="rounded-lg border-gray-300 hover:bg-gray-50"
              >
                Close Preview
              </Button>
            </DialogClose>
            <Button 
              className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              onClick={handleCreatePayment}
            >
              Enroll Now to Access All Content
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentViewCourseDetailsPage;