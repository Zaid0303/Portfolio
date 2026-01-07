import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { addProject, getServices } from '../firebase/firestoreServices';
import { ArrowLeft, Save, Upload, X, Image as ImageIcon, Star } from 'lucide-react';

const AddProject = ({ onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    fullDescription: '',
    techStack: [],
    projectUrl: '',
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [thumbnailIndex, setThumbnailIndex] = useState(0);
  const [urlType, setUrlType] = useState('project');
  const [url, setUrl] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingServices, setLoadingServices] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoadingServices(true);
    try {
      const result = await getServices();
      if (result.success && result.data) {
        setServices(result.data);
        if (result.data.length > 0 && !formData.category) {
          setFormData(prev => ({ ...prev, category: result.data[0].title }));
        }
      }
    } catch (error) {
      console.error('Error loading services:', error);
      setError('Failed to load categories');
    } finally {
      setLoadingServices(false);
    }
  };

  // Compress image to reduce size
  const compressImage = (file, maxWidth = 1200, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to base64 with compression
          canvas.toBlob(
            (blob) => {
              const reader = new FileReader();
              reader.readAsDataURL(blob);
              reader.onloadend = () => {
                const base64 = reader.result;
                // Check size (max ~200KB per image)
                if (base64.length > 300000) {
                  // If still too large, compress more
                  canvas.toBlob(
                    (blob2) => {
                      const reader2 = new FileReader();
                      reader2.readAsDataURL(blob2);
                      reader2.onloadend = () => resolve(reader2.result);
                    },
                    'image/jpeg',
                    0.6
                  );
                } else {
                  resolve(base64);
                }
              };
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    // Limit to 5 images maximum to avoid size issues
    if (images.length + files.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

    // Check individual file sizes
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError('Each image should be less than 5MB');
      return;
    }

    // Add new images
    const newImages = [...images, ...files];
    setImages(newImages);

    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
    
    setError('');
  };

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    setImages(newImages);
    setImagePreviews(newPreviews);
    
    if (thumbnailIndex >= newImages.length) {
      setThumbnailIndex(Math.max(0, newImages.length - 1));
    } else if (thumbnailIndex === index && newImages.length > 0) {
      setThumbnailIndex(0);
    }
  };

  const handleSetThumbnail = (index) => {
    setThumbnailIndex(index);
  };

  const handleUrlTypeChange = (type) => {
    setUrlType(type);
    setUrl('');
  };

  const handleTechStackAdd = () => {
    if (techStackInput.trim() && !formData.techStack.includes(techStackInput.trim())) {
      setFormData({
        ...formData,
        techStack: [...formData.techStack, techStackInput.trim()],
      });
      setTechStackInput('');
    }
  };

  const handleTechStackRemove = (index) => {
    setFormData({
      ...formData,
      techStack: formData.techStack.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Compress and convert all images to base64
      const imageUrls = [];
      for (const imageFile of images) {
        try {
          const compressedBase64 = await compressImage(imageFile);
          imageUrls.push(compressedBase64);
        } catch (err) {
          console.error('Error compressing image:', err);
          throw new Error('Failed to process image');
        }
      }

      // Reorder images so thumbnail is first
      if (thumbnailIndex !== 0 && imageUrls.length > 0) {
        const thumbnail = imageUrls[thumbnailIndex];
        imageUrls.splice(thumbnailIndex, 1);
        imageUrls.unshift(thumbnail);
      }

      // Check total size
      const totalSize = imageUrls.reduce((sum, img) => sum + img.length, 0);
      if (totalSize > 900000) {
        throw new Error('Total image size is too large. Please reduce the number of images or their quality.');
      }

      // Prepare project data
      const projectData = {
        ...formData,
        imageUrls,
        imageUrl: imageUrls[0] || '',
        videoUrl: urlType === 'video' ? url.trim() : null,
        projectUrl: urlType === 'project' ? url.trim() : null,
      };

      // Add project to Firestore
      const result = await addProject(projectData);

      if (result.success) {
        if (onCancel) {
          onCancel();
        }
      } else {
        setError(result.error || 'Failed to add project');
      }
    } catch (error) {
      console.error('Error adding project:', error);
      setError(error.message || 'Failed to add project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-3 sm:space-x-4 mb-6 sm:mb-8">
          <button
            onClick={onCancel}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white truncate">
              Add New Project
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Create a new portfolio project
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="card space-y-4 sm:space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 sm:p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 rounded-lg text-red-700 dark:text-red-400 text-sm sm:text-base"
            >
              {error}
            </motion.div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Project Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="input-field text-sm sm:text-base"
              placeholder="My Awesome Project"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-2">
              Category *
            </label>
            {loadingServices ? (
              <div className="input-field flex items-center justify-center text-gray-500 dark:text-gray-400">
                <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                Loading categories...
              </div>
            ) : services.length > 0 ? (
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="input-field text-sm sm:text-base"
              >
                {services.map((service) => (
                  <option key={service.id} value={service.title}>
                    {service.title}
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-3 sm:p-4 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-600 rounded-lg text-yellow-700 dark:text-yellow-400 text-sm sm:text-base">
                No services found. Please add services first in the Services Management section.
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Short Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="3"
              className="input-field resize-none text-sm sm:text-base"
              placeholder="A brief description of your project"
            />
          </div>

          {/* Full Description */}
          <div>
            <label htmlFor="fullDescription" className="block text-sm font-medium mb-2">
              Full Description
            </label>
            <textarea
              id="fullDescription"
              name="fullDescription"
              value={formData.fullDescription}
              onChange={handleChange}
              rows="6"
              className="input-field resize-none text-sm sm:text-base"
              placeholder="Detailed description of your project"
            />
          </div>

          {/* Multiple Images Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Project Images * (Max 5, will be compressed)
            </label>
            
            {/* Upload Area */}
            <label className="flex flex-col items-center justify-center w-full h-32 sm:h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors mb-4">
              <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mb-2" />
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base text-center px-4">
                Click to upload images
              </p>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                PNG, JPG (Max 5 images, 5MB each)
              </p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImagesChange}
                className="hidden"
                disabled={images.length >= 5}
              />
            </label>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                <AnimatePresence>
                  {imagePreviews.map((preview, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative group"
                    >
                      <div className={`relative rounded-lg overflow-hidden border-2 ${
                        thumbnailIndex === index 
                          ? 'border-primary-500 dark:border-primary-400' 
                          : 'border-gray-200 dark:border-gray-700'
                      }`}>
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 sm:h-32 object-cover"
                        />
                        
                        {/* Thumbnail Badge */}
                        {thumbnailIndex === index && (
                          <div className="absolute top-1 left-1 bg-primary-600 text-white text-xs px-2 py-0.5 rounded flex items-center space-x-1">
                            <Star className="w-3 h-3 fill-current" />
                            <span>Thumbnail</span>
                          </div>
                        )}
                        
                        {/* Action Buttons */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100">
                          {thumbnailIndex !== index && (
                            <button
                              type="button"
                              onClick={() => handleSetThumbnail(index)}
                              className="p-1.5 sm:p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                              title="Set as thumbnail"
                            >
                              <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="p-1.5 sm:p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            title="Remove image"
                          >
                            <X className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1">
                        Image {index + 1}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
            
            {imagePreviews.length === 0 && (
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No images uploaded yet
              </p>
            )}
          </div>

          {/* URL Type Selection */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Link Type (Optional)
            </label>
            <div className="flex flex-col sm:flex-row gap-3 mb-3">
              <button
                type="button"
                onClick={() => handleUrlTypeChange('project')}
                className={`flex-1 p-3 sm:p-4 rounded-lg border-2 transition-all ${
                  urlType === 'project'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <ImageIcon className="w-5 h-5" />
                  <span className="font-medium text-sm sm:text-base">Project URL</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleUrlTypeChange('video')}
                className={`flex-1 p-3 sm:p-4 rounded-lg border-2 transition-all ${
                  urlType === 'video'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium text-sm sm:text-base">Video URL</span>
                </div>
              </button>
            </div>
            
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="input-field text-sm sm:text-base"
              placeholder={urlType === 'video' ? 'https://example.com/video.mp4' : 'https://example.com'}
            />
          </div>

          {/* Tech Stack */}
          <div>
            <label className="block text-sm font-medium mb-2">Tech Stack</label>
            <div className="flex flex-col sm:flex-row gap-2 mb-2">
              <input
                type="text"
                value={techStackInput}
                onChange={(e) => setTechStackInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleTechStackAdd();
                  }
                }}
                className="input-field flex-1 text-sm sm:text-base"
                placeholder="React, Node.js, etc."
              />
              <button
                type="button"
                onClick={handleTechStackAdd}
                className="btn-secondary px-4 py-2 text-sm sm:text-base whitespace-nowrap"
              >
                Add Tech
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.techStack.map((tech, index) => (
                <span
                  key={index}
                  className="px-2 sm:px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-lg flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
                >
                  <span className="break-all">{tech}</span>
                  <button
                    type="button"
                    onClick={() => handleTechStackRemove(index)}
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200 flex-shrink-0"
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary w-full sm:flex-1 py-2.5 text-sm sm:text-base order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || services.length === 0 || images.length === 0}
              className="btn-primary w-full sm:flex-1 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed py-2.5 text-sm sm:text-base order-1 sm:order-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Save Project</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProject;