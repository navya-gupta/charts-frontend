import { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { uploadCSV } from '../http';

const Upload = () => {
    const [fileName, setFileName] = useState('No File Chosen');
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;
    const formDataFromHome = state?.formData || {
        fullName: '',
        university: '',
        department: '',
        machineUsed: '',
        modelNumber: '',
        emailAddress: ''
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a CSV file first!');
            return;
        }

        setUploading(true);
        const formDataToSend = new FormData();
        formDataToSend.append("file", file);
        formDataToSend.append("full_name", formDataFromHome.fullName);
        formDataToSend.append("university", formDataFromHome.university);
        formDataToSend.append("department", formDataFromHome.department);
        formDataToSend.append("machine_used", formDataFromHome.machineUsed);
        formDataToSend.append("model_number", formDataFromHome.modelNumber);
        formDataToSend.append("email_address", formDataFromHome.emailAddress);

        try {
            const response = await uploadCSV(formDataToSend);
            if (response.status === 200) {
                console.log('Form and file data uploaded successfully');
                const uploadId = response.data.upload_id;
                navigate(`/menu?upload_id=${uploadId}`, { state: { uploadId } }); // Pass via state for immediate use
            } else {
                console.error(response.data);
            }
        } catch (error) {
            console.error('Error uploading CSV:', error);
            setError('Upload failed. Please try again.');
        }

        setUploading(false);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
                setError('Only CSV files are allowed.');
                setFileName('No File Chosen');
            } else {
                setError('');
                setFileName(file.name);
                setFile(file);
            }
        } else {
            setFileName('No File Chosen');
            setError('');
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="flex flex-col justify-evenly w-full max-w-lg bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="text-white bg-[#54058c] border-b border-gray-300 px-4 py-3 rounded-t-lg">
                    <h3 className="text-lg font-normal leading-tight">Upload CSV</h3>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-5">
                        <div className="flex w-full border border-gray-300 rounded-md overflow-hidden">
                            <div
                                className="w-full px-3 py-2 text-gray-700 bg-white border-r border-gray-300 truncate cursor-pointer hover:bg-gray-50"
                                title={fileName}
                                onClick={triggerFileInput}
                            >
                                {fileName === 'No File Chosen' ? 'Choose File' : fileName}
                            </div>

                            <button
                                type="button"
                                className="text-gray-700 bg-gray-100 border-l border-gray-300 px-4 py-2 cursor-pointer hover:bg-gray-200 rounded-none"
                                onClick={triggerFileInput}
                            >
                                Browse
                            </button>

                            <span className="bg-gray-100 border-l border-gray-300 px-4 py-2">
                                Upload
                            </span>

                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileChange}
                                accept=".csv"
                            />
                        </div>

                        {error && (
                            <div className="font-semibold mt-2 text-red-600 text-sm">
                                {error}
                            </div>
                        )}
                    </div>

                    <div className="p-3 bg-gray-100 border-t">
                        <button
                            type="submit"
                            className={`w-full inline-block font-medium text-white text-center align-middle cursor-pointer bg-[#54058c] border rounded-md px-3 py-2 transition duration-150 ease-in-out ${fileName === 'No File Chosen' ? '' : 'hover:opacity-70'} ${fileName === 'No File Chosen' || error ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={fileName === 'No File Chosen' || error}
                        >
                            Upload CSV
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Upload;