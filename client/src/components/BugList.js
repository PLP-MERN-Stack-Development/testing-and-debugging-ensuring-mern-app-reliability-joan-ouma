import React, { useState } from 'react';

const BugList = ({ bugs, loading, onBugDeleted, onBugUpdated, onRefresh }) => {
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [editingBug, setEditingBug] = useState(null);

    // Filter bugs based on status and search term
    const filteredBugs = bugs.filter(bug => {
        const matchesFilter = filter === 'all' || bug.status === filter;
        const matchesSearch = bug.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            bug.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const handleDelete = async (bugId) => {
        if (window.confirm('Are you sure you want to delete this bug?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/bugs/${bugId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    onBugDeleted(bugId);
                } else {
                    alert('Failed to delete bug');
                }
            } catch (error) {
                console.error('Error deleting bug:', error);
                alert('Error deleting bug');
            }
        }
    };

    const handleStatusChange = async (bugId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:5000/api/bugs/${bugId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                const updatedBug = await response.json();
                onBugUpdated(updatedBug);
            } else {
                alert('Failed to update bug status');
            }
        } catch (error) {
            console.error('Error updating bug:', error);
            alert('Error updating bug status');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            open: 'bg-red-100 text-red-800',
            'in-progress': 'bg-blue-100 text-blue-800',
            resolved: 'bg-green-100 text-green-800',
            closed: 'bg-gray-100 text-gray-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getPriorityColor = (priority) => {
        const colors = {
            low: 'bg-green-100 text-green-800',
            medium: 'bg-yellow-100 text-yellow-800',
            high: 'bg-orange-100 text-orange-800',
            critical: 'bg-red-100 text-red-800',
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

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">All Bugs</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {filteredBugs.length} bug{filteredBugs.length !== 1 ? 's' : ''} found
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Search */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search bugs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>

                        {/* Status Filter */}
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Status</option>
                            <option value="open">Open</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                        </select>

                        {/* Refresh Button */}
                        <button
                            onClick={onRefresh}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            {/* Bugs List */}
            {filteredBugs.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <div className="text-gray-400 text-6xl mb-4">🐛</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No bugs found</h3>
                    <p className="text-gray-600 mb-4">
                        {searchTerm || filter !== 'all'
                            ? 'Try adjusting your search or filter criteria'
                            : 'No bugs have been reported yet'
                        }
                    </p>
                    {!searchTerm && filter === 'all' && (
                        <button
                            onClick={() => window.location.href = '/create-bug'}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Report First Bug
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredBugs.map((bug) => (
                        <div key={bug._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                {/* Bug Info */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                {bug.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm mb-2">
                                                {bug.bugNumber} • Reported {formatDate(bug.createdAt)}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(bug.priority)}`}>
                        {bug.priority}
                      </span>
                                            <select
                                                value={bug.status}
                                                onChange={(e) => handleStatusChange(bug._id, e.target.value)}
                                                className={`px-2 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-blue-500 ${getStatusColor(bug.status)}`}
                                            >
                                                <option value="open">Open</option>
                                                <option value="in-progress">In Progress</option>
                                                <option value="resolved">Resolved</option>
                                                <option value="closed">Closed</option>
                                            </select>
                                        </div>
                                    </div>

                                    <p className="text-gray-700 mb-3">{bug.description}</p>

                                    {/* Bug Metadata */}
                                    <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                                        <span>Type: {bug.type}</span>
                                        <span>•</span>
                                        <span>Severity: {bug.severity}</span>
                                        {bug.dueDate && (
                                            <>
                                                <span>•</span>
                                                <span>Due: {formatDate(bug.dueDate)}</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex lg:flex-col gap-2">
                                    <button
                                        onClick={() => handleStatusChange(bug._id,
                                            bug.status === 'open' ? 'in-progress' :
                                                bug.status === 'in-progress' ? 'resolved' : 'open'
                                        )}
                                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {bug.status === 'open' ? 'Start Work' :
                                            bug.status === 'in-progress' ? 'Mark Resolved' : 'Reopen'}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(bug._id)}
                                        className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BugList;