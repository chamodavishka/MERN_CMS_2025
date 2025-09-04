import MediaProgressbar from "@/components/media-progress-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InstructorContext } from "@/context/instructor-context";
import { mediaUploadService } from "@/services";
import { useContext, useRef } from "react";
import { Upload, Image, Trash2, Eye, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

function CourseSettings() {
  const {
    courseLandingFormData,
    setCourseLandingFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  const fileInputRef = useRef(null);

  async function handleImageUploadChange(event) {
    const selectedImage = event.target.files[0];

    if (selectedImage) {
      // Validate file type
      if (!selectedImage.type.startsWith('image/')) {
        alert('Please select an image file (JPEG, PNG, GIF, etc.)');
        return;
      }

      // Validate file size (max 5MB)
      if (selectedImage.size > 5 * 1024 * 1024) {
        alert('Please select an image smaller than 5MB');
        return;
      }

      const imageFormData = new FormData();
      imageFormData.append("file", selectedImage);

      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          imageFormData,
          setMediaUploadProgressPercentage
        );
        if (response.success) {
          setCourseLandingFormData({
            ...courseLandingFormData,
            image: response.data.url,
          });
        }
      } catch (e) {
        console.log(e);
        alert('Failed to upload image. Please try again.');
      } finally {
        setMediaUploadProgress(false);
      }
    }
  }

  function handleRemoveImage() {
    setCourseLandingFormData({
      ...courseLandingFormData,
      image: "",
    });
  }

  function handleSelectImage() {
    fileInputRef.current?.click();
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-full shadow-sm">
            <Camera className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-gray-800">Course Image</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Add a compelling image that represents your course
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {mediaUploadProgress && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-700">Uploading image</span>
              <span className="text-sm text-blue-600">{mediaUploadProgressPercentage}%</span>
            </div>
            <Progress value={mediaUploadProgressPercentage} className="h-2" />
          </div>
        )}

        <div className="space-y-6">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Course Thumbnail
            </Label>
            <p className="text-sm text-gray-600 mb-4">
              This image will be displayed as the main thumbnail for your course. 
              Recommended size: 1280×720 pixels (16:9 aspect ratio).
            </p>
            
            {courseLandingFormData?.image ? (
              <div className="space-y-4">
                <div className="border rounded-lg overflow-hidden max-w-2xl">
                  <img 
                    src={courseLandingFormData.image} 
                    alt="Course thumbnail" 
                    className="w-full h-auto object-cover"
                  />
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={handleSelectImage}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Upload size={16} />
                    Replace Image
                  </Button>
                  <Button
                    onClick={handleRemoveImage}
                    variant="outline"
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                    Remove Image
                  </Button>
                  <Button
                    onClick={() => window.open(courseLandingFormData.image, '_blank')}
                    variant="ghost"
                    className="flex items-center gap-2"
                  >
                    <Eye size={16} />
                    View Original
                  </Button>
                </div>
                
                <input
                  ref={fileInputRef}
                  onChange={handleImageUploadChange}
                  type="file"
                  accept="image/*"
                  className="hidden"
                />
              </div>
            ) : (
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={handleSelectImage}
              >
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Image className="text-blue-500" size={24} />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    Upload course image
                  </p>
                  <p className="text-xs text-gray-500">
                    Click to browse or drag and drop
                  </p>
                  <p className="text-xs text-gray-400">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
                
                <input
                  ref={fileInputRef}
                  onChange={handleImageUploadChange}
                  type="file"
                  accept="image/*"
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* Additional settings can be added here */}
          <div className="pt-4 border-t">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Image Guidelines</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>Use high-quality, relevant images</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>Ensure good contrast and lighting</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>Avoid text-heavy images that become unreadable at small sizes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>Use a 16:9 aspect ratio for best results across devices</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseSettings;