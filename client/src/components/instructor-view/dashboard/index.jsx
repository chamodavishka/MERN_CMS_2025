import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, Users, TrendingUp, BookOpen, ChevronRight, Search, Mail, User, FileText, Filter, MoreHorizontal } from "lucide-react";
import { AuthContext } from "@/context/auth-context";
import { useState, useEffect } from "react";

function InstructorDashboard({ listOfCourses }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  
  function calculateTotalStudentsAndProfit() {
    const { totalStudents, totalProfit, studentList } = listOfCourses.reduce(
      (acc, course) => {
        const studentCount = course.students.length;
        acc.totalStudents += studentCount;
        acc.totalProfit += course.pricing * studentCount;

        course.students.forEach((student) => {
          acc.studentList.push({
            courseTitle: course.title,
            courseId: course.id,
            studentName: student.studentName,
            studentEmail: student.studentEmail,
            enrollmentDate: student.enrollmentDate || "2023-10-15" // Fallback for demo
          });
        });

        return acc;
      },
      {
        totalStudents: 0,
        totalProfit: 0,
        studentList: [],
      }
    );

    return {
      totalProfit,
      totalStudents,
      studentList,
    };
  }

  const { totalProfit, totalStudents, studentList } = calculateTotalStudentsAndProfit();
  
  useEffect(() => {
    if (searchTerm) {
      const filtered = studentList.filter(
        student => 
          student.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.studentEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(studentList);
    }
  }, [searchTerm, studentList]);

  // Filter by course
  const courseFilters = [
    { id: "all", name: "All Courses" },
    ...listOfCourses.map(course => ({ id: course.id, name: course.title }))
  ];

  const handleFilterChange = (courseId) => {
    setActiveFilter(courseId);
    if (courseId === "all") {
      setFilteredStudents(studentList);
    } else {
      const filtered = studentList.filter(student => student.courseId === courseId);
      setFilteredStudents(filtered);
    }
  };

  const stats = [
    {
      icon: Users,
      label: "Total Students",
      value: totalStudents,
      change: "+12% from last month",
      trend: "up",
      color: "blue"
    },
    {
      icon: BookOpen,
      label: "Total Courses",
      value: listOfCourses.length,
      change: "+2 new courses",
      trend: "neutral",
      color: "green"
    },
    
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your teaching overview.</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search students..."
              className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((item, index) => (
          <Card key={index} className="bg-white border border-gray-100 shadow-xs rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 pt-6 px-6">
              <CardTitle className="text-sm font-medium text-gray-600">
                {item.label}
              </CardTitle>
              <div className={`p-2.5 rounded-xl bg-${item.color}-50`}>
                <item.icon className={`h-5 w-5 text-${item.color}-600`} />
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="text-2xl font-bold text-gray-900">{item.value}</div>
              <p className={`text-xs mt-2 flex items-center ${item.trend === 'up' ? 'text-green-600' : item.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                {item.trend === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
                {item.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Students List Section */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-xs overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Students</h2>
            <p className="text-sm text-gray-500 mt-1">Manage and view all your students</p>
          </div>
          <span className="text-sm text-gray-500 mt-2 md:mt-0">
            {filteredStudents.length} {filteredStudents.length === 1 ? 'student' : 'students'}
          </span>
        </div>
        
        {/* Filter Tabs */}
        <div className="px-6 pt-4 pb-2 flex flex-wrap gap-2">
          {courseFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => handleFilterChange(filter.id)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeFilter === filter.id 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {filter.name}
            </button>
          ))}
        </div>
        
        <div className="p-6">
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <Table className="w-full">
              <TableHeader className="bg-gray-50">
                <TableRow className="border-b border-gray-200">
                  <TableHead className="py-4 text-gray-600 font-medium text-sm">Student</TableHead>
                  <TableHead className="py-4 text-gray-600 font-medium text-sm">Email</TableHead>
                  <TableHead className="py-4 text-gray-600 font-medium text-sm">Course</TableHead>
                  <TableHead className="py-4 text-gray-600 font-medium text-sm">Enrolled</TableHead>
                  <TableHead className="py-4 text-right text-gray-600 font-medium text-sm">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((studentItem, index) => (
                    <TableRow key={index} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                      <TableCell className="py-4">
                        <div className="flex items-center">
                          <div className="bg-blue-100 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <span className="font-medium text-gray-900">{studentItem.studentName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-gray-600">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          {studentItem.studentEmail}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="text-gray-900">{studentItem.courseTitle}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-gray-600">{studentItem.enrollmentDate}</TableCell>
                      <TableCell className="py-4 text-right">
                        <button className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
                          View details <ChevronRight className="h-4 w-4 ml-1" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Search className="h-12 w-12 text-gray-300 mb-4" />
                        <p className="text-gray-500 font-medium">No students found</p>
                        <p className="text-gray-400 text-sm mt-1">
                          {searchTerm ? "Try adjusting your search or filter" : "You don't have any students yet"}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstructorDashboard;