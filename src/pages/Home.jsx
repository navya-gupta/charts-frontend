import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/images/NYU_background.jpg';

// Reusable form input component with required field indicator
const FormInput = ({ id, label, type = "text", value, onChange, placeholder, options = [], required = false }) => {
    // Required field indicator
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
            <div className="text-white px-4 py-3 rounded-t-lg" style={{ background: '#54058c' }}>
                <h3 className="text-lg font-normal leading-tight">{title}</h3>
            </div>
            {children}
        </div>
    );
};

const Home = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        university: '',
        designation: '',
        machineUsed: ''
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
        // Store form data in localStorage for the upload page
        localStorage.setItem('formName', formData.name);
        localStorage.setItem('formUniversity', formData.university);
        localStorage.setItem('formDesignation', formData.designation);
        localStorage.setItem('formMachineUsed', formData.machineUsed);
        navigate('/upload');
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
                            id="name"
                            label="Name"
                            name="name"
                            value={formData.name}
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
                            id="designation"
                            label="Designation"
                            type="select"
                            name="designation"
                            value={formData.designation}
                            onChange={handleChange}
                            options={designationOptions}
                            required={true}
                        />

                        <FormInput
                            id="machineUsed"
                            label="Machine Used"
                            name="machineUsed"
                            value={formData.machineUsed}
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

// import { useNavigate } from 'react-router-dom';
// import backgroundImage from '../assets/images/NYU_background.jpg'; // Ensure this image exists in your project

// const Home = () => {
//     const navigate = useNavigate();

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         navigate('/upload');  // Redirect to the CSV upload page
//     };

//     return (
//         <div
//             className="flex justify-center items-center min-h-screen bg-cover bg-center"
//             style={{ backgroundImage: `url(${backgroundImage})` }}
//         >
//             <div className="w-full max-w-lg bg-transparent rounded-lg shadow-lg backdrop-blur">
//                 <div className="text-white px-4 py-3 rounded-t-lg" style={{ background: '#54058c' }}>
//                     <h3 className="text-lg font-normal leading-tight">Example Form</h3>
//                 </div>
//                 <form onSubmit={handleSubmit}>
//                     <div className="p-5">
//                         {["2", "3", "4", "5", "6"].map((num) => (
//                             <div className="mb-4" key={num}>
//                                 <label
//                                     htmlFor={`exampleField${num}`}
//                                     className="inline-block mb-2 font-bold"
//                                 >
//                                     Example field {num}
//                                 </label>
//                                 <input
//                                     type="text"
//                                     id={`exampleField${num}`}
//                                     name={`exampleField${num}`}
//                                     placeholder="Enter value"
//                                     className="block w-full px-3 py-2 text-gray-700 bg-white bg-opacity-90 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:border-transparent"
//                                 />
//                             </div>
//                         ))}
//                     </div>

//                     <div className="p-3">
//                         <button
//                             type="submit"
//                             className="w-full font-medium text-white text-center rounded-md px-3 py-2 transition duration-150 ease-in-out hover:opacity-70"
//                             style={{
//                                 background: '#54058c'
//                             }}
//                         >
//                             Submit
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default Home;
