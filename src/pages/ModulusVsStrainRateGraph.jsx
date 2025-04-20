// import axios, { all } from 'axios';
// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//     CartesianGrid,
//     Legend,
//     Line,
//     LineChart,
//     ResponsiveContainer,
//     Tooltip,
//     XAxis,
//     YAxis
// } from 'recharts';
// import ErrorComponent from '../components/shared/ErrorComponent';
// import FullscreenChart from '../components/shared/FullScreenChart';
// import Loader from '../components/shared/Loader';

// const ModulusVsStrainRateGraph = () => {

//     const navigate = useNavigate();

//     const [graphData, setGraphData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [uniqueTemperatures, setUniqueTemperatures] = useState([]);
//     const [error, setError] = useState(null);


//     // Define strain rates
//     const strainRates = ['1e-06', '1e-05', '0.0001', '0.001', '0.01', '0.1'];

//     useEffect(() => {
//         const fetchGraphData = async () => {
//             try {
//                 const response = await axios.get('http://127.0.0.1:8000/get-graph-data');
//                 console.log('Raw Graph Data:', response.data.graphData);
//                 // response.data.graphData = [
//                 //     [30, 118.8454239, 213.4290665, 336.5403739, 474.0920645, 604.1033492, 708.9326814],
//                 //     [40, 73.32535638, 147.5162057, 252.5946823, 382.8086095, 520.3131399, 643.1750115],
//                 //     [50, 43.19033908, 101.0964695, 188.2967239, 305.4775305, 441.4878225, 575.2324143],
//                 //     [60, 22.53056919, 67.85534614, 139.2635912, 241.4964118, 369.9518197, 507.7391888],
//                 //     [70, 6.870353052, 41.82968102, 98.94390577, 185.2005484, 301.5725679, 437.2947784],
//                 //     [80, -5.027256806, 21.55006588, 66.24736873, 136.8233624, 238.1880469, 366.0810733],
//                 //     [90, -14.06984756, 5.829648819, 40.07362889, 96.15832451, 181.1780627, 296.4730527],
//                 //     [100, -20.91860648, -6.260220178, 19.42246919, 62.74847816, 131.4908765, 230.9154658],
//                 //     [110, -25.72237646, -14.8372586, 4.48294048, 37.79623104, 92.5330922, 175.9161775],
//                 //     [120, -29.92515906, -22.40839869, -8.911555381, 14.83046347, 55.15095711, 119.8035714]
//                 // ];
//                 // Transform the data
//                 const transformedData = response.data.graphData.map((row) => {
//                     return {
//                         "Ref Temp": row[0],
//                         "Modulus Values": row.slice(1)
//                     };
//                 });

//                 console.log('Transformed Graph Data:', transformedData);
//                 setGraphData(transformedData);

//                 const tempValues = transformedData.map(obj => obj['Ref Temp']);
//                 setUniqueTemperatures(tempValues);
//                 setLoading(false);
//             } catch (error) {
//                 console.error('Error fetching graph data:', error);
//                 setError(error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchGraphData();
//     }, []);

//     // Colors for each temperature line


//     // Prepare Data for Plotting
//     const preparedData = strainRates.map((rate, index) => {
//         let dataPoint = { "Strain Rate": rate };

//         graphData.forEach((tempData) => {
//             dataPoint[`Temp ${tempData["Ref Temp"]}`] = tempData["Modulus Values"][index];
//         });

//         return dataPoint;
//     });


//     console.log('Prepared Data for Plotting:', preparedData);

//     const allStrainRates = preparedData.map((item, index) => {
//         return item['Strain Rate'];
//     });

//     const xDomain = [Math.min(...allStrainRates), Math.max(...allStrainRates)];
//     const generateLogTicks = (min, max, exponentIncreaseStepUp) => {
//         const minExp = Math.floor(Math.log10(min));
//         const maxExp = Math.floor(Math.log10(max));

//         return Array.from({ length: Math.floor((maxExp - minExp) / exponentIncreaseStepUp) + 1 }, (_, i) => Math.pow(10, minExp + i * exponentIncreaseStepUp));
//     }

//     const xTicks = generateLogTicks(xDomain[0], xDomain[1], 1);
//     const CustomTickFormatter = ({ x, y, payload, isYAxis = false }) => {

//         if (!payload.value) {
//             return null;
//         }

//         const exponent = Math.log10(payload.value).toFixed(0);

//         const textAnchor = isYAxis ? "end" : "middle";
//         const dominantBaseline = isYAxis ? "middle" : "hanging";
//         const dx = isYAxis ? -10 : 0;
//         const dy = isYAxis ? 0 : 5;

//         return (
//             <text x={x - 5} y={y} textAnchor={textAnchor} dominantBaseline={dominantBaseline} dx={dx} dy={dy}>
//                 10<tspan dy={-4} fontSize="0.8em">{exponent}</tspan>
//             </text>
//         );
//     };


//     const getColor = (index) => {
//         console.log(uniqueTemperatures);

//         if (uniqueTemperatures.includes(30)) {
//             return index === uniqueTemperatures.indexOf(30) ? '#000000' : `hsl(${(index * 360 / uniqueTemperatures.length)}, 70%, 50%)`;
//         } else {
//             return `hsl(${(index * 360 / uniqueTemperatures.length)}, 70%, 50%)`;
//         }

//     };
//     console.log(...graphData);

//     const threeDGraphActionButtonHandler = () => {
//         return <button
//             className="p-0 bg-transparent border-0 font-serif text-black font-normal hover:text-[#54058c] rounded-md transition-colors duration-150 hover:underline hover:border-0"
//             style={{
//                 outline: 'none'
//             }}
//             onClick={navigate('/modulus-strainrate-temperature-3d')}
//         >
//             Show 3D View
//         </button>
//     };

//     const threeDGraphActionButton = threeDGraphActionButtonHandler();

//     if (loading) {
//         return <Loader isLoading={loading} />;
//     }

//     if (error) return <ErrorComponent codeColor={error.status === 500 ? '#dc3545' : '#ffc107'} showErrorIcon={true} showHeader={true} showErrorCode={true} errorCode={error.status} errorMessage={error.message} subMessage='You can navigate to home page by clicking' />

//     return (
//         <FullscreenChart title={'Modulus vs Strain Rate for Different Temperatures'} surplusActionButtons={[threeDGraphActionButton]}>
//             <ResponsiveContainer width="100%" height={700}>
//                 <LineChart data={preparedData}>
//                     {/* <CartesianGrid strokeDasharray="3 3" /> */}
//                     <XAxis
//                         dataKey="Strain Rate"
//                         scale={'log'}
//                         type="category"
//                         domain={xDomain}
//                         tick={<CustomTickFormatter />}
//                         ticks={xTicks}
//                         label={{
//                             value: "Strain Rate (1/s)", position: "insideBottom", style: {
//                                 fontSize: 18,
//                                 margin: { top: 10 },
//                                 textAnchor: 'middle'
//                             }
//                         }}
//                     />
//                     <YAxis
//                         label={{ value: "Modulus", angle: -90, position: "insideLeft", offset: 0, style: { textAnchor: 'middle' } }}
//                     />
//                     <Tooltip />
//                     <Legend
//                         align='center'
//                         verticalAlign='bottom'
//                         iconSize={12}
//                         formatter={value => value.slice(5)}
//                         wrapperStyle={{
//                             paddingBottom: '20px'
//                         }} />
//                     {graphData.map((tempData, index) => (
//                         <Line
//                             key={tempData["Ref Temp"]}
//                             type="monotone"
//                             dataKey={`Temp ${tempData["Ref Temp"]}`}
//                             stroke={getColor(index)}
//                             strokeWidth={2}
//                             dot={{ r: 3 }}
//                             name={`Temp ${tempData["Ref Temp"]}°C`}
//                         />
//                     ))}
//                 </LineChart>
//             </ResponsiveContainer>
//         </FullscreenChart>

//     );
// };

// export default ModulusVsStrainRateGraph;








import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import ErrorComponent from '../components/shared/ErrorComponent';
import FullscreenChart from '../components/shared/FullScreenChart';
import Loader from '../components/shared/Loader';
import { getModulusVsStrainRateVsTemperature } from '../http';
import { modulusVsStrainRateVsTemperatureDataFormatter } from '../utils/dataFormatters';

const ModulusVsStrainRateGraph = () => {
    const navigate = useNavigate();
    const [graphData, setGraphData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uniqueTemperatures, setUniqueTemperatures] = useState([]);
    const [error, setError] = useState(null);
    const [rawData, setRawData] = useState(null);


    // Define strain rates
    const strainRates = ['1e-06', '1e-05', '0.0001', '0.001', '0.01', '0.1'];

    // Navigate to 3D view with the graph data
    const navigateTo3DView = useCallback(() => {
        // Store the graph data in sessionStorage to pass to the 3D component
        sessionStorage.setItem('graphData', JSON.stringify(graphData));
        navigate('/modulus-strainrate-temperature-3d');
    }, [navigate, graphData]);

    useEffect(() => {
        const fetchGraphData = async () => {
            try {

                const response = await getModulusVsStrainRateVsTemperature();

                // Transform the data
                const transformedData = response.data.graphData.map((row) => ({
                    "Ref Temp": row[0],
                    "Modulus Values": row.slice(1)
                }));

                setRawData(response.data.graphData);
                console.log(transformedData);


                setGraphData(transformedData);

                setUniqueTemperatures(transformedData.map(obj => obj['Ref Temp']));
            } catch (error) {
                console.error('Error fetching graph data:', error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchGraphData();
    }, []);

    // Prepare Data for Plotting - moved outside of render
    const preparedData = strainRates.map((rate, index) => {
        const dataPoint = { "Strain Rate": rate };

        graphData.forEach((tempData) => {
            dataPoint[`Temp ${tempData["Ref Temp"]}`] = tempData["Modulus Values"][index];
        });

        return dataPoint;
    });

    // Generate x-axis ticks for logarithmic scale
    const allStrainRates = preparedData.map(item => item['Strain Rate']);
    const xDomain = [Math.min(...allStrainRates), Math.max(...allStrainRates)];

    const generateLogTicks = (min, max, exponentIncreaseStepUp) => {
        const minExp = Math.floor(Math.log10(min));
        const maxExp = Math.floor(Math.log10(max));
        return Array.from(
            { length: Math.floor((maxExp - minExp) / exponentIncreaseStepUp) + 1 },
            (_, i) => Math.pow(10, minExp + i * exponentIncreaseStepUp)
        );
    };

    const xTicks = generateLogTicks(xDomain[0], xDomain[1], 1);

    // Custom formatter for logarithmic scale
    const CustomTickFormatter = ({ x, y, payload, isYAxis = false }) => {
        if (!payload.value) {
            return null;
        }

        const exponent = Math.log10(payload.value).toFixed(0);
        const textAnchor = isYAxis ? "end" : "middle";
        const dominantBaseline = isYAxis ? "middle" : "hanging";
        const dx = isYAxis ? -10 : 0;
        const dy = isYAxis ? 0 : 5;

        return (
            <text x={x - 5} y={y} textAnchor={textAnchor} dominantBaseline={dominantBaseline} dx={dx} dy={dy}>
                10<tspan dy={-4} fontSize="0.8em">{exponent}</tspan>
            </text>
        );
    };

    // Get color for temperature lines
    const getColor = (index) => {
        if (uniqueTemperatures.includes(30)) {
            return index === uniqueTemperatures.indexOf(30) ? '#000000' : `hsl(${(index * 360 / uniqueTemperatures.length)}, 70%, 50%)`;
        }
        return `hsl(${(index * 360 / uniqueTemperatures.length)}, 70%, 50%)`;
    };

    // Create the 3D view button
    const ThreeDGraphActionButton = () => (
        <button
            className="p-0 bg-transparent border-0 font-serif text-black font-normal hover:text-[#54058c] rounded-md transition-colors duration-150 hover:underline hover:border-0"
            style={{ outline: 'none' }}
            onClick={navigateTo3DView}
        >
            Show 3D View
        </button>
    );

    if (loading) {
        return <Loader isLoading={loading} />;
    }

    if (error) {
        return (
            <ErrorComponent
                codeColor={error.status === 500 ? '#dc3545' : '#ffc107'}
                showErrorIcon={true}
                showHeader={true}
                showErrorCode={true}
                errorCode={error.status}
                errorMessage={error.message}
                subMessage='You can navigate to home page by clicking'
            />
        );
    }

    const excelFormattedChartData = modulusVsStrainRateVsTemperatureDataFormatter(rawData);
    const xAxisLabelOffset = 30;
    const yAxisLabelOffset = -20;

    return (
        <FullscreenChart
            title={'Modulus vs Strain Rate for Different Temperatures'}
            surplusActionButtons={[<ThreeDGraphActionButton key="3d-view" />]}
            watermark={{
                text: 'NYU-ViscoMOD',
                position: 'bottom-right',
                color: 'rgba(0,0,0,0.5)',
                fontSize: 30,
                rotation: 0,
                bottomShift: '15%',
                topShift: 0,
                leftShift: 0,
                rightShift: '5%'
            }}
            exportData={excelFormattedChartData}
        >
            <div className="w-full h-full">
                <ResponsiveContainer width="100%" height={700}>
                    <LineChart data={preparedData} margin={{ top: 10, right: 30, left: 70 + yAxisLabelOffset, bottom: 35 + xAxisLabelOffset }}>
                        <XAxis
                            dataKey="Strain Rate"
                            scale="log"
                            type="number"
                            domain={xDomain}
                            tick={<CustomTickFormatter />}
                            ticks={xTicks}
                            label={{
                                value: "Strain Rate (1/s)",
                                position: "bottom",
                                offset: xAxisLabelOffset,
                                style: {
                                    fontSize: 18,
                                    fontWeight: '700',
                                    margin: { top: 10 },
                                    textAnchor: 'middle'
                                },
                                fill: '#000'
                            }}
                        />
                        <YAxis
                            label={{
                                value: "Modulus",
                                fontSize: 18,
                                offset: yAxisLabelOffset,
                                angle: -90,
                                position: "insideLeft",
                                style: { fontSize: 18, textAnchor: 'middle', fontWeight: '700' },
                                fill: '#000'
                            }}
                        />
                        <Tooltip />
                        <Legend
                            align='center'
                            verticalAlign='top'
                            iconSize={12}
                            formatter={value => value.slice(5)}
                            wrapperStyle={{
                                paddingBottom: '20px'
                            }}
                        />
                        {graphData.map((tempData, index) => (
                            <Line
                                key={tempData["Ref Temp"]}
                                type="monotone"
                                dataKey={`Temp ${tempData["Ref Temp"]}`}
                                stroke={getColor(index)}
                                strokeWidth={2}
                                dot={{ r: 3 }}
                                name={`Temp ${tempData["Ref Temp"]}°C`}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </FullscreenChart>
    );
};

export default ModulusVsStrainRateGraph;