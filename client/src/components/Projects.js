import React, { useState } from 'react';

const Projects = ({ user, onNavigate }) => {
    const [projects, setProjects] = useState([
        {
            _id: '1',
            name: 'Website Redesign',
            key: 'WEB',
            description: 'Complete redesign of company website with modern UI/UX',
            status: 'active',
            owner: 'John Developer',
            members: ['John Developer', 'Sarah Tester', 'Mike Manager'],
            createdAt: '2024-01-15',
            bugCount: 12,
            bugs: [
                { id: 'WEB-001', title: 'Homepage loading slow', status: 'open', priority: 'high' },
                { id: 'WEB-002', title: 'Mobile menu not working', status: 'in-progress', priority: 'medium' },
                { id: 'WEB-003', title: 'Contact form validation broken', status: 'open', priority: 'critical' },
                { id: 'WEB-004', title: 'Image optimization needed', status: 'resolved', priority: 'low' }
            ]
        },
        {
            _id: '2',
            name: 'Mobile App',
            key: 'MOB',
            description: 'Cross-platform mobile application development',
            status: 'active',
            owner: 'Alice Admin',
            members: ['Alice Admin', 'John Developer'],
            createdAt: '2024-02-01',
            bugCount: 8,
            bugs: [
                { id: 'MOB-001', title: 'App crashes on startup', status: 'open', priority: 'critical' },
                { id: 'MOB-002', title: 'Push notifications not working', status: 'in-progress', priority: 'high' },
                { id: 'MOB-003', title: 'UI alignment issues on Android', status: 'open', priority: 'medium' }
            ]
        },
        {
            _id: '3',
            name: 'API Development',
            key: 'API',
            description: 'Backend API services and microservices',
            status: 'in-progress',
            owner: 'Mike Manager',
            members: ['Mike Manager', 'John Developer'],
            createdAt: '2024-01-20',
            bugCount: 5,
            bugs: [
                { id: 'API-001', title: 'Authentication endpoint timeout', status: 'open', priority: 'high' },
                { id: 'API-002', title: 'Database connection pooling issue', status: 'in-progress', priority: 'critical' }
            ]
        }
    ]);

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [newProject, setNewProject] = useState({
        name: '',
        key: '',
        description: '',
        status: 'active',
        bugCount: 0  // Added bug count field
    });

    // Debug logging
    const DEBUG = true;
    const log = (message, data = null) => {
        if (DEBUG) {
            console.log(`📁 [PROJECTS DEBUG] ${message}`, data || '');
        }
    };

    const handleCreateProject = (e) => {
        e.preventDefault();

        // Generate sample bugs based on the bug count
        const sampleBugs = generateSampleBugs(newProject.bugCount, newProject.key);

        const project = {
            ...newProject,
            _id: Date.now().toString(),
            owner: `${user.firstName} ${user.lastName}`,
            members: [`${user.firstName} ${user.lastName}`],
            createdAt: new Date().toISOString().split('T')[0],
            bugs: sampleBugs,
            // Ensure bugCount matches the actual number of bugs
            bugCount: sampleBugs.length
        };

        log('Creating new project', { project });
        setProjects([project, ...projects]);
        setNewProject({ name: '', key: '', description: '', status: 'active', bugCount: 0 });
        setShowCreateForm(false);
    };

    const handleEditProject = (project) => {
        log('Editing project', { projectId: project._id });
        setEditingProject(project);
        setNewProject({
            name: project.name,
            key: project.key,
            description: project.description,
            status: project.status,
            bugCount: project.bugCount
        });
        setShowCreateForm(true);
    };

    const handleUpdateProject = (e) => {
        e.preventDefault();
        log('Updating project', { projectId: editingProject._id, updates: newProject });

        // Update bugs array when bug count changes
        const updatedProject = {
            ...editingProject,
            ...newProject,
            bugs: editingProject.bugs || generateSampleBugs(newProject.bugCount, newProject.key),
            bugCount: newProject.bugCount
        };

        setProjects(projects.map(project =>
            project._id === editingProject._id ? updatedProject : project
        ));

        setEditingProject(null);
        setNewProject({ name: '', key: '', description: '', status: 'active', bugCount: 0 });
        setShowCreateForm(false);
    };

    const handleDeleteProject = (projectId) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            log('Deleting project', { projectId });
            setProjects(projects.filter(project => project._id !== projectId));
        }
    };

    // Generate sample bugs for new projects
    const generateSampleBugs = (count, projectKey) => {
        if (count <= 0) return [];

        const bugTemplates = [
            { title: 'Performance issues detected', status: 'open', priority: 'high' },
            { title: 'UI/UX improvements needed', status: 'open', priority: 'medium' },
            { title: 'Database query optimization', status: 'in-progress', priority: 'high' },
            { title: 'API endpoint returning 500 error', status: 'open', priority: 'critical' },
            { title: 'Mobile responsive layout broken', status: 'in-progress', priority: 'medium' },
            { title: 'Security vulnerability found', status: 'open', priority: 'critical' },
            { title: 'Third-party integration failing', status: 'resolved', priority: 'high' },
            { title: 'Memory leak in background process', status: 'open', priority: 'critical' },
            { title: 'User authentication flow broken', status: 'in-progress', priority: 'high' },
            { title: 'Data validation missing', status: 'open', priority: 'medium' }
        ];

        return bugTemplates.slice(0, count).map((bug, index) => ({
            id: `${projectKey}-${(index + 1).toString().padStart(3, '0')}`,
            title: bug.title,
            status: bug.status,
            priority: bug.priority,
            createdAt: new Date().toISOString()
        }));
    };

    const handleViewBugs = (project) => {
        log('Viewing bugs for project', {
            projectId: project._id,
            projectKey: project.key,
            bugCount: project.bugs?.length
        });

        // Store the entire project bugs data for BugList to use
        localStorage.setItem('projectBugsData', JSON.stringify({
            projectKey: project.key,
            projectName: project.name,
            bugs: project.bugs || []
        }));

        // Navigate to bugs page
        if (onNavigate) {
            log('Navigating to bugs page via onNavigate');
            onNavigate('bugs');
        } else {
            log('onNavigate not provided, using fallback');
            window.location.href = '/bugs';
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            active: 'bg-green-100 text-green-800',
            'in-progress': 'bg-blue-100 text-blue-800',
            completed: 'bg-gray-100 text-gray-800',
            archived: 'bg-yellow-100 text-yellow-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusIcon = (status) => {
        const icons = {
            active: '🟢',
            'in-progress': '🟡',
            completed: '✅',
            archived: '📁'
        };
        return icons[status] || '📝';
    };

    const getPriorityColor = (priority) => {
        const colors = {
            critical: 'bg-red-100 text-red-800',
            high: 'bg-orange-100 text-orange-800',
            medium: 'bg-yellow-100 text-yellow-800',
            low: 'bg-green-100 text-green-800'
        };
        return colors[priority] || 'bg-gray-100 text-gray-800';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Manage your projects and track their progress. Total: {projects.length} project{projects.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingProject(null);
                            setNewProject({ name: '', key: '', description: '', status: 'active', bugCount: 0 });
                            setShowCreateForm(true);
                        }}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Project
                    </button>
                </div>
            </div>

            {/* Create/Edit Project Form */}
            {showCreateForm && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {editingProject ? 'Edit Project' : 'Create New Project'}
                    </h3>
                    <form onSubmit={editingProject ? handleUpdateProject : handleCreateProject} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Project Name *
                                </label>
                                <input
                                    type="text"
                                    value={newProject.name}
                                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter project name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Project Key *
                                </label>
                                <input
                                    type="text"
                                    value={newProject.key}
                                    onChange={(e) => setNewProject({ ...newProject, key: e.target.value.toUpperCase() })}
                                    required
                                    maxLength="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="3-letter key (e.g., WEB)"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                value={newProject.description}
                                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Describe the project goals, scope, and objectives..."
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    value={newProject.status}
                                    onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="active">Active</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Initial Bug Count
                                </label>
                                <input
                                    type="number"
                                    value={newProject.bugCount}
                                    onChange={(e) => setNewProject({ ...newProject, bugCount: parseInt(e.target.value) || 0 })}
                                    min="0"
                                    max="50"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Number of sample bugs to create"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {newProject.bugCount > 0 ? `Will create ${newProject.bugCount} sample bugs` : 'No bugs will be created'}
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowCreateForm(false);
                                    setEditingProject(null);
                                    setNewProject({ name: '', key: '', description: '', status: 'active', bugCount: 0 });
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                {editingProject ? 'Update Project' : 'Create Project'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div key={project._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-lg">{getStatusIcon(project.status)}</span>
                                    <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                                </div>
                                <p className="text-sm text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                                    {project.key}
                                </p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
                        </div>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>

                        <div className="space-y-3 text-sm text-gray-600 mb-4">
                            <div className="flex justify-between">
                                <span>Owner:</span>
                                <span className="font-medium">{project.owner}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Team Members:</span>
                                <span className="font-medium">{project.members.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Total Bugs:</span>
                                <span className={`font-medium ${project.bugCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {project.bugCount} bug{project.bugCount !== 1 ? 's' : ''}
                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Created:</span>
                                <span>{formatDate(project.createdAt)}</span>
                            </div>
                        </div>

                        {/* Recent Bugs Preview */}
                        {project.bugs && project.bugs.length > 0 && (
                            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs font-medium text-gray-700 mb-2">
                                    Recent Bugs ({project.bugs.length} total):
                                </p>
                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                    {project.bugs.slice(0, 4).map((bug, index) => (
                                        <div key={index} className="flex items-center justify-between text-xs p-2 bg-white rounded border">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1 mb-1">
                                                    <span className="font-mono text-gray-500">{bug.id}</span>
                                                    <span className={`px-1 rounded text-xs ${getPriorityColor(bug.priority)}`}>
                            {bug.priority}
                          </span>
                                                </div>
                                                <p className="text-gray-600 truncate">{bug.title}</p>
                                            </div>
                                            <span className={`px-2 py-1 rounded text-xs whitespace-nowrap ${
                                                bug.status === 'open' ? 'bg-red-100 text-red-800' :
                                                    bug.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-green-100 text-green-800'
                                            }`}>
                        {bug.status}
                      </span>
                                        </div>
                                    ))}
                                    {project.bugs.length > 4 && (
                                        <p className="text-xs text-gray-500 text-center mt-1">
                                            +{project.bugs.length - 4} more bugs...
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex space-x-2 pt-4 border-t border-gray-200">
                            <button
                                onClick={() => handleViewBugs(project)}
                                disabled={!project.bugs || project.bugs.length === 0}
                                className={`flex-1 px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                                    project.bugs && project.bugs.length > 0
                                        ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                View {project.bugCount} Bugs
                            </button>
                            <button
                                onClick={() => handleEditProject(project)}
                                className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDeleteProject(project._id)}
                                className="px-3 py-2 border border-red-300 text-red-700 text-sm rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {projects.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <div className="text-gray-400 text-6xl mb-4">📁</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                    <p className="text-gray-600 mb-4">Create your first project to start organizing your work</p>
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Create Your First Project
                    </button>
                </div>
            )}
        </div>
    );
};

export default Projects;