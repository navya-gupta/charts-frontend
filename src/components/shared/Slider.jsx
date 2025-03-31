// import { useState } from 'react';

// const Slider = ({ label, min, max, value, onChange }) => {
//     const [localValue, setLocalValue] = useState(value);
//     const [isHovering, setIsHovering] = useState(false);

//     const handleChange = (e) => {
//         const newValue = Number(e.target.value);
//         setLocalValue(newValue);
//         onChange(newValue);
//     };

//     return (
//         <div className="w-[600px] mx-auto">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//                 {label}: <span className="font-bold">{localValue}</span>
//             </label>

//             <div
//                 className="relative h-6"
//                 onMouseEnter={() => setIsHovering(true)}
//                 onMouseLeave={() => setIsHovering(false)}
//             >
//                 {/* Track */}
//                 <div className="absolute top-1/2 transform -translate-y-1/2 w-full h-2 bg-gray-200 rounded-full" />

//                 {/* Filled Track */}
//                 <div
//                     className="absolute top-1/2 transform -translate-y-1/2 h-2 bg-blue-500 rounded-full"
//                     style={{
//                         width: `${((localValue - min) / (max - min)) * 100}%`,
//                     }}
//                 />

//                 {/* Slider Input */}
//                 <input
//                     type="range"
//                     min={min}
//                     max={max}
//                     value={localValue}
//                     onChange={handleChange}
//                     className="w-full h-2 bg-transparent appearance-none 
//                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
//                      [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-teal-600 
//                      [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer 
//                      [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:-top-1"
//                 />

//                 {/* Tooltip - Shows only on hover */}
//                 {isHovering && (
//                     <div
//                         className="absolute top-[-35px] left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded"
//                         style={{
//                             left: `calc(${((localValue - min) / (max - min)) * 100}% - 20px)`,
//                         }}
//                     >
//                         {localValue}
//                         <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black mx-auto" />
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Slider;

import React, { useState } from 'react';

const Slider = ({ label, min, max, value, step = 1, onChange }) => {
    const [localValue, setLocalValue] = useState(value);
    const [isHovering, setIsHovering] = useState(false);

    const handleChange = (e) => {
        const newValue = parseFloat(e.target.value);
        setLocalValue(newValue);
        onChange(newValue);
    };

    return (
        <div className="w-[600px] mx-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}: <span className="font-bold">{localValue.toFixed(2)}</span>
            </label>

            <div
                className="relative h-6"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                {/* Track */}
                <div className="absolute top-1/2 transform -translate-y-1/2 w-full h-2 bg-gray-200 rounded-full" />

                {/* Filled Track */}
                <div
                    className="absolute top-1/2 transform -translate-y-1/2 h-2 bg-blue-500 rounded-full"
                    style={{
                        width: `${((localValue - min) / (max - min)) * 100}%`,
                    }}
                />

                {/* Slider Input */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={localValue}
                    onChange={handleChange}
                    className="w-full h-2 bg-transparent appearance-none 
                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                     [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-teal-600 
                     [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer 
                     [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:-top-1"
                />

                {/* Tooltip - Shows only on hover */}
                {isHovering && (
                    <div
                        className="absolute top-[-35px] left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded"
                        style={{
                            left: `calc(${((localValue - min) / (max - min)) * 100}% - 20px)`,
                        }}
                    >
                        {localValue.toFixed(2)}
                        <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black mx-auto" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Slider;

