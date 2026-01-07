import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getServices, addService, updateService, deleteService } from '../firebase/firestoreServices';
import { detectIconNameFromTitle } from '../utils/iconDetector';
import { Plus, Edit, Trash2, Save, X, Code, Palette, Smartphone, Video } from 'lucide-react';

const ServicesManager = () => {
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'Code',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const icons = [
    { value: 'Code', label: 'Code', component: Code },
    { value: 'Palette', label: 'Palette', component: Palette },
    { value: 'Smartphone', label: 'Smartphone', component: Smartphone },
    { value: 'Video', label: 'Video', component: Video },
  ];

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    try {
      const result = await getServices();
      if (result.success && result.data) {
        setServices(result.data);
      }
    } catch (error) {
      console.error('Error loading services:', error);
      setError('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const newFormData = {
      ...formData,
      [e.target.name]: e.target.value,
    };
    
    // Auto-detect icon when title changes
    if (e.target.name === 'title' && e.target.value.trim()) {
      const detectedIcon = detectIconNameFromTitle(e.target.value);
      newFormData.icon = detectedIcon;
    }
    
    setFormData(newFormData);
    setError('');
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title || '',
      description: service.description || '',
      icon: service.icon || 'Code',
    });
  };

  const handleCancel = () => {
    setEditingService(null);
    setFormData({
      title: '',
      description: '',
      icon: 'Code',
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      if (editingService && editingService.id) {
        // Update existing service
        const result = await updateService(editingService.id, formData);
        if (result.success) {
          setServices(
            services.map((s) => (s.id === editingService.id ? { ...editingService, ...formData } : s))
          );
          handleCancel();
        } else {
          setError(result.error || 'Failed to update service');
        }
      } else {
        // Add new service
        const result = await addService(formData);
        if (result.success) {
          await loadServices();
          handleCancel();
        } else {
          setError(result.error || 'Failed to add service');
        }
      }
    } catch (error) {
      console.error('Error saving service:', error);
      setError(error.message || 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) {
      return;
    }

    try {
      const result = await deleteService(serviceId);
      if (result.success) {
        setServices(services.filter((s) => s.id !== serviceId));
      } else {
        alert('Error deleting service: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Error deleting service');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Loading services...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Services Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your portfolio services (icon auto-detects from title)
          </p>
        </div>
        {!editingService && (
          <button
            onClick={() => setEditingService({ id: null })}
            className="btn-primary flex items-center space-x-2 mt-4 sm:mt-0"
          >
            <Plus className="w-5 h-5" />
            <span>Add Service</span>
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {editingService !== null && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {editingService && editingService.id ? 'Edit Service' : 'Add New Service'}
            </h2>
            <button
              onClick={handleCancel}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 rounded-lg text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Service Title * (Icon auto-detects from title)
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Web Development"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="3"
                className="input-field resize-none"
                placeholder="Service description..."
              />
            </div>

            <div>
              <label htmlFor="icon" className="block text-sm font-medium mb-2">
                Icon * (Auto-detected, can change manually)
              </label>
              <select
                id="icon"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                required
                className="input-field"
              >
                {icons.map((icon) => (
                  <option key={icon.value} value={icon.value}>
                    {icon.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving}
                className="btn-primary flex-1 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>{editingService && editingService.id ? 'Update' : 'Add'} Service</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Services List */}
      {services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const IconComponent = icons.find((i) => i.value === service.icon)?.component || Code;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="p-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/50"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">💼</div>
          <h3 className="text-2xl font-bold mb-2">No services yet</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Get started by adding your first service
          </p>
          <button
            onClick={() => setEditingService({ id: null })}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Service</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ServicesManager;