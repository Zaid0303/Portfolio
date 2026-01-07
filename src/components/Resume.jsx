import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAbout } from '../firebase/firestoreServices';
import { Download, FileText } from 'lucide-react';

const Resume = () => {
  const [cvUrl, setCvUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCV();
  }, []);

  const loadCV = async () => {
    try {
      const result = await getAbout();
      if (result.success && result.data?.cvUrl) {
        setCvUrl(result.data.cvUrl);
      }
    } catch (error) {
      console.error('Error loading CV:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (cvUrl) {
      // Check if it's base64 or URL
      if (cvUrl.startsWith('data:')) {
        // Base64 data URL
        const link = document.createElement('a');
        link.href = cvUrl;
        link.download = 'Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Regular URL
        const link = document.createElement('a');
        link.href = cvUrl;
        link.download = 'Resume.pdf';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  return (
    <section id="resume" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            My <span className="text-primary-600 dark:text-primary-400">Resume</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-600 to-purple-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Download my resume to learn more about my experience and skills
          </p>
        </motion.div>

        {/* CV Preview Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="card">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Left: Preview/Icon */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-purple-400 rounded-2xl transform rotate-6"></div>
                  <div className="relative w-64 h-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex items-center justify-center border-4 border-white dark:border-gray-800">
                    {cvUrl ? (
                      <iframe
                        src={cvUrl}
                        className="w-full h-full rounded-lg"
                        title="CV Preview"
                      ></iframe>
                    ) : (
                      <div className="text-center p-8">
                        <FileText className="w-20 h-20 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">
                          CV preview will appear here
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Download Section */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Download Resume</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Get a copy of my resume to review my professional background, skills, and experience.
                  </p>
                </div>

                {cvUrl ? (
                  <button
                    onClick={handleDownload}
                    className="btn-primary w-full flex items-center justify-center space-x-2 group"
                  >
                    <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>Download CV (PDF)</span>
                  </button>
                ) : (
                  <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-600 rounded-lg text-yellow-700 dark:text-yellow-400">
                    CV is not available yet. Please check back later.
                  </div>
                )}

                <div className="pt-6 space-y-4">
                  <h4 className="font-semibold text-lg">What's Included:</h4>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start space-x-2">
                      <span className="text-primary-600 dark:text-primary-400 mt-1">✓</span>
                      <span>Professional Experience</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-primary-600 dark:text-primary-400 mt-1">✓</span>
                      <span>Technical Skills</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-primary-600 dark:text-primary-400 mt-1">✓</span>
                      <span>Education & Certifications</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-primary-600 dark:text-primary-400 mt-1">✓</span>
                      <span>Portfolio Highlights</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Resume;

