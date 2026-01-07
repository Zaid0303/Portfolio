import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAbout, updateAbout } from '../firebase/firestoreServices';
import { pdfToBase64 } from '../firebase/imageUtils';
import { Save, Upload, FileText, Download, X } from 'lucide-react';

const CVManager = () => {
  const [cvUrl, setCvUrl] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadCV();
  }, []);

  const loadCV = async () => {
    setLoading(true);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('File size should be less than 10MB');
        return;
      }
      setCvFile(file);
      setError('');
    }
  };

  const handleRemoveFile = () => {
    setCvFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSaving(true);

    try {
      let newCvUrl = cvUrl;

      // Convert new CV to base64 if provided
      if (cvFile) {
        const base64Result = await pdfToBase64(cvFile);
        if (base64Result.success) {
          newCvUrl = base64Result.data;
        } else {
          throw new Error(base64Result.error || 'Failed to convert CV');
        }
      }

      // Update CV in Firestore (stored as base64)
      const result = await updateAbout({ cvUrl: newCvUrl });

      if (result.success) {
        setCvUrl(newCvUrl);
        setCvFile(null);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.error || 'Failed to update CV');
      }
    } catch (error) {
      console.error('Error updating CV:', error);
      setError(error.message || 'Failed to update CV');
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Loading CV...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          CV Management
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Upload and manage your resume/CV PDF file
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card space-y-6">
        {error && (
          <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 rounded-lg text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-600 rounded-lg text-green-700 dark:text-green-400">
            CV updated successfully!
          </div>
        )}

        {/* Current CV */}
        {cvUrl && (
          <div>
            <label className="block text-sm font-medium mb-4">Current CV</label>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <FileText className="w-10 h-10 text-primary-600 dark:text-primary-400" />
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">Resume.pdf</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  CV is currently uploaded
                </p>
              </div>
              <button
                type="button"
                onClick={handleDownload}
                className="btn-secondary flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex items-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>View</span>
              </a>
            </div>
          </div>
        )}

        {/* Upload New CV */}
        <div>
          <label className="block text-sm font-medium mb-4">
            {cvUrl ? 'Replace CV' : 'Upload CV'} (PDF only)
          </label>
          {cvFile ? (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <FileText className="w-10 h-10 text-primary-600 dark:text-primary-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {cvFile.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {(cvFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                Click to upload CV (PDF)
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                PDF format only (MAX. 10MB)
              </p>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving || !cvFile}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>{cvUrl ? 'Update CV' : 'Upload CV'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CVManager;

