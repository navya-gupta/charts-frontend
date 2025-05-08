import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/images/NYU_background.jpg';

// Reusable form input component with required field indicator
const FormInput = ({ id, label, type = "text", value, onChange, placeholder, options = [], required = false }) => {
    const requiredStar = required ? <span className="text-red-600 ml-1">*</span> : null;

    if (type === "select") {
        return (
            <div className="mb-4">
                <label htmlFor={id} className="inline-block mb-2 font-bold text-gray-800">
                    {label}{requiredStar}
                </label>
                <select
                    id={id}
                    name={id}
                    value={value}
                    onChange={onChange}
                    className={`block w-full px-3 py-2 text-gray-700 bg-white bg-opacity-90 border rounded focus:outline-none focus:ring-2 focus:border-transparent`}
                    required={required}
                >
                    <option value="">Select {label}</option>
                    {options.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>
        );
    }

    return (
        <div className="mb-4">
            <label htmlFor={id} className="inline-block mb-2 font-bold text-gray-800">
                {label}{requiredStar}
            </label>
            <input
                type={type}
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder || `Enter ${label.toLowerCase()}`}
                className={`block w-full px-3 py-2 text-gray-700 bg-white bg-opacity-90 border rounded focus:outline-none focus:ring-2 focus:border-transparent`}
                required={required}
            />
        </div>
    );
};

// Reusable form button component
const FormButton = ({ type = "submit", onClick, children, className = "" }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`w-full font-medium text-white text-center rounded-md px-3 py-2 transition duration-150 ease-in-out hover:opacity-70 ${className}`}
            style={{ background: '#54058c' }}
        >
            {children}
        </button>
    );
};

// Reusable form container component
const FormContainer = ({ title, children }) => {
    return (
        <div className="w-full max-w-lg bg-white bg-opacity-95 rounded-lg shadow-lg">
            <div
                className="text-white px-4 py-3 rounded-t-lg flex justify-between items-center"
                style={{ background: '#54058c' }}
            >
                <h3 className="text-lg font-normal leading-tight">{title}</h3>
                <div className="flex space-x-4">
                    <a
                        href="Template.csv"
                        download
                        className="text-sm hover:underline"
                        style={{ color: 'rgba(255,255,255,0.9)' }}
                    >
                        Download CSV Template
                    </a>
                    <a
                        href="/Software%20Manual.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm hover:underline"
                        style={{ color: 'rgba(255,255,255,0.9)' }}
                    >
                        View Manual
                    </a>
                </div>
            </div>

            {children}
        </div>
    );
};

const Home = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        university: '',
        department: '',
        // machineUsed: '',
        // modelNumber: '',
        makeAndModelOfMachine: '',
        emailAddress: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Pass form data as state to Upload.jsx
        navigate('/upload', { state: { formData } });
    };

    const designationOptions = [
        'Undergraduate Student',
        'Graduate Student',
        'PhD',
        'Post Doc',
        'Faculty'
    ];

    return (
        <div
            className="flex justify-center items-center min-h-screen bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <FormContainer title="NYU Research Form">
                <form onSubmit={handleSubmit}>
                    <div className="p-5">
                        <FormInput
                            id="fullName"
                            label="Full Name"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required={true}
                        />


                        <FormInput
                            id="emailAddress"
                            label="Email Address"
                            type="email"
                            name="emailAddress"
                            value={formData.emailAddress}
                            onChange={handleChange}
                            required={true}
                        />

                        <FormInput
                            id="university"
                            label="University"
                            name="university"
                            value={formData.university}
                            onChange={handleChange}
                            required={true}
                        />

                        <FormInput
                            id="department"
                            label="Department"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            required={true}
                        />

                        {/* <FormInput
                            id="machineUsed"
                            label="Machine Used"
                            name="machineUsed"
                            value={formData.machineUsed}
                            onChange={handleChange}
                            required={true}
                        />

                        <FormInput
                            id="modelNumber"
                            label="Model Number"
                            name="modelNumber"
                            value={formData.modelNumber}
                            onChange={handleChange}
                            required={true}
                        /> */}

                        <FormInput
                            id="makeAndModelOfMachine"
                            label="Make & Model of the Machine"
                            name="makeAndModelOfMachine"
                            value={formData.makeAndModelOfMachine}
                            onChange={handleChange}
                            required={true}
                        />
                    </div>

                    <div className="p-3">
                        <FormButton type="submit">
                            Submit
                        </FormButton>
                    </div>
                </form>

            </FormContainer>
        </div>
    );
};

export default Home;