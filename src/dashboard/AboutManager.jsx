import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAbout, updateAbout } from '../firebase/firestoreServices';
import { imageToBase64 } from '../firebase/imageUtils';
import { Save, Upload, X, Plus, Github, Linkedin, Facebook, Instagram, Youtube, Twitter, Globe } from 'lucide-react';

const AboutManager = () => {
  const [formData, setFormData] = useState({
    text: '',
    skills: [],
    experience: {
      years: '5+',
      projects: '100+',
      clients: '50+',
    },
    email: '',
    phone: '',
    location: '',
    socialLinks: [],
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [skillInput, setSkillInput] = useState('');
  const [newSocialLink, setNewSocialLink] = useState({ platform: 'github', url: '' });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Social media platforms with icons
  const socialPlatforms = [
    { value: 'github', label: 'GitHub', icon: Github, placeholder: 'https://github.com/yourusername' },
    { value: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/in/yourusername' },
    { value: 'facebook', label: 'Facebook', icon: Facebook, placeholder: 'https://facebook.com/yourusername' },
    { value: 'instagram', label: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/yourusername' },
    { value: 'youtube', label: 'YouTube', icon: Youtube, placeholder: 'https://youtube.com/@yourusername' },
    { value: 'twitter', label: 'Twitter/X', icon: Twitter, placeholder: 'https://twitter.com/yourusername' },
    { value: 'website', label: 'Website', icon: Globe, placeholder: 'https://yourwebsite.com' },
  ];

  useEffect(() => {
    loadAboutData();
  }, []);

  const loadAboutData = async () => {
    setLoading(true);
    try {
      const result = await getAbout();
      if (result.success && result.data) {
        setFormData({
          text: result.data.text || '',
          skills: result.data.skills || [],
          experience: result.data.experience || {
            years: '5+',
            projects: '100+',
            clients: '50+',
          },
          email: result.data.email || '',
          phone: result.data.phone || '',
          location: result.data.location || '',
          socialLinks: result.data.socialLinks || [],
        });
        setImagePreview(result.data.profileImageUrl || null);
      }
    } catch (error) {
      console.error('Error loading about data:', error);
      setError('Failed to load about data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleExperienceChange = (field, value) => {
    setFormData({
      ...formData,
      experience: {
        ...formData.experience,
        [field]: value,
      },
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSkillAdd = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()],
      });
      setSkillInput('');
    }
  };

  const handleSkillRemove = (index) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index),
    });
  };

  const handleAddSocialLink = () => {
    if (newSocialLink.url.trim()) {
      // Check if platform already exists
      const existingIndex = formData.socialLinks.findIndex(
        link => link.platform === newSocialLink.platform
      );
      
      if (existingIndex >= 0) {
        // Update existing platform
        const updatedLinks = [...formData.socialLinks];
        updatedLinks[existingIndex] = { ...newSocialLink };
        setFormData({
          ...formData,
          socialLinks: updatedLinks,
        });
      } else {
        // Add new platform
        setFormData({
          ...formData,
          socialLinks: [...formData.socialLinks, { ...newSocialLink }],
        });
      }
      
      setNewSocialLink({ platform: 'github', url: '' });
    }
  };

  const handleRemoveSocialLink = (index) => {
    setFormData({
      ...formData,
      socialLinks: formData.socialLinks.filter((_, i) => i !== index),
    });
  };

  const getSocialIcon = (platform) => {
    const social = socialPlatforms.find(p => p.value === platform);
    return social ? social.icon : Globe;
  };

  const getSocialLabel = (platform) => {
    const social = socialPlatforms.find(p => p.value === platform);
    return social ? social.label : platform;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSaving(true);

    try {
      let profileImageUrl = formData.profileImageUrl || '';

      // Convert new image to base64 if provided
      if (imageFile) {
        const base64Result = await imageToBase64(imageFile);
        if (base64Result.success) {
          profileImageUrl = base64Result.data;
        } else {
          throw new Error(base64Result.error || 'Failed to convert image');
        }
      }

      // Prepare about data
      const aboutData = {
        ...formData,
        profileImageUrl,
      };

      // Update about in Firestore
      const result = await updateAbout(aboutData);

      if (result.success) {
        setSuccess(true);
        setImageFile(null);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.error || 'Failed to update about section');
      }
    } catch (error) {
      console.error('Error updating about:', error);
      setError(error.message || 'Failed to update about section');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            About Me Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Update your professional profile and information
          </p>
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

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 sm:p-4 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-600 rounded-lg text-green-700 dark:text-green-400 text-sm sm:text-base"
            >
              About section updated successfully!
            </motion.div>
          )}

          {/* Profile Image */}
          <div>
            <label className="block text-sm font-medium mb-2">Profile Image</label>
            {imagePreview ? (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 object-cover rounded-lg border-4 border-gray-200 dark:border-gray-700"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-1 right-1 sm:top-2 sm:right-2 p-1.5 sm:p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                {!imageFile && (
                  <label className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 p-1.5 sm:p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Upload className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-400 mb-2 sm:mb-4" />
                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm text-center px-2 sm:px-4">
                  Upload Profile Image
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* About Text */}
          <div>
            <label htmlFor="text" className="block text-sm font-medium mb-2">
              About Text *
            </label>
            <textarea
              id="text"
              name="text"
              value={formData.text}
              onChange={handleChange}
              required
              rows="6"
              className="input-field resize-none text-sm sm:text-base"
              placeholder="Write about yourself, your experience, and expertise..."
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium mb-2">Skills</label>
            <div className="flex flex-col sm:flex-row gap-2 mb-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSkillAdd();
                  }
                }}
                className="input-field flex-1 text-sm sm:text-base"
                placeholder="Graphic Designing, Web Development, etc."
              />
              <button
                type="button"
                onClick={handleSkillAdd}
                className="btn-secondary px-4 py-2 text-sm sm:text-base whitespace-nowrap"
              >
                Add Skill
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-2 sm:px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-lg flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
                >
                  <span className="break-all">{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleSkillRemove(index)}
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200 flex-shrink-0"
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-medium mb-3 sm:mb-4">Experience</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Years</label>
                <input
                  type="text"
                  value={formData.experience.years}
                  onChange={(e) => handleExperienceChange('years', e.target.value)}
                  className="input-field text-sm sm:text-base"
                  placeholder="5+"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Projects</label>
                <input
                  type="text"
                  value={formData.experience.projects}
                  onChange={(e) => handleExperienceChange('projects', e.target.value)}
                  className="input-field text-sm sm:text-base"
                  placeholder="100+"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Clients</label>
                <input
                  type="text"
                  value={formData.experience.clients}
                  onChange={(e) => handleExperienceChange('clients', e.target.value)}
                  className="input-field text-sm sm:text-base"
                  placeholder="50+"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <label className="block text-sm font-medium mb-3 sm:mb-4">Contact Information</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field text-sm sm:text-base"
                  placeholder="contact@example.com"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field text-sm sm:text-base"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="location" className="block text-sm font-medium mb-2">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="input-field text-sm sm:text-base"
                  placeholder="Available Worldwide"
                />
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div>
            <label className="block text-sm font-medium mb-3 sm:mb-4">Social Media Links</label>
            
            {/* Add New Social Link */}
            <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex flex-col gap-2 sm:gap-3">
                <select
                  value={newSocialLink.platform}
                  onChange={(e) => setNewSocialLink({ ...newSocialLink, platform: e.target.value })}
                  className="input-field text-sm sm:text-base"
                >
                  {socialPlatforms.map((platform) => (
                    <option key={platform.value} value={platform.value}>
                      {platform.label}
                    </option>
                  ))}
                </select>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    value={newSocialLink.url}
                    onChange={(e) => setNewSocialLink({ ...newSocialLink, url: e.target.value })}
                    className="input-field flex-1 text-sm sm:text-base"
                    placeholder={socialPlatforms.find(p => p.value === newSocialLink.platform)?.placeholder}
                  />
                  <button
                    type="button"
                    onClick={handleAddSocialLink}
                    className="btn-primary flex items-center justify-center space-x-2 px-4 py-2 text-sm sm:text-base whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Add Link</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Display Added Social Links */}
            <div className="space-y-2">
              {formData.socialLinks.map((link, index) => {
                const Icon = getSocialIcon(link.platform);
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-xs sm:text-sm text-gray-900 dark:text-white">
                          {getSocialLabel(link.platform)}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                          {link.url}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSocialLink(index)}
                      className="p-1.5 sm:p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg ml-2 flex-shrink-0 transition-colors"
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {formData.socialLinks.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4 text-xs sm:text-sm">
                No social media links added yet
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="btn-primary w-full sm:w-auto flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2.5 text-sm sm:text-base"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutManager;