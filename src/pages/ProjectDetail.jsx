import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getProject, getProjects } from '../firebase/firestoreServices';
import { ArrowLeft, Calendar, Tag, Code, ExternalLink, Play, Image as ImageIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
      const result = await getProject(id);
      if (result.success && result.data) {
        setProject(result.data);
        // Auto-show video if video URL exists
        setShowVideo(!!result.data.videoUrl);
        loadRelatedProjects(result.data.category, id);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error loading project:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedProjects = async (category, currentId) => {
    try {
      const result = await getProjects(category);
      if (result.success && result.data) {
        const related = result.data
          .filter((p) => p.id !== currentId)
          .slice(0, 3);
        setRelatedProjects(related);
      }
    } catch (error) {
      console.error('Error loading related projects:', error);
    }
  };

  // Function to get embed URL for various video platforms
  const getEmbedUrl = (url) => {
    if (!url) return null;

    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be') 
        ? url.split('youtu.be/')[1]?.split('?')[0]
        : url.split('v=')[1]?.split('&')[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}` : null;
    }

    // Vimeo
    if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return videoId ? `https://player.vimeo.com/video/${videoId}?autoplay=1&loop=1` : null;
    }

    // Instagram
    if (url.includes('instagram.com')) {
      return `${url}embed/`;
    }

    // TikTok
    if (url.includes('tiktok.com')) {
      return url.replace('/video/', '/embed/');
    }

    // Facebook
    if (url.includes('facebook.com') || url.includes('fb.watch')) {
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&autoplay=true`;
    }

    // Direct video file (mp4, webm, etc.)
    if (url.match(/\.(mp4|webm|ogg|mov)$/i)) {
      return url;
    }

    // Default: return original URL
    return url;
  };

  const embedUrl = project?.videoUrl ? getEmbedUrl(project.videoUrl) : null;
  const isDirectVideo = embedUrl && embedUrl.match(/\.(mp4|webm|ogg|mov)$/i);

  const images = project?.imageUrls || (project?.imageUrl ? [project.imageUrl] : []);

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const openLightbox = (index) => {
    setSelectedImageIndex(index);
    setShowLightbox(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6 sm:mb-8"
        >
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Back to Portfolio</span>
          </Link>
        </motion.div>

        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-12"
        >
          <div className="flex items-center space-x-3 mb-4">
            <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full font-medium text-sm sm:text-base">
              {project.category}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            {project.description}
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Left: Image/Video */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            {/* Video or Images Toggle */}
            {project.videoUrl && images.length > 0 && (
              <div className="flex gap-2 sm:gap-3 mb-4">
                <button
                  onClick={() => setShowVideo(true)}
                  className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition-all text-sm sm:text-base ${
                    showVideo
                      ? 'bg-primary-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
                  Video
                </button>
                <button
                  onClick={() => setShowVideo(false)}
                  className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition-all text-sm sm:text-base ${
                    !showVideo
                      ? 'bg-primary-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
                  Images ({images.length})
                </button>
              </div>
            )}

            {/* Video Player */}
            {showVideo && project.videoUrl ? (
              <div className="card p-0 overflow-hidden bg-black">
                {isDirectVideo ? (
                  // Direct video file (MP4, WebM, etc.)
                  <video
                    src={embedUrl}
                    controls
                    autoPlay
                    loop
                    playsInline
                    className="w-full min-h-[400px] sm:min-h-[500px] md:min-h-[600px] object-contain rounded-lg"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  // Embedded video from platforms (YouTube, Vimeo, Instagram, TikTok, etc.)
                  <iframe
                    src={embedUrl}
                    className="w-full min-h-[400px] sm:min-h-[500px] md:min-h-[600px] rounded-lg"
                    style={{ aspectRatio: '16/9' }}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={project.title}
                  ></iframe>
                )}
                <p className="text-center text-xs sm:text-sm text-gray-400 dark:text-gray-500 py-2 bg-gray-900">
                  {project.title}
                </p>
              </div>
            ) : images.length > 0 ? (
              <>
                {/* Main Image */}
                <div className="card p-0 overflow-hidden mb-4">
                  <div className="relative group">
                    <img
                      src={images[selectedImageIndex]}
                      alt={`${project.title} - Image ${selectedImageIndex + 1}`}
                      className="w-full h-auto rounded-lg cursor-pointer"
                      onClick={() => openLightbox(selectedImageIndex)}
                    />
                    
                    {/* Navigation Arrows (if multiple images) */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevImage}
                          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    {images.length > 1 && (
                      <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 px-2 sm:px-3 py-1 sm:py-1.5 bg-black/70 text-white rounded-lg text-xs sm:text-sm">
                        {selectedImageIndex + 1} / {images.length}
                      </div>
                    )}
                  </div>
                </div>

                {/* Thumbnail Gallery */}
                {images.length > 1 && (
                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 sm:gap-3">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImageIndex === index
                            ? 'border-primary-500 scale-105'
                            : 'border-gray-300 dark:border-gray-600 hover:border-primary-300'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-16 sm:h-20 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="card p-0 overflow-hidden">
                <div className="w-full h-64 sm:h-96 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-lg">
                  <span className="text-4xl sm:text-6xl">🖼️</span>
                </div>
              </div>
            )}
          </motion.div>

          {/* Right: Project Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4 sm:space-y-6"
          >
            {/* Project Details Card */}
            <div className="card">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Project Details</h3>
              <div className="space-y-3 sm:space-y-4">
                {/* Category */}
                <div className="flex items-start space-x-3">
                  <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 dark:text-primary-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Category</div>
                    <div className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">{project.category}</div>
                  </div>
                </div>

                {/* Date */}
                {project.createdAt && (
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 dark:text-primary-400 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Date</div>
                      <div className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                        {new Date(project.createdAt.seconds * 1000).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tech Stack */}
            {project.techStack && project.techStack.length > 0 && (
              <div className="card">
                <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                  <Code className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 dark:text-primary-400" />
                  <h3 className="text-xl sm:text-2xl font-bold">Tech Stack</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 sm:px-3 py-1 sm:py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-lg font-medium text-xs sm:text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* External Link */}
            {project.projectUrl && (
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>View Project</span>
              </a>
            )}
          </motion.div>
        </div>

        {/* Full Description */}
        {project.fullDescription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card mb-8 sm:mb-12"
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-4">About This Project</h3>
            <div
              className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base"
              dangerouslySetInnerHTML={{ __html: project.fullDescription }}
            />
          </motion.div>
        )}

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 sm:mt-16"
          >
            <h3 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Related Projects</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {relatedProjects.map((relatedProject) => (
                <Link
                  key={relatedProject.id}
                  to={`/project/${relatedProject.id}`}
                  className="card group hover:border-primary-500 dark:hover:border-primary-400 border-2 border-transparent transition-all duration-300"
                >
                  {relatedProject.imageUrl ? (
                    <img
                      src={relatedProject.imageUrl}
                      alt={relatedProject.title}
                      className="w-full h-40 sm:h-48 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-40 sm:h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                      <span className="text-3xl sm:text-4xl">🖼️</span>
                    </div>
                  )}
                  <h4 className="text-lg sm:text-xl font-bold mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {relatedProject.title}
                  </h4>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 line-clamp-2">
                    {relatedProject.description}
                  </p>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {showLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setShowLightbox(false)}
          >
            <button
              onClick={() => setShowLightbox(false)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <div className="relative max-w-7xl w-full" onClick={(e) => e.stopPropagation()}>
              <img
                src={images[selectedImageIndex]}
                alt={`${project.title} - Full size`}
                className="w-full h-auto max-h-[90vh] object-contain"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/70 text-white rounded-lg">
                    {selectedImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetail;