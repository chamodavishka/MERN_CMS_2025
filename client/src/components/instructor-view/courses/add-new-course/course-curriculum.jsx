import { useContext, useRef, useState } from "react";
import MediaProgressbar from "@/components/media-progress-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import VideoPlayer from "@/components/video-player";
import { courseCurriculumInitialFormData } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import {
  mediaBulkUploadService,
  mediaDeleteService,
  mediaUploadService,
} from "@/services";
import { Upload, Trash2, Plus, FileText, Video, File, Eye, Replace } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function CourseCurriculum() {
  const {
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  const bulkUploadInputRef = useRef(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState("");
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [expandedLectures, setExpandedLectures] = useState({});

  // Toggle lecture expansion
  const toggleLectureExpansion = (index) => {
    setExpandedLectures(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // --- Functions ---

  function handleNewLecture() {
    setCourseCurriculumFormData([
      ...courseCurriculumFormData,
      {
        ...courseCurriculumInitialFormData[0],
        title: `Lecture ${courseCurriculumFormData.length + 1}`,
        videoUrl: "",
        public_id: "",
        noteUrl: "",
        note_public_id: "",
      },
    ]);
    
    // Expand the newly added lecture
    setExpandedLectures(prev => ({
      ...prev,
      [courseCurriculumFormData.length]: true
    }));
  }

  function handleCourseTitleChange(event, currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    cpyCourseCurriculumFormData[currentIndex].title = event.target.value;
    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
  }

  function handleFreePreviewChange(currentValue, currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    cpyCourseCurriculumFormData[currentIndex].freePreview = currentValue;
    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
  }

  async function handleSingleLectureUpload(event, currentIndex) {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const videoFormData = new FormData();
    videoFormData.append("file", selectedFile);

    try {
      setMediaUploadProgress(true);
      const response = await mediaUploadService(videoFormData, setMediaUploadProgressPercentage);
      if (response.success) {
        let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
        cpyCourseCurriculumFormData[currentIndex] = {
          ...cpyCourseCurriculumFormData[currentIndex],
          videoUrl: response?.data?.url,
          public_id: response?.data?.public_id,
        };
        setCourseCurriculumFormData(cpyCourseCurriculumFormData);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setMediaUploadProgress(false);
    }
  }

  async function handleSingleLectureNoteUpload(event, currentIndex) {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const noteFormData = new FormData();
    noteFormData.append("file", selectedFile);

    try {
      setMediaUploadProgress(true);
      const response = await mediaUploadService(noteFormData, setMediaUploadProgressPercentage);
      if (response.success) {
        let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
        cpyCourseCurriculumFormData[currentIndex] = {
          ...cpyCourseCurriculumFormData[currentIndex],
          noteUrl: response?.data?.url,
          note_public_id: response?.data?.public_id,
        };
        setCourseCurriculumFormData(cpyCourseCurriculumFormData);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setMediaUploadProgress(false);
    }
  }

  async function updateLectureState(currentIndex, newValues) {
    const cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    cpyCourseCurriculumFormData[currentIndex] = {
      ...cpyCourseCurriculumFormData[currentIndex],
      ...newValues,
    };
    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
  }

  async function deleteMedia(public_id) {
    if (!public_id) return { success: true };
    try {
      console.log(`Attempting to delete media with public_id: ${public_id}`);
      const response = await mediaDeleteService(public_id);
      if (response?.success) {
        console.log("Media deleted successfully from cloud.");
        return { success: true };
      } else {
        console.error("Failed to delete media. API Response:", response);
        alert("Error: Could not delete the file from the server.");
        return { success: false };
      }
    } catch (error) {
      console.error("An error occurred while deleting media:", error);
      alert("An error occurred. Please check the console for details.");
      return { success: false };
    }
  }

  async function handleReplaceVideo(currentIndex) {
    const { public_id } = courseCurriculumFormData[currentIndex];
    const deleteResult = await deleteMedia(public_id);
    if (deleteResult.success) {
      updateLectureState(currentIndex, { videoUrl: "", public_id: "" });
    }
  }

  async function handleDeleteVideo(currentIndex) {
    const { public_id } = courseCurriculumFormData[currentIndex];
    const deleteResult = await deleteMedia(public_id);
    if (deleteResult.success) {
      updateLectureState(currentIndex, { videoUrl: "", public_id: "" });
    }
  }

  async function handleReplaceLectureNote(currentIndex) {
    const { note_public_id } = courseCurriculumFormData[currentIndex];
    const deleteResult = await deleteMedia(note_public_id);
    if (deleteResult.success) {
      updateLectureState(currentIndex, { noteUrl: "", note_public_id: "" });
    }
  }

  async function handleDeleteLectureNote(currentIndex) {
    const { note_public_id } = courseCurriculumFormData[currentIndex];
    const deleteResult = await deleteMedia(note_public_id);
    if (deleteResult.success) {
      updateLectureState(currentIndex, { noteUrl: "", note_public_id: "" });
    }
  }

  function handlePreviewPdf(noteUrl) {
    setPdfPreviewUrl(noteUrl);
    setIsPdfModalOpen(true);
  }

  function handleOpenBulkUploadDialog() {
    bulkUploadInputRef.current?.click();
  }

  async function handleDeleteLecture(currentIndex) {
    const { public_id, note_public_id } = courseCurriculumFormData[currentIndex];
    
    await deleteMedia(public_id);
    await deleteMedia(note_public_id);

    const updatedLectures = courseCurriculumFormData.filter((_, index) => index !== currentIndex);
    setCourseCurriculumFormData(updatedLectures.length > 0 ? updatedLectures : courseCurriculumInitialFormData);
    
    // Update expanded state
    const newExpanded = {...expandedLectures};
    delete newExpanded[currentIndex];
    setExpandedLectures(newExpanded);
  }
  
  // --- JSX / Component Return ---
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Course Curriculum</h1>
          <p className="text-gray-500 mt-1">
            Build your course structure with lectures and resources
          </p>
        </div>
        <Button 
          onClick={handleNewLecture} 
          className="gap-2 bg-blue-600 hover:bg-blue-700"
          disabled={mediaUploadProgress}
        >
          <Plus className="h-5 w-5" />
          Add New Lecture
        </Button>
      </div>

      {mediaUploadProgress && (
        <Card className="border border-gray-100 shadow-xs rounded-xl">
          <CardContent className="p-6">
            <MediaProgressbar isMediaUploading={mediaUploadProgress} progress={mediaUploadProgressPercentage} />
          </CardContent>
        </Card>
      )}
      
      <Dialog open={isPdfModalOpen} onOpenChange={setIsPdfModalOpen}>
        <DialogContent className="max-w-4xl h-[85vh] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Lecture Note Preview</DialogTitle>
          </DialogHeader>
          {pdfPreviewUrl && (
            <iframe 
              src={`https://docs.google.com/gview?url=${encodeURIComponent(pdfPreviewUrl)}&embedded=true`}
              width="100%" height="98%" title="PDF Preview" style={{ border: "none", borderRadius: "8px" }}
            />
          )}
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        {courseCurriculumFormData.length === 0 ? (
          <Card className="border border-gray-100 shadow-xs rounded-2xl overflow-hidden">
            <CardContent className="p-12 text-center">
              <div className="rounded-2xl bg-gray-100 p-5 inline-flex mb-5">
                <Video className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No lectures yet</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Start building your course by adding your first lecture. You can include videos, notes, and set free previews.
              </p>
              <Button 
                onClick={handleNewLecture} 
                className="gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-5 w-5" />
                Create Your First Lecture
              </Button>
            </CardContent>
          </Card>
        ) : (
          courseCurriculumFormData.map((curriculumItem, index) => (
            <Card key={index} className="border border-gray-100 shadow-xs rounded-2xl overflow-hidden">
              <CardHeader 
                className="p-5 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleLectureExpansion(index)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <span className="font-bold text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {curriculumItem.title || `Lecture ${index + 1}`}
                      </CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        {curriculumItem.videoUrl ? "Video uploaded" : "No video"} • 
                        {curriculumItem.noteUrl ? " Notes attached" : " No notes"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        onCheckedChange={(value) => handleFreePreviewChange(value, index)} 
                        checked={curriculumItem?.freePreview} 
                        id={`freePreview-${index + 1}`} 
                      />
                      <Label htmlFor={`freePreview-${index + 1}`} className="text-sm text-gray-600">Free Preview</Label>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteLecture(index);
                      }}
                      className="h-9 w-9 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              {expandedLectures[index] && (
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor={`title-${index + 1}`} className="text-gray-700">Lecture Title</Label>
                    <Input 
                      id={`title-${index + 1}`}
                      placeholder="Enter lecture title" 
                      className="max-w-lg"
                      onChange={(event) => handleCourseTitleChange(event, index)} 
                      value={curriculumItem?.title} 
                    />
                  </div>

                  {/* Video Upload Section */}
                  <div className="space-y-3">
                    <Label className="font-medium text-gray-700 flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      Lecture Video
                    </Label>
                    {curriculumItem?.videoUrl ? (
                      <div className="flex flex-col md:flex-row gap-5 items-start">
                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                          <VideoPlayer url={curriculumItem?.videoUrl} width="320px" height="180px" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button 
                            onClick={() => handleReplaceVideo(index)} 
                            variant="outline" 
                            className="gap-2 border-gray-300"
                          >
                            <Replace className="h-4 w-4" />
                            Replace Video
                          </Button>
                          <Button 
                            onClick={() => handleDeleteVideo(index)} 
                            variant="outline" 
                            className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-gray-300"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete Video
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center">
                        <Label htmlFor={`video-upload-${index}`} className="cursor-pointer">
                          <div className="flex flex-col items-center justify-center gap-3">
                            <Upload className="h-10 w-10 text-gray-400" />
                            <p className="text-gray-700 font-medium">Upload video file</p>
                            <p className="text-gray-500 text-sm">MP4, MOV, AVI (Max 500MB)</p>
                          </div>
                          <Input 
                            id={`video-upload-${index}`}
                            type="file" 
                            accept="video/*" 
                            onChange={(event) => handleSingleLectureUpload(event, index)} 
                            className="hidden"
                          />
                        </Label>
                      </div>
                    )}
                  </div>

                  {/* Lecture Note Upload Section */}
                  <div className="space-y-3">
                    <Label className="font-medium text-gray-700 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Lecture Notes
                    </Label>
                    {curriculumItem?.noteUrl ? (
                      <div className="flex flex-wrap items-center gap-4">
                        <Button
                          variant="outline" 
                          className="gap-2 border-gray-300"
                          onClick={() => handlePreviewPdf(curriculumItem.noteUrl)}
                        >
                          <Eye className="h-4 w-4" />
                          View Lecture Note
                        </Button>
                        <Button 
                          onClick={() => handleReplaceLectureNote(index)} 
                          variant="outline" 
                          className="gap-2 border-gray-300"
                        >
                          <Replace className="h-4 w-4" />
                          Replace Note
                        </Button>
                        <Button 
                          onClick={() => handleDeleteLectureNote(index)} 
                          variant="outline" 
                          className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-gray-300"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete Note
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center">
                        <Label htmlFor={`note-upload-${index}`} className="cursor-pointer">
                          <div className="flex flex-col items-center justify-center gap-3">
                            <File className="h-10 w-10 text-gray-400" />
                            <p className="text-gray-700 font-medium">Upload lecture notes</p>
                            <p className="text-gray-500 text-sm">PDF, DOC, DOCX, TXT (Max 20MB)</p>
                          </div>
                          <Input 
                            id={`note-upload-${index}`}
                            type="file" 
                            accept=".pdf,.doc,.docx,.txt" 
                            onChange={(event) => handleSingleLectureNoteUpload(event, index)} 
                            className="hidden"
                          />
                        </Label>
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default CourseCurriculum;