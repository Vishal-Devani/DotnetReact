import { Save, RotateCcw, AlertCircle } from 'lucide-react';

const PersonForm = ({ methods, onFormReset, onFormSubmit, loading = false, isEditMode = false }) => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = methods;



    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6" style={{ marginBottom: '5px' }}>
            <form className="space-y-4" onSubmit={handleSubmit(onFormSubmit)}>
                <input
                    type="hidden" {...register("id")}
                />
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                            First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text" 
                            {...register("firstName", {
                                required: "First name is required",
                                maxLength: {
                                    value: 30,
                                    message: "First name cannot exceed 30 characters"
                                },
                                minLength: {
                                    value: 1,
                                    message: "First name must be at least 1 character"
                                },
                                pattern: {
                                    value: /^[a-zA-Z\s'-]+$/,
                                    message: "First name can only contain letters, spaces, hyphens, and apostrophes"
                                }
                            })}
                            disabled={loading}
                            className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                                errors.firstName 
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                            }`}
                            placeholder="Enter first name"
                            aria-label="First Name"
                            aria-invalid={errors.firstName ? "true" : "false"}
                        />

                        {errors.firstName && (
                            <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1.5">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span>{errors.firstName.message}</span>
                            </p>
                        )}
                    </div>

                    <div className="flex-1">
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            {...register("lastName", {
                                required: "Last name is required",
                                maxLength: {
                                    value: 30,
                                    message: "Last name cannot exceed 30 characters"
                                },
                                minLength: {
                                    value: 1,
                                    message: "Last name must be at least 1 character"
                                },
                                pattern: {
                                    value: /^[a-zA-Z\s'-]+$/,
                                    message: "Last name can only contain letters, spaces, hyphens, and apostrophes"
                                }
                            })}
                            disabled={loading}
                            className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                                errors.lastName 
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                            }`}
                            placeholder="Enter last name"
                            aria-label="Last Name"
                            aria-invalid={errors.lastName ? "true" : "false"}
                        />
                        {errors.lastName && (
                            <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1.5">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span>{errors.lastName.message}</span>
                            </p>
                        )}
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {isEditMode ? 'Update' : 'Save'}
                    </button>

                    <button
                        type="button" 
                        onClick={onFormReset}
                        disabled={loading}
                        className="flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PersonForm
