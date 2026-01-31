import { useState } from 'react';
import { Save, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const SystemSettings = () => {
    const [settings, setSettings] = useState({
        siteName: 'DotnetReact Admin',
        maintenanceMode: false,
        allowRegistration: true,
        emailNotifications: true
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Mock API call
        setTimeout(() => {
            setLoading(false);
            toast.success('Settings saved successfully!');
        }, 1000);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    {/* General Settings */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Application Name</label>
                                <input
                                    type="text"
                                    name="siteName"
                                    value={settings.siteName}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                />
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-200" />

                    {/* Security & Access */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Security & Access</h3>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        id="maintenanceMode"
                                        name="maintenanceMode"
                                        type="checkbox"
                                        checked={settings.maintenanceMode}
                                        onChange={handleChange}
                                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="maintenanceMode" className="font-medium text-gray-700">Maintenance Mode</label>
                                    <p className="text-gray-500">Prevent users from accessing the site while maintenance is in progress.</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        id="allowRegistration"
                                        name="allowRegistration"
                                        type="checkbox"
                                        checked={settings.allowRegistration}
                                        onChange={handleChange}
                                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="allowRegistration" className="font-medium text-gray-700">Allow User Registration</label>
                                    <p className="text-gray-500">If disabled, only admins can create new users.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SystemSettings;
