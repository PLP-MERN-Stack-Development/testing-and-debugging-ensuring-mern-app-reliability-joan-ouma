import React, { useState } from 'react';

const Projects = () => {
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
            bugCount: 12
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
            bugCount: 8
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
            bugCount: 5
        },
        {
            _id: '4',
            name: 'Database Optimization',
            key: 'DB',
            description: 'Performance optimization and query improvements',
            status: 'completed',
            owner: 'Sarah Tester',
            members: ['Sarah Tester'],
            createdAt: '2023-12-10',
            bugCount: 3
        }
    ]);

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newProject, setNewProject] = useState({
        name: '',
        key: '',
        description: '',
        status: 'active'
    });

    const handleCreateProject = (e) => {
        e.preventDefault();
        const project = {
            ...newProject,
            _id: Date.now().toString(),
            owner: 'Current User',
            members: ['Current User'],
            createdAt: new Date().toISOString().split('T')[0],
            bugCount: 0
        };
        setProjects([project, ...projects]);
        setNewProject({ name: '', key: '', description: '', status: 'active' });
        setShowCreateForm(false);
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Manage your projects and track their progress
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Project
                    </button>
                </div>
            </div>

            {/* Create Project Form */}
            {showCreateForm && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Project</h3>
                    <form onSubmit={handleCreateProject} className="space-y-4">
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
                                placeholder="Describe the project..."
                            />
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setShowCreateForm(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Create Project
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
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                                <p className="text-sm text-gray-500 font-mono">{project.key}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
                        </div>

                        <p className="text-gray-600 text-sm mb-4">{project.description}</p>

                        <div className="space-y-3 text-sm text-gray-600">
                            <div className="flex justify-between">
                                <span>Owner:</span>
                                <span className="font-medium">{project.owner}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Members:</span>
                                <span className="font-medium">{project.members.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Bugs:</span>
                                <span className="font-medium">{project.bugCount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Created:</span>
                                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-200">
                            <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                                View Bugs
                            </button>
                            <button className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50">
                                Edit
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
                    <p className="text-gray-600 mb-4">Create your first project to start tracking bugs</p>
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Create Project
                    </button>
                </div>
            )}
        </div>
    );
};

export default Projects;