import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { personService } from '../services/api';
import { 
    Users, 
    UserPlus, 
    Shield, 
    BarChart3, 
    Settings,
    TrendingUp,
    Activity
} from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [peopleCount, setPeopleCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPeopleCount();
    }, []);

    const loadPeopleCount = async () => {
        try {
            const people = await personService.getAll();
            setPeopleCount(Array.isArray(people) ? people.length : 0);
        } catch (error) {
            console.error('Failed to load people count:', error);
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        {
            name: 'Total People',
            value: loading ? '...' : peopleCount,
            icon: Users,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            name: 'Active Users',
            value: '12',
            icon: Activity,
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50'
        },
        {
            name: 'Admin Access',
            value: 'Full',
            icon: Shield,
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-50'
        },
        {
            name: 'System Status',
            value: 'Online',
            icon: TrendingUp,
            color: 'from-pink-500 to-pink-600',
            bgColor: 'bg-pink-50'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome, {user?.username}!
                    </h1>
                    <p className="text-gray-600">Admin Dashboard - Manage your system</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className={`${stat.bgColor} rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">
                                        {stat.name}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {stat.value}
                                    </p>
                                </div>
                                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <UserPlus className="w-5 h-5 mr-3 text-blue-600" />
                            <span className="font-medium">Add New Person</span>
                        </button>
                        <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <BarChart3 className="w-5 h-5 mr-3 text-green-600" />
                            <span className="font-medium">View Reports</span>
                        </button>
                        <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <Settings className="w-5 h-5 mr-3 text-purple-600" />
                            <span className="font-medium">System Settings</span>
                        </button>
                    </div>
                </div>

                {/* Person Management Section */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Person Management</h2>
                    <p className="text-gray-600 mb-4">Use the Person menu item to manage people records.</p>
                    <Link 
                        to="/admin/person"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Go to Person Management
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
