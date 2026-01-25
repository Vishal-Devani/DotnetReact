import { useEffect, useState, useCallback } from "react"
import PersonForm from "./PersonForm"
import PersonList from "./PersonList"
import { useForm } from "react-hook-form"
import toast from 'react-hot-toast';
import { personService } from "../../services/api";

function Person() {
    const [people, setPeople] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editData, setEditData] = useState(null);

    const defaultFormValues = {
        id: 0,
        firstName: '',
        lastName: ''
    }

    const methods = useForm({
        defaultValues: defaultFormValues
    });

    // Load people on component mount
    useEffect(() => {
        const loadPeople = async () => {
            setLoading(true);
            try {
                const peopleData = await personService.getAll();
                // Handle both wrapped and unwrapped responses
                const peopleList = Array.isArray(peopleData) ? peopleData : (peopleData?.data || []);
                setPeople(peopleList);
            } catch (error) {
                // Error is already handled by API interceptor
                console.error('Failed to load people:', error);
            } finally {
                setLoading(false);
            }
        };

        loadPeople();
    }, []);

    // Reset form when editData changes
    useEffect(() => {
        if (editData) {
            methods.reset({
                id: editData.id || 0,
                firstName: editData.firstName || '',
                lastName: editData.lastName || ''
            });
        } else {
            methods.reset(defaultFormValues);
        }
    }, [editData, methods]);

    const handleFormReset = useCallback(() => {
        methods.reset(defaultFormValues);
        setEditData(null);
    }, [methods]);

    const handleFormSubmit = async (person) => {
        setLoading(true);
        try {
            if (person.id <= 0) {
                // Create new person
                const createdPerson = await personService.create({
                    firstName: person.firstName,
                    lastName: person.lastName
                });
                setPeople((previousPeople) => [...previousPeople, createdPerson]);
                toast.success("Person created successfully!");
            } else {
                // Update existing person
                await personService.update(person.id, {
                    id: person.id,
                    firstName: person.firstName,
                    lastName: person.lastName
                });
                setPeople((previousPeople) => 
                    previousPeople.map(p => p.id === person.id ? person : p)
                );
                toast.success("Person updated successfully!");
            }
            methods.reset(defaultFormValues);
            setEditData(null);
        } catch (error) {
            // Error is already handled by API interceptor
            console.error('Failed to save person:', error);
        } finally {
            setLoading(false);
        }
    }

    const handlePersonEdit = useCallback((person) => {
        setEditData(person);
    }, []);

    const handlePersonDelete = async (person) => {
        if (!window.confirm(`Are you sure you want to delete ${person.firstName} ${person.lastName}?`)) {
            return;
        }
        
        setLoading(true);
        try {
            await personService.delete(person.id);
            setPeople((previousPeople) => previousPeople.filter(p => p.id !== person.id));
            toast.success("Person deleted successfully!");
        } catch (error) {
            // Error is already handled by API interceptor
            console.error('Failed to delete person:', error);
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Person Management
                    </h1>
                    {loading && (
                        <div className="mt-4 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="ml-2 text-gray-600">Loading...</span>
                        </div>
                    )}
                </div>

                <PersonForm 
                    methods={methods} 
                    onFormSubmit={handleFormSubmit} 
                    onFormReset={handleFormReset}
                    loading={loading}
                    isEditMode={!!editData}
                />
                <PersonList 
                    peopleList={people} 
                    onPersonEdit={handlePersonEdit} 
                    onPersonDelete={handlePersonDelete}
                    loading={loading}
                />
            </div>
        </div>
    )
}

export default Person