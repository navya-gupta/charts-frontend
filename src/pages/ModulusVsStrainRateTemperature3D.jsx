// import React, { useEffect, useState } from 'react';
// import ErrorComponent from '../components/shared/ErrorComponent';
// import Loader from '../components/shared/Loader';

// const ModulusVsStrainRateTemperature3D = () => {
//     const [isClient, setIsClient] = useState(false);
//     const [graphData, setGraphData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     // Load data and set client state
//     useEffect(() => {
//         setIsClient(true);
//         try {
//             // Retrieve graph data from sessionStorage
//             const storedData = sessionStorage.getItem('graphData');
//             if (storedData) {
//                 const parsedData = JSON.parse(storedData);
//                 // Convert to the format needed for 3D visualization
//                 const processedData = parsedData.map(item => [
//                     item["Ref Temp"],
//                     ...item["Modulus Values"]
//                 ]);
//                 setGraphData(processedData);
//             } else {
//                 // Fallback to sample data if no data is passed
//                 setError("No data available. Please return to the previous screen.");
//             }
//         } catch (err) {
//             setError("Error processing data: " + err.message);
//         } finally {
//             setLoading(false);
//         }

//         return () => {
//             if (typeof window !== 'undefined' && window.Plotly) {
//                 // Clean up Plotly when component unmounts
//                 try {
//                     const plotElement = document.getElementById('plot');
//                     if (plotElement) window.Plotly.purge('plot');
//                 } catch (error) {
//                     console.log("Error when cleaning up Plotly", error);

//                 }
//             }
//         };
//     }, []);

//     // Load Plotly from CDN
//     useEffect(() => {
//         if (isClient && graphData.length > 0) {
//             const script = document.createElement('script');
//             script.src = 'https://cdn.plot.ly/plotly-3.0.0.min.js';
//             script.async = true;
//             script.onload = initPlot;
//             document.body.appendChild(script);

//             return () => {
//                 document.body.removeChild(script);
//             };
//         }
//     }, [isClient, graphData]);

//     const initPlot = () => {
//         if (typeof window !== 'undefined' && window.Plotly && graphData.length > 0) {

//             const plotElement = document.getElementById('plot');
//             if (!plotElement) {
//                 console.warn('Plot element not found, skipping plot initialization');
//                 setError('Plot element not found');
//                 return <ErrorComponent
//                     showErrorIcon={true}
//                     showHeader={false}
//                     showErrorCode={false}
//                     errorMessage={"Oops! Something went wrong."}
//                     subMessage='Some error occured while rendering the 3D implementation. You can see the 2D plot by clicking'
//                     returnToUrl='/modulus-vs-strain-rate'
//                 />; // Exit if the element doesn't exist
//             }
//             // Define strain rates
//             const strainRates = [1e-06, 1e-05, 0.0001, 0.001, 0.01, 0.1];

//             // Transform data for 3D scatter plot
//             const x = []; // strain rates (log scale)
//             const y = []; // temperatures
//             const z = []; // modulus values
//             const hoverTexts = []; // detailed hover information

//             // Prepare data for 3D visualization
//             graphData.forEach(row => {
//                 const temperature = row[0];
//                 const modulusValues = row.slice(1);

//                 modulusValues.forEach((modulusValue, index) => {
//                     const strainRate = strainRates[index];
//                     const logStrainRate = Math.log10(strainRate);

//                     x.push(logStrainRate);
//                     y.push(temperature);
//                     z.push(modulusValue);

//                     // Create detailed hover text
//                     hoverTexts.push(
//                         `Temperature: ${temperature}°C<br>` +
//                         `Strain Rate: ${strainRate.toExponential(1)}<br>` +
//                         `Modulus: ${modulusValue.toFixed(2)} MPa`
//                     );
//                 });
//             });

//             // Prepare surface plot data
//             const temperatures = graphData.map(row => row[0]);
//             const logStrainRates = strainRates.map(rate => Math.log10(rate));

//             // Create z values matrix for surface
//             const zMatrix = graphData.map(row => row.slice(1));

//             // Create a 3D surface plot
//             const data = [
//                 // Scatter points with hover info
//                 {
//                     type: 'scatter3d',
//                     mode: 'markers',
//                     x: x,
//                     y: y,
//                     z: z,
//                     text: hoverTexts,
//                     hoverinfo: 'text',
//                     marker: {
//                         size: 4,
//                         color: z,
//                         colorscale: 'Viridis',
//                         opacity: 0.8
//                     }
//                 },
//                 // Surface plot
//                 {
//                     type: 'surface',
//                     x: logStrainRates,
//                     y: temperatures,
//                     z: zMatrix,
//                     colorscale: 'Viridis',
//                     hoverinfo: 'none',
//                     contours: {
//                         z: {
//                             show: true,
//                             usecolormap: true,
//                             highlightcolor: "#42f462",
//                             project: { z: true }
//                         }
//                     },
//                     opacity: 0.7
//                 }
//             ];

//             const layout = {
//                 title: 'Modulus vs Strain Rate and Temperature',
//                 autosize: true,
//                 height: 700,
//                 scene: {
//                     xaxis: {
//                         title: {
//                             text: 'Strain Rate (s⁻¹)',
//                             font: {
//                                 family: 'Arial, sans-serif',
//                                 size: 12,
//                                 color: '#000000'
//                             }
//                         },
//                         tickvals: [-6, -5, -4, -3, -2, -1],
//                         ticktext: ['10⁻⁶', '10⁻⁵', '10⁻⁴', '10⁻³', '10⁻²', '10⁻¹'],
//                         showspikes: false,
//                     },
//                     yaxis: {
//                         title: {
//                             text: 'Temperature (°C)',
//                             font: {
//                                 family: 'Arial, sans-serif',
//                                 size: 12,
//                                 color: '#000000'
//                             }
//                         },
//                         showspikes: false
//                     },
//                     zaxis: {
//                         title: {
//                             text: 'Storage Modulus (MPa)',
//                             font: {
//                                 family: 'Arial, sans-serif',
//                                 size: 12,
//                                 color: '#000000'
//                             }
//                         },
//                         showspikes: false
//                     },
//                     camera: {
//                         eye: { x: 1.5, y: 1.5, z: 1 },
//                         center: { x: 0, y: 0, z: 0 }
//                     },
//                     aspectratio: { x: 1, y: 1, z: 0.8 }
//                 },
//                 margin: {
//                     l: 10,
//                     r: 10,
//                     b: 40,
//                     t: 60,
//                     pad: 4
//                 },
//                 hoverlabel: {
//                     bgcolor: 'white',
//                     font: { size: 14 },
//                     bordercolor: '#333'
//                 }
//             };

//             const config = {
//                 responsive: true,
//                 displayModeBar: true,
//                 modeBarButtonsToAdd: ['toImage'],
//                 modeBarButtonsToRemove: [
//                     'pan3d',
//                     'resetCameraLastSave3d',
//                     'orbitRotation',
//                     'tableRotation'
//                 ],
//                 displaylogo: false
//             };

//             window.Plotly.newPlot('plot', data, layout, config);
//         } else {
//             setError("Cannot use Plotly or No data found");
//         }
//     };


//     // Render loading state
//     if (loading) {
//         return <Loader isLoading={loading} />
//     }

//     // Render error state

//     if (error) {
//         return <ErrorComponent
//             showErrorIcon={true}
//             showHeader={false}
//             showErrorCode={false}
//             errorMessage={"Oops! Something went wrong."}
//             subMessage='Some error occured while rendering the 3D implementation. You can see the 2D plot by clicking'
//             returnToUrl='/modulus-vs-strain-rate'
//         />
//     }


//     return (

//         <div className="w-full">
//             <div className="w-full border border-gray-200 rounded-lg shadow-sm overflow-hidden bg-white">
//                 <div className="px-6 py-4 border-b border-gray-200">
//                     <h2 className="text-xl font-semibold text-center text-gray-800">
//                         Modulus vs Strain Rate and Temperature (3D)
//                     </h2>
//                 </div>
//                 <div className="p-6">
//                     <div id="plot" className="w-full h-full"></div>
//                 </div>

//             </div>
//         </div>
//     );
// };

// export default ModulusVsStrainRateTemperature3D;

















import React, { useEffect, useState } from 'react';
import ErrorComponent from '../components/shared/ErrorComponent';
import Loader from '../components/shared/Loader';

const ModulusVsStrainRateTemperature3D = () => {
    const [isClient, setIsClient] = useState(false);
    const [graphData, setGraphData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load data and set client state
    useEffect(() => {
        setIsClient(true);
        try {
            // Retrieve graph data from sessionStorage
            const storedData = sessionStorage.getItem('graphData');
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                // Convert to the format needed for 3D visualization
                const processedData = parsedData.map(item => [
                    item["Ref Temp"],
                    ...item["Modulus Values"]
                ]);
                setGraphData(processedData);
            } else {
                // Fallback to sample data if no data is passed
                setError("No data available. Please return to the previous screen.");
            }
        } catch (err) {
            setError("Error processing data: " + err.message);
        } finally {
            setLoading(false);
        }

        return () => {
            if (typeof window !== 'undefined' && window.Plotly) {
                // Clean up Plotly when component unmounts
                try {
                    const plotElement = document.getElementById('plot');
                    if (plotElement) window.Plotly.purge('plot');
                } catch (error) {
                    console.log("Error when cleaning up Plotly", error);

                }
            }
        };
    }, []);

    // Load Plotly from CDN
    useEffect(() => {
        if (isClient && graphData.length > 0) {
            const script = document.createElement('script');
            script.src = 'https://cdn.plot.ly/plotly-3.0.0.min.js';
            script.async = true;
            script.onload = initPlot;
            document.body.appendChild(script);

            return () => {
                document.body.removeChild(script);
            };
        }
    }, [isClient, graphData]);

    const initPlot = () => {
        if (typeof window !== 'undefined' && window.Plotly && graphData.length > 0) {

            const plotElement = document.getElementById('plot');
            if (!plotElement) {
                console.warn('Plot element not found, skipping plot initialization');
                setError('Plot element not found');
                return <ErrorComponent
                    showErrorIcon={true}
                    showHeader={false}
                    showErrorCode={false}
                    errorMessage={"Oops! Something went wrong."}
                    subMessage='Some error occured while rendering the 3D implementation. You can see the 2D plot by clicking'
                    returnToUrl='/modulus-vs-strain-rate'
                />; // Exit if the element doesn't exist
            }
            // Define strain rates
            const strainRates = [1e-06, 1e-05, 0.0001, 0.001, 0.01, 0.1];

            // Transform data for 3D scatter plot
            const x = []; // strain rates (log scale)
            const y = []; // temperatures
            const z = []; // modulus values
            const hoverTexts = []; // detailed hover information

            // Prepare data for 3D visualization
            graphData.forEach(row => {
                const temperature = row[0];
                const modulusValues = row.slice(1);

                modulusValues.forEach((modulusValue, index) => {
                    const strainRate = strainRates[index];
                    const logStrainRate = Math.log10(strainRate);

                    x.push(logStrainRate);
                    y.push(temperature);
                    z.push(modulusValue);

                    // Create detailed hover text
                    hoverTexts.push(
                        `Temperature: ${temperature}°C<br>` +
                        `Strain Rate: ${strainRate.toExponential(1)}<br>` +
                        `Modulus: ${modulusValue.toFixed(2)} MPa`
                    );
                });
            });

            // Prepare surface plot data
            const temperatures = graphData.map(row => row[0]);
            const logStrainRates = strainRates.map(rate => Math.log10(rate));

            // Create z values matrix for surface
            const zMatrix = graphData.map(row => row.slice(1));

            // Create a 3D surface plot
            const data = [
                // Scatter points with hover info
                {
                    type: 'scatter3d',
                    mode: 'markers',
                    x: x,
                    y: y,
                    z: z,
                    text: hoverTexts,
                    hoverinfo: 'text',
                    marker: {
                        size: 4,
                        color: z,
                        colorscale: 'Viridis',
                        opacity: 0.8
                    }
                },
                // Surface plot
                {
                    type: 'surface',
                    x: logStrainRates,
                    y: temperatures,
                    z: zMatrix,
                    colorscale: 'Viridis',
                    hoverinfo: 'none',
                    contours: {
                        z: {
                            show: true,
                            usecolormap: true,
                            highlightcolor: "#42f462",
                            project: { z: true }
                        }
                    },
                    opacity: 0.7
                }
            ];

            const layout = {
                title: 'Modulus vs Strain Rate and Temperature',
                autosize: true,
                height: 700,
                scene: {
                    xaxis: {
                        title: {
                            text: 'Strain Rate (s⁻¹)',
                            font: {
                                family: 'Arial, sans-serif',
                                size: 16,
                                color: '#000000',
                                weight: '700'
                            }
                        },
                        tickvals: [-6, -5, -4, -3, -2, -1],
                        ticktext: ['10⁻⁶', '10⁻⁵', '10⁻⁴', '10⁻³', '10⁻²', '10⁻¹'],
                        showspikes: false,
                    },
                    yaxis: {
                        title: {
                            text: 'Temperature (°C)',
                            font: {
                                family: 'Arial, sans-serif',
                                size: 16,
                                color: '#000000',
                                weight: '700'
                            }
                        },
                        showspikes: false
                    },
                    zaxis: {
                        title: {
                            text: 'Storage Modulus (MPa)',
                            font: {
                                family: 'Arial, sans-serif',
                                size: 16,
                                color: '#000000',
                                weight: '700'
                            }
                        },
                        showspikes: false
                    },
                    camera: {
                        eye: { x: 1.5, y: 1.5, z: 1 },
                        center: { x: 0, y: 0, z: 0 }
                    },
                    aspectratio: { x: 1, y: 1, z: 0.8 }
                },
                margin: {
                    l: 10,
                    r: 10,
                    b: 40,
                    t: 60,
                    pad: 4
                },
                hoverlabel: {
                    bgcolor: 'white',
                    font: { size: 14 },
                    bordercolor: '#333'
                },
                // Add watermark annotation
                annotations: [{
                    showarrow: false,
                    text: 'NYU-ViscoMOD',
                    font: {
                        family: 'Arial, sans-serif',
                        size: 30,
                        color: 'rgba(0,0,0,0.5)'
                    },
                    xref: 'paper',
                    yref: 'paper',
                    x: 0.98,
                    y: 0.02,
                    xanchor: 'right',
                    yanchor: 'bottom'
                }]
            };

            const config = {
                responsive: true,
                displayModeBar: true,
                modeBarButtonsToAdd: ['toImage'],
                modeBarButtonsToRemove: [
                    'pan3d',
                    'resetCameraLastSave3d',
                    'orbitRotation',
                    'tableRotation'
                ],
                displaylogo: false,
                // Set filename for downloaded images
                toImageButtonOptions: {
                    format: 'png',
                    filename: 'Modulus vs Strain Rate and Temperature (3D)',
                    height: 800,
                    width: 1200,
                    scale: 1
                }
            };

            window.Plotly.newPlot('plot', data, layout, config);
        } else {
            setError("Cannot use Plotly or No data found");
        }
    };


    // Render loading state
    if (loading) {
        return <Loader isLoading={loading} />
    }

    // Render error state

    if (error) {
        return <ErrorComponent
            showErrorIcon={true}
            showHeader={false}
            showErrorCode={false}
            errorMessage={"Oops! Something went wrong."}
            subMessage='Some error occured while rendering the 3D implementation. You can see the 2D plot by clicking'
            returnToUrl='/modulus-vs-strain-rate'
        />
    }


    return (

        <div className="w-full">
            <div className="w-full border border-gray-200 rounded-lg shadow-sm overflow-hidden bg-white">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-center text-gray-800">
                        Modulus vs Strain Rate and Temperature (3D)
                    </h2>
                </div>
                <div className="p-6">
                    <div id="plot" className="w-full h-full"></div>
                </div>

            </div>
        </div>
    );
};

export default ModulusVsStrainRateTemperature3D;