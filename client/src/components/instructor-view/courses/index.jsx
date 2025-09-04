import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import { 
  Delete, 
  Edit, 
  Plus, 
  Users, 
  DollarSign, 
  BarChart3, 
  BookOpen,
  ArrowUpRight,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Download
} from "lucide-react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

function InstructorCourses({ listOfCourses }) {
  const navigate = useNavigate();
  const {
    setCurrentEditedCourseId,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
  } = useContext(InstructorContext);
  const [isDeleting, setIsDeleting] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = (courseId) => {
    setIsDeleting(courseId);
    // Simulate delete process
    setTimeout(() => {
      console.log("Course deleted:", courseId);
      setIsDeleting(null);
    }, 1500);
  };

  // Calculate total revenue
  const totalRevenue = listOfCourses.reduce((total, course) => {
    return total + (course?.pricing || 0) * (course?.students?.length || 0);
  }, 0);

  // Filter courses based on search term
  const filteredCourses = listOfCourses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Courses</h1>
          <p className="text-gray-500 mt-1">
            Manage and track performance of your courses
          </p>
        </div>
        <Button
          onClick={() => {
            setCurrentEditedCourseId(null);
            setCourseLandingFormData(courseLandingInitialFormData);
            setCourseCurriculumFormData(courseCurriculumInitialFormData);
            navigate("/instructor/create-new-course");
          }}
          className="p-6 gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Create New Course
        </Button>
      </div>

      {/* Stats Overview */}
      {listOfCourses && listOfCourses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card className="border border-gray-100 shadow-xs rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Courses
                  </p>
                  <h3 className="text-2xl font-bold mt-1 text-gray-900">
                    {listOfCourses.length}
                  </h3>
                </div>
                <div className="p-3 rounded-xl bg-blue-100">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm text-green-600">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span>2 new this month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-100 shadow-xs rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Students
                  </p>
                  <h3 className="text-2xl font-bold mt-1 text-gray-900">
                    {listOfCourses.reduce(
                      (total, course) => total + (course?.students?.length || 0),
                      0
                    )}
                  </h3>
                </div>
                <div className="p-3 rounded-xl bg-green-100">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm text-green-600">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span>+12% from last month</span>
              </div>
            </CardContent>
          </Card>

        
        </div>
      )}

      {/* Search and Filter Bar */}
      {listOfCourses && listOfCourses.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-xs">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search courses..."
              className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="gap-2 border-gray-200">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" className="gap-2 border-gray-200">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      )}

      <Card className="border border-gray-100 shadow-xs rounded-2xl overflow-hidden">
        <CardHeader className="px-6 py-5 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <CardTitle className="text-xl font-semibold text-gray-900">
              All Courses
            </CardTitle>
            {filteredCourses.length > 0 && (
              <span className="text-sm text-gray-500 mt-2 sm:mt-0">
                {filteredCourses.length} of {listOfCourses.length} courses
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredCourses && filteredCourses.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-gray-100">
                    <TableHead className="pl-6 py-4 font-medium text-gray-600 text-sm">
                      Course
                    </TableHead>
                    <TableHead className="py-4 font-medium text-gray-600 text-sm">
                      Category
                    </TableHead>
                    <TableHead className="py-4 font-medium text-gray-600 text-sm">
                      Students
                    </TableHead>
                    <TableHead className="py-4 font-medium text-gray-600 text-sm">
                      Revenue
                    </TableHead>
                    <TableHead className="pr-6 py-4 text-right font-medium text-gray-600 text-sm">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourses.map((course) => (
                    <TableRow
                      key={course._id}
                      className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors"
                    >
                      <TableCell className="pl-6 py-4 font-medium">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center shadow-xs">
                            <span className="font-bold text-indigo-600 text-lg">
                              {course?.title?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{course?.title}</p>
                            <p className="text-sm text-gray-500">
                              ${course?.pricing || 0} • {course?.level || "All Levels"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {course?.category || "Uncategorized"}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">{course?.students?.length || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="text-gray-700 font-medium">
                          ${((course?.pricing || 0) * (course?.students?.length || 0)).toLocaleString()}
                        </div>
                      </TableCell>
                      
                      <TableCell className="pr-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            onClick={() => {
                              navigate(`/course/${course?._id}`);
                            }}
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 p-0 rounded-lg"
                            title="View course"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => {
                              navigate(`/instructor/edit-course/${course?._id}`);
                            }}
                            variant="ghost"
                            size="sm"
                            className="h-9 gap-1.5 rounded-lg"
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 p-0 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(course._id)}
                            disabled={isDeleting === course._id}
                            title="Delete course"
                          >
                            {isDeleting === course._id ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                            ) : (
                              <Delete className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="rounded-2xl bg-gray-100 p-5 mb-5">
                <BookOpen className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "No courses found" : "No courses yet"}
              </h3>
              <p className="text-gray-500 mb-6 max-w-md">
                {searchTerm 
                  ? "Try adjusting your search or filter to find what you're looking for."
                  : "Get started by creating your first course. Share your knowledge with students around the world."
                }
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => {
                    setCurrentEditedCourseId(null);
                    setCourseLandingFormData(courseLandingInitialFormData);
                    setCourseCurriculumFormData(courseCurriculumInitialFormData);
                    navigate("/instructor/create-new-course");
                  }}
                  className="gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-5 w-5" />
                  Create Your First Course
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default InstructorCourses;