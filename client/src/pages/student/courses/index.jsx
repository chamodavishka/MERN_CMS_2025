import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { filterOptions, sortOptions } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services";
import { 
  ArrowUpDownIcon, 
  FilterIcon, 
  StarIcon, 
  ClockIcon,
  PlayCircleIcon,
  BarChart3Icon,
  XIcon,
  SearchIcon,
  BookOpenIcon,
  UsersIcon,
  ChevronDownIcon
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];
  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }
  return queryParams.join("&");
}

function StudentViewCoursesPage() {
  const [sort, setSort] = useState("price-lowtohigh");
  const [filters, setFilters] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    studentViewCoursesList,
    setStudentViewCoursesList,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [expandedFilters, setExpandedFilters] = useState({});

  function handleFilterOnChange(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      cpyFilters[getSectionId] = [getCurrentOption.id];
    } else {
      const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(
        getCurrentOption.id
      );
      if (indexOfCurrentOption === -1) {
        cpyFilters[getSectionId].push(getCurrentOption.id);
      } else {
        cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
      }
    }
    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  function clearFilters() {
    setFilters({});
    sessionStorage.removeItem("filters");
  }

  async function fetchAllStudentViewCourses(filters, sort) {
    const query = new URLSearchParams({ ...filters, sortBy: sort });
    const response = await fetchStudentViewCourseListService(query);
    if (response?.success) {
      setStudentViewCoursesList(response?.data);
      setLoadingState(false);
    }
  }

  function handleCourseNavigate(getCurrentCourseId) {
    navigate(`/course/details/${getCurrentCourseId}`);
  }

  const toggleFilterSection = (section) => {
    setExpandedFilters(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Calculate active filters count
  useEffect(() => {
    let count = 0;
    Object.values(filters).forEach(filterArray => {
      count += filterArray.length;
    });
    setActiveFiltersCount(count);
  }, [filters]);

  useEffect(() => {
    const buildQueryStringForFilters = createSearchParamsHelper(filters);
    setSearchParams(new URLSearchParams(buildQueryStringForFilters));
  }, [filters]);

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
    // Initialize all filter sections as expanded
    const initialExpanded = {};
    Object.keys(filterOptions).forEach(key => {
      initialExpanded[key] = true;
    });
    setExpandedFilters(initialExpanded);
  }, []);

  useEffect(() => {
    if (filters !== null && sort !== null)
      fetchAllStudentViewCourses(filters, sort);
  }, [filters, sort]);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem("filters");
    };
  }, []);

  useEffect(() => {
    async function checkPurchasedCourses() {
      if (studentViewCoursesList.length > 0 && auth?.user?._id) {
        const purchased = [];
        for (const course of studentViewCoursesList) {
          const response = await checkCoursePurchaseInfoService(
            course._id,
            auth.user._id
          );
          if (response?.success && response?.data) {
            purchased.push(course._id);
          }
        }
        setPurchasedCourses(purchased);
      }
    }
    checkPurchasedCourses();
  }, [studentViewCoursesList, auth]);

  // Filter courses based on search query
  const filteredCourses = studentViewCoursesList.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.instructorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-3">
            Discover Your Next Course
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive catalog of university courses designed to advance your academic journey
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
          <div className="relative flex-1 max-w-2xl mx-auto w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <SearchIcon className="h-5 w-5 text-purple-400" />
            </div>
            <input
              type="text"
              placeholder="Search courses, instructors, or topics..."
              className="w-full pl-10 pr-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="md:hidden flex items-center gap-2 bg-white border-purple-200 hover:bg-purple-50"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <FilterIcon className="h-4 w-4 text-purple-500" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="bg-purple-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 bg-white border-purple-200 hover:bg-purple-50">
                  <ArrowUpDownIcon className="h-4 w-4 text-purple-500" />
                  <span className="text-purple-700">Sort</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white rounded-xl border border-purple-100 shadow-lg">
                <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
                  {sortOptions.map((option) => (
                    <DropdownMenuRadioItem 
                      key={option.value} 
                      value={option.value}
                      className="flex items-center gap-2 text-purple-700 focus:bg-purple-50"
                    >
                      {option.icon && <option.icon className="h-4 w-4 text-purple-500" />}
                      {option.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Filters Overlay */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden">
            <div className="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-xl overflow-y-auto">
              <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-purple-600 to-pink-500 text-white">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button variant="ghost" size="icon" onClick={() => setMobileFiltersOpen(false)} className="text-white hover:bg-purple-500">
                  <XIcon className="h-5 w-5" />
                </Button>
              </div>
              <div className="p-4 space-y-6">
                {Object.keys(filterOptions).map((ketItem) => (
                  <div key={ketItem} className="border-b border-purple-100 pb-4 last:border-b-0">
                    <div 
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleFilterSection(ketItem)}
                    >
                      <h3 className="font-bold text-purple-700">{ketItem.toUpperCase()}</h3>
                      <ChevronDownIcon className={`h-4 w-4 text-purple-500 transition-transform ${expandedFilters[ketItem] ? 'rotate-180' : ''}`} />
                    </div>
                    {expandedFilters[ketItem] && (
                      <div className="grid gap-2 mt-3">
                        {filterOptions[ketItem].map((option) => (
                          <Label
                            key={option.id}
                            className="flex font-medium items-center gap-3 py-1 text-gray-700"
                          >
                            <Checkbox
                              checked={
                                filters &&
                                Object.keys(filters).length > 0 &&
                                filters[ketItem] &&
                                filters[ketItem].indexOf(option.id) > -1
                              }
                              onCheckedChange={() =>
                                handleFilterOnChange(ketItem, option)
                              }
                              className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                            />
                            {option.label}
                          </Label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="sticky bottom-0 bg-white pt-4 border-t border-purple-100">
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600" 
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    Apply Filters
                  </Button>
                  {activeFiltersCount > 0 && (
                    <Button variant="outline" className="w-full mt-2 border-purple-200 text-purple-700 hover:bg-purple-50" onClick={clearFilters}>
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className="lg:col-span-1 hidden lg:block">
            <Card className="sticky top-24 overflow-hidden border-purple-100 shadow-md">
              <div className="bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-3 border-b border-purple-200 flex justify-between items-center">
                <h2 className="font-semibold text-white">Filters</h2>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-white hover:bg-purple-500">
                    Clear All
                  </Button>
                )}
              </div>
              <CardContent className="p-4 space-y-6">
                {Object.keys(filterOptions).map((ketItem) => (
                  <div key={ketItem} className="border-b border-purple-100 pb-4 last:border-b-0">
                    <div 
                      className="flex justify-between items-center cursor-pointer mb-2"
                      onClick={() => toggleFilterSection(ketItem)}
                    >
                      <h3 className="font-bold text-purple-700">{ketItem.toUpperCase()}</h3>
                      <ChevronDownIcon className={`h-4 w-4 text-purple-500 transition-transform ${expandedFilters[ketItem] ? 'rotate-180' : ''}`} />
                    </div>
                    {expandedFilters[ketItem] && (
                      <div className="grid gap-2 mt-2">
                        {filterOptions[ketItem].map((option) => (
                          <Label
                            key={option.id}
                            className="flex font-medium items-center gap-3 py-1 text-gray-700"
                          >
                            <Checkbox
                              checked={
                                filters &&
                                Object.keys(filters).length > 0 &&
                                filters[ketItem] &&
                                filters[ketItem].indexOf(option.id) > -1
                              }
                              onCheckedChange={() =>
                                handleFilterOnChange(ketItem, option)
                              }
                              className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                            />
                            {option.label}
                          </Label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Course List */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm text-purple-700 font-medium">
                Showing {filteredCourses.length} of {studentViewCoursesList.length} courses
              </span>
              
              {activeFiltersCount > 0 && (
                <div className="hidden md:flex items-center gap-2">
                  <span className="text-sm text-purple-600">{activeFiltersCount} active filters</span>
                  <Button variant="outline" size="sm" onClick={clearFilters} className="border-purple-200 text-purple-700 hover:bg-purple-50">
                    Clear All
                  </Button>
                </div>
              )}
            </div>

            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCourses.map((courseItem) => (
                  <Card 
                    key={courseItem._id}
                    className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 border border-purple-100 rounded-xl bg-white"
                    onClick={() => handleCourseNavigate(courseItem._id)}
                  >
                    <div className="relative h-40 bg-gradient-to-r from-purple-400 to-pink-300 flex items-center justify-center">
                      <BookOpenIcon className="h-12 w-12 text-white opacity-80" />
                      {purchasedCourses.includes(courseItem._id) && (
                        <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                          Enrolled
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-900 to-transparent h-16" />
                      <div className="absolute bottom-3 left-4 text-white font-bold text-lg">
                        ${courseItem.price || "Free"}
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-lg font-bold line-clamp-2 mb-2 text-purple-900">
                          {courseItem.title}
                        </CardTitle>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <UsersIcon className="h-4 w-4 text-purple-600" />
                        </div>
                        <p className="text-sm text-purple-700">
                          By <span className="font-medium">{courseItem.instructorName}</span>
                        </p>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {courseItem.description || "No description available."}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-purple-700 mb-4">
                        <div className="flex items-center gap-1">
                          <PlayCircleIcon className="h-4 w-4" />
                          <span>{courseItem.curriculum?.length || 0} lessons</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ClockIcon className="h-4 w-4" />
                          <span>{courseItem.duration || "N/A"} hours</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <StarIcon className="h-4 w-4" />
                          <span>{courseItem.rating || "4.5"}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          courseItem.level === 'Beginner' 
                            ? 'bg-green-100 text-green-800' 
                            : courseItem.level === 'Intermediate'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {courseItem.level}
                        </span>
                        <Button 
                          size="sm" 
                          className="bg-gradient-to-r from-purple-500 to-pink-400 hover:from-purple-600 hover:to-pink-500"
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : loadingState ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden border border-purple-100 rounded-xl">
                    <Skeleton className="w-full h-40 rounded-t-xl bg-purple-100" />
                    <CardContent className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-2 bg-purple-100" />
                      <Skeleton className="h-4 w-1/2 mb-3 bg-purple-100" />
                      <Skeleton className="h-12 w-full mb-4 bg-purple-100" />
                      <div className="flex gap-4 mb-4">
                        <Skeleton className="h-4 w-1/4 bg-purple-100" />
                        <Skeleton className="h-4 w-1/4 bg-purple-100" />
                        <Skeleton className="h-4 w-1/4 bg-purple-100" />
                      </div>
                      <div className="flex justify-between">
                        <Skeleton className="h-6 w-1/4 bg-purple-100" />
                        <Skeleton className="h-8 w-1/3 bg-purple-100" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-purple-100 shadow-sm">
                <BarChart3Icon className="h-16 w-16 text-purple-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-purple-700 mb-2">No courses found</h3>
                <p className="text-gray-500 mb-4 max-w-md mx-auto">
                  Try adjusting your search or filter criteria to find what you're looking for
                </p>
                {activeFiltersCount > 0 && (
                  <Button 
                    onClick={clearFilters}
                    className="bg-gradient-to-r from-purple-500 to-pink-400 hover:from-purple-600 hover:to-pink-500"
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentViewCoursesPage;