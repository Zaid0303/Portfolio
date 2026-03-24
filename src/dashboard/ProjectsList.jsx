import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getProjects, deleteProject } from '../firebase/firestoreServices';
import { Plus, Edit, Trash2, Image as ImageIcon, Eye, Search } from 'lucide-react';

const ProjectsList = ({ onEdit }) => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProjects(projects);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = projects.filter(
        (p) =>
          (p.title && p.title.toLowerCase().includes(query)) ||
          (p.category && p.category.toLowerCase().includes(query)) ||
          (p.description && p.description.toLowerCase().includes(query))
      );
      setFilteredProjects(filtered);
    }
  }, [searchQuery, projects]);

  const loadProjects = async () => {
    try {
      const result = await getProjects();
      if (result.success && result.data) {
        setProjects(result.data);
        setFilteredProjects(result.data);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    setDeleting(projectId);
    try {
      const result = await deleteProject(projectId);
      if (result.success) {
        const updatedProjects = projects.filter((p) => p.id !== projectId);
        setProjects(updatedProjects);
        setFilteredProjects(updatedProjects);
      } else {
        alert('Error deleting project: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Loading projects...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Projects Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your portfolio projects
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64 mb-2 sm:mb-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => onEdit(null)}
            className="btn-primary flex items-center justify-center space-x-2 py-2 px-4"
          >
            <Plus className="w-5 h-5" />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card group bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
            >
              {/* Image with 16:9 Aspect Ratio */}
              <div className="relative w-full aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-700 mb-4 overflow-hidden">
                {project.imageUrl ? (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                {project.category && (
                  <div className="absolute top-2 right-2 px-2 py-1 bg-primary-600 text-white text-xs rounded">
                    {project.category}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-between px-4 pb-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                    {project.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                  <button
                    onClick={() => window.open(`/project/${project.id}`, '_blank')}
                    className="flex-1 btn-secondary flex items-center justify-center space-x-2 text-sm py-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => onEdit(project)}
                    className="flex-1 btn-secondary flex items-center justify-center space-x-2 text-sm py-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    disabled={deleting === project.id}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleting === project.id ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-2xl font-bold mb-2">No projects found</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Try adjusting your search or add a new project
          </p>
          <button onClick={() => onEdit(null)} className="btn-primary inline-flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Add Project</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectsList;