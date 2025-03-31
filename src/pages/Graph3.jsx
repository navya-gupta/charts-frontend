// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import {
//     CartesianGrid,
//     Legend,
//     Line,
//     LineChart,
//     ReferenceLine,
//     ResponsiveContainer,
//     Scatter,
//     ScatterChart,
//     Tooltip,
//     XAxis,
//     YAxis
// } from 'recharts';

// const MasterCurveGraph = () => {

//     const [loading, setLoading] = useState(true);
//     const [chartData, setChartData] = useState([]);

//     // Sample data - will be replaced by API data in actual implementation
//     // const sampleData = {
//     //     "status": "success",
//     //     "graphData": [
//     //         {
//     //             "reference_temp": 30,
//     //             "data": [
//     //                 { "frequency": 0.00000001, "storage_modulus": 11.5, "fitted_storage_modulus": 12 },
//     //                 { "frequency": 0.0000001, "storage_modulus": 15, "fitted_storage_modulus": 14.8 },
//     //                 { "frequency": 0.000001, "storage_modulus": 19, "fitted_storage_modulus": 18.5 },
//     //                 { "frequency": 0.00001, "storage_modulus": 25, "fitted_storage_modulus": 24.6 },
//     //                 { "frequency": 0.0001, "storage_modulus": 32, "fitted_storage_modulus": 31.8 },
//     //                 { "frequency": 0.001, "storage_modulus": 42, "fitted_storage_modulus": 41.5 },
//     //                 { "frequency": 0.01, "storage_modulus": 55, "fitted_storage_modulus": 54.3 },
//     //                 { "frequency": 0.1, "storage_modulus": 72, "fitted_storage_modulus": 71.2 },
//     //                 { "frequency": 1, "storage_modulus": 95, "fitted_storage_modulus": 94.1 },
//     //                 { "frequency": 10, "storage_modulus": 125, "fitted_storage_modulus": 124.5 },
//     //                 { "frequency": 100, "storage_modulus": 165, "fitted_storage_modulus": 164 },
//     //                 { "frequency": 1000, "storage_modulus": 215, "fitted_storage_modulus": 214 }
//     //             ]
//     //         },
//     //         {
//     //             "reference_temp": 40,
//     //             "data": [
//     //                 { "frequency": 0.0000000001, "storage_modulus": 11.5, "fitted_storage_modulus": 12 },
//     //                 { "frequency": 0.000000001, "storage_modulus": 15, "fitted_storage_modulus": 14.8 },
//     //                 { "frequency": 0.00000001, "storage_modulus": 19, "fitted_storage_modulus": 18.5 },
//     //                 { "frequency": 0.0000001, "storage_modulus": 25, "fitted_storage_modulus": 24.6 },
//     //                 { "frequency": 0.000001, "storage_modulus": 32, "fitted_storage_modulus": 31.8 },
//     //                 { "frequency": 0.00001, "storage_modulus": 42, "fitted_storage_modulus": 41.5 },
//     //                 { "frequency": 0.0001, "storage_modulus": 55, "fitted_storage_modulus": 54.3 },
//     //                 { "frequency": 0.001, "storage_modulus": 72, "fitted_storage_modulus": 71.2 },
//     //                 { "frequency": 0.01, "storage_modulus": 95, "fitted_storage_modulus": 94.1 },
//     //                 { "frequency": 0.1, "storage_modulus": 125, "fitted_storage_modulus": 124.5 },
//     //                 { "frequency": 1, "storage_modulus": 165, "fitted_storage_modulus": 164 },
//     //                 { "frequency": 10, "storage_modulus": 215, "fitted_storage_modulus": 214 }
//     //             ]
//     //         }
//     //     ]
//     // };

//     useEffect(() => {
//         // Use provided data or sample data if none is provided
//         const fetchGraphData = async () => {
//             try {
//                 const { data } = await axios.get("http://127.0.0.1:8000/get-master-curve-for-all-temperatures");
//                 console.log(data?.graphData);
//                 setChartData(data?.graphData)
//             } catch (err) {
//                 console.error('Error fetching graph data:', err);
//             }

//         };

//         fetchGraphData();

//     }, []);

//     // Color scale similar to the rainbow used in matplotlib
//     const getColor = (index, total) => {
//         const colors = [
//             '#9400D3', // violet
//             '#4B0082', // indigo
//             '#0000FF', // blue
//             '#00FFFF', // cyan
//             '#00FF00', // green
//             '#FFFF00', // yellow
//             '#FF7F00', // orange
//             '#FF0000'  // red
//         ];

//         // Calculate color index based on position in the array
//         const colorIndex = Math.floor((index / (total - 1)) * (colors.length - 1));
//         return colors[colorIndex];
//     };

//     if (!chartData) return <div>Loading...</div>;

//     // Prepare domain for log scales
//     const frequencies = chartData.flatMap(temp =>
//         temp.data.map(point => point.frequency)
//     );
//     const moduli = chartData.flatMap(temp =>
//         temp.data.map(point => point.storage_modulus)
//     );

//     const minFreq = Math.min(...frequencies);
//     const maxFreq = Math.max(...frequencies);
//     const minModulus = Math.min(...moduli);
//     const maxModulus = Math.max(...moduli);

//     // Custom tick formatter for log scale
//     const formatLogTick = (value) => {
//         if (value === 0) return '0';
//         const exponent = Math.floor(Math.log10(value));
//         return `10${exponent !== 1 ? exponent.toString().sup() : ''}`;
//     };

//     // Custom domain for better visualization
//     const xDomain = [Math.max(minFreq * 0.1, 1e-13), Math.min(maxFreq * 10, 1e13)];
//     const yDomain = [Math.max(minModulus * 0.8, 5), Math.min(maxModulus * 1.2, 500)];

//     return (
//         <div className="w-full h-full flex flex-col">
//             <h2 className="text-2xl font-bold text-center mb-4">Master Curve for All Reference Temperatures</h2>
//             <div className="w-full h-96">
//                 <ResponsiveContainer width="100%" height="100%">
//                     <LineChart
//                         margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
//                     >
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis
//                             type="number"
//                             dataKey="frequency"
//                             name="Reduced Frequency"
//                             scale="log"
//                             // domain={xDomain}
//                             allowDataOverflow
//                             // tickFormatter={formatLogTick}
//                             label={{ value: 'Reduced Frequency (Hz)', position: 'bottom', offset: 10 }}
//                         />
//                         <YAxis
//                             type="number"
//                             dataKey="storage_modulus"
//                             name="Storage Modulus"
//                             scale="log"
//                             // domain={yDomain}
//                             allowDataOverflow
//                             label={{ value: 'Storage Modulus (MPa)', angle: -90, position: 'left', offset: -5 }}
//                         />
//                         <Tooltip
//                             formatter={(value) => [`${value.toFixed(2)}`, '']}
//                             labelFormatter={(value) => `Frequency: ${value.toExponential(2)} Hz`}
//                         />
//                         <Legend />

//                         {/* Render actual data points as scatter */}
//                         {chartData.map((temp, index) => (
//                             <Scatter
//                                 key={`scatter-${temp.reference_temp}`}
//                                 name={`Ref Temp ${temp.reference_temp}°C`}
//                                 data={temp.data}
//                                 fill={getColor(index, chartData.length)}
//                                 line={false}
//                                 shape="circle"
//                                 legendType="circle"
//                             />
//                         ))}

//                         {/* Render fitted curves with dashed lines */}
//                         {chartData.map((temp, index) => (
//                             <Line
//                                 key={`line-${temp.reference_temp}`}
//                                 data={temp.data}
//                                 type="monotone"
//                                 dataKey="fitted_storage_modulus"
//                                 stroke="#000000"
//                                 dot={false}
//                                 name={`Fitted ${temp.reference_temp}°C`}
//                                 strokeDasharray="5 5"
//                                 legendType="none"
//                             />
//                         ))}
//                     </LineChart>
//                 </ResponsiveContainer>
//             </div>
//         </div>
//     );
// };

// export default MasterCurveGraph;


import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
    CartesianGrid,
    ComposedChart,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Scatter,
    ScatterChart,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

const MasterCurveGraph = () => {
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchGraphData = async () => {
            try {
                setIsLoading(true);
                const { data } = await axios.get("http://127.0.0.1:8000/get-master-curve-for-all-temperatures");
                console.log("Fetched data:", data?.graphData);

                // Ensure the data is in the correct format
                if (data?.graphData && Array.isArray(data.graphData)) {
                    setChartData(data.graphData);
                }
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching graph data:', err);
                setIsLoading(false);
            }
        };

        fetchGraphData();
    }, []);

    // Color scale similar to the rainbow used in matplotlib
    const getColor = (index, total) => {
        const colors = [
            '#9400D3', // violet
            '#4B0082', // indigo
            '#0000FF', // blue
            '#00FFFF', // cyan
            '#00FF00', // green
            '#FFFF00', // yellow
            '#FF7F00', // orange
            '#FF0000'  // red
        ];

        // Calculate color index based on position in the array
        const colorIndex = Math.min(Math.floor((index / Math.max(1, total - 1)) * (colors.length - 1)), colors.length - 1);
        return colors[colorIndex];
    };

    if (isLoading || chartData.length === 0) {
        return <div>Loading chart data...</div>;
    }

    // Check if data structure matches expectations before proceeding
    const hasValidDataStructure = chartData.every(item =>
        item.hasOwnProperty('reference_temp') &&
        item.hasOwnProperty('data') &&
        Array.isArray(item.data)
    );

    if (!hasValidDataStructure) {
        console.error('Data structure is not as expected:', chartData);
        return <div>Error: Invalid data structure</div>;
    }

    // Prepare all frequencies and moduli for domain calculation
    const frequencies = [];
    const moduli = [];

    chartData.forEach(tempData => {
        if (tempData.data && Array.isArray(tempData.data)) {
            tempData.data.forEach(point => {
                if (point.frequency) {
                    frequencies.push(point.frequency);
                }
                if (point.storage_modulus) {
                    moduli.push(point.storage_modulus);
                }
            });
        }
    });

    if (frequencies.length === 0 || moduli.length === 0) {
        return <div>No valid data points found</div>;
    }

    const minFreq = Math.min(...frequencies);
    const maxFreq = Math.max(...frequencies);
    const minModulus = Math.min(...moduli);
    const maxModulus = Math.max(...moduli);

    // Custom tick formatter for log scale
    const formatLogTick = (value) => {
        if (value === 0) return '0';
        const exponent = Math.floor(Math.log10(value));
        return `10^${exponent}`;
    };

    // Set reasonable domains for better visualization
    // const xDomain = [Math.max(minFreq * 0.1, 1e-13), Math.min(maxFreq * 10, 1e13)];
    // const yDomain = [Math.max(minModulus * 0.8, 5), Math.min(maxModulus * 1.2, 500)];
    const xDomain = ['dataMin', 'dataMax'];
    const yDomain = ['dataMin', 'dataMax'];

    // return (
    //     <div className="w-full h-full flex flex-col">
    //         <h2 className="text-2xl font-bold text-center mb-4">Master Curve for All Reference Temperatures</h2>
    //         <div className="w-full h-96">
    //             <ResponsiveContainer width="100%" height="100%">
    //                 <ScatterChart
    //                     margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
    //                 >
    //                     <CartesianGrid strokeDasharray="3 3" />
    //                     <XAxis
    //                         type="number"
    //                         dataKey="frequency"
    //                         name="Reduced Frequency"
    //                         scale="log"
    //                         domain={xDomain}
    //                         tickFormatter={formatLogTick}
    //                         label={{ value: 'Reduced Frequency (Hz)', position: 'bottom', offset: 10 }}
    //                     />
    //                     <YAxis
    //                         type="number"
    //                         dataKey="storage_modulus"
    //                         name="Storage Modulus"
    //                         scale="log"
    //                         domain={yDomain}
    //                         label={{ value: 'Storage Modulus (MPa)', angle: -90, position: 'left', offset: -5 }}
    //                     />
    //                     <Tooltip
    //                     // formatter={(value) => value ? [`${parseFloat(value).toFixed(2)}`, ''] : ['N/A', '']}
    //                     // labelFormatter={(value) => `Frequency: ${value ? value.toExponential(2) : 'N/A'} Hz`}
    //                     />
    //                     <Legend />

    //                     {/* Render actual data points as scatter */}
    //                     {chartData.map((temp, index) => (
    //                         <Scatter
    //                             key={`scatter-${temp.reference_temp}`}
    //                             name={`Ref Temp ${temp.reference_temp}°C`}
    //                             data={temp.data}
    //                             dataKey="storage_modulus"
    //                             fill={getColor(index, chartData.length)}
    //                             line={false}
    //                             shape="circle"
    //                             legendType="circle"
    //                         />
    //                     ))}

    //                     {/* Render fitted curves with dashed lines */}
    //                     {chartData.map((temp, index) => (
    //                         <Line
    //                             key={`line-${temp.reference_temp}`}
    //                             data={temp.data}
    //                             type="monotone"
    //                             dataKey="fitted_storage_modulus"
    //                             stroke="#000000"
    //                             dot={false}
    //                             strokeDasharray="5 5"
    //                             legendType="none"
    //                         />
    //                     ))}
    //                 </ScatterChart>
    //             </ResponsiveContainer>
    //         </div>
    //     </div>
    // );






    // return (
    //     // ScatterChart
    //     <div className="w-full h-full flex flex-col">
    //         <h2 className="text-2xl font-bold text-center mb-4">Master Curve for All Reference Temperatures</h2>
    //         <div className="w-full h-96">
    //             <ResponsiveContainer width="100%" height="100%">
    //                 <ComposedChart margin={{ top: 10, right: 30, left: 20, bottom: 30 }}>
    //                     <CartesianGrid strokeDasharray="3 3" />
    //                     <XAxis
    //                         type='number'
    //                         dataKey='frequency'
    //                         name='Reduced Frequency'
    //                         scale='log'
    //                         domain={xDomain}
    //                         label={{ value: 'Reduced Frequency (Hz)', position: 'bottom', offset: 10 }}
    //                     />

    //                     <YAxis
    //                         type='number'
    //                         dataKey='storage_modulus'
    //                         name='Storage Modulus'
    //                         scale='log'
    //                         domain={yDomain}
    //                         label={{ value: 'Storage Modulus (MPa)', angle: -90, position: 'left', offset: -5 }}
    //                     />
    //                     <Tooltip />
    //                     <Legend />

    //                     {chartData.map((temp, index) => {
    //                         <Scatter
    //                             key={`scatter-${temp.reference_temp}`}
    //                             name={`Ref Temp ${temp.reference_temp}°C`}
    //                             data={temp.data}
    //                             dataKey="storage_modulus"
    //                             fill={getColor(index, chartData.length)}
    //                             line={false}
    //                             shape="circle"
    //                             legendType="circle"
    //                         />
    //                     })}

    //                     {chartData.map((temp, index) => {
    //                         <Line
    //                             key={`line-${temp.reference_temp}`}
    //                             data={temp.data}
    //                             type="monotone"
    //                             dataKey="fitted_storage_modulus"
    //                             stroke="#000000"
    //                             dot={false}
    //                             strokeDasharray="5 5"
    //                             legendType="none"
    //                         />
    //                     })}
    //                 </ComposedChart>
    //             </ResponsiveContainer>
    //         </div>
    //     </div>
    // )
};

export default MasterCurveGraph;