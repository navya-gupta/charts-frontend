// import axios from "axios";
// import { useEffect, useState } from "react";
// import {
//     CartesianGrid,
//     Legend,
//     Line,
//     LineChart,
//     ResponsiveContainer,
//     Tooltip,
//     XAxis,
//     YAxis
// } from "recharts";
// import Loader from "../components/shared/Loader";

// const SheerModulusVsFrequencyGraph = () => {
//     const [plotData, setPlotData] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchGraphData = async () => {
//             try {
//                 const response = await axios.get('http://127.0.0.1:8000/get-sheer-modulus-vs-frequency');
//                 console.log('Raw Graph Data:', response.data.graphData);
//                 setPlotData(response.data.graphData);
//                 setLoading(false);
//             } catch (error) {
//                 console.error('Error fetching graph data:', error);
//             }
//         };

//         fetchGraphData();
//     }, []);

//     // Function to render lines for each temperature
//     const renderLines = () => {
//         const uniqueTemperatures = plotData.map(tempData => tempData.temperature);
//         const totalTemps = uniqueTemperatures.length;
//         console.log(uniqueTemperatures);


//         return plotData.map((tempData, index) => (
//             <Line
//                 key={index}
//                 dataKey="StorageModulus"
//                 data={tempData.data}
//                 name={tempData.temperature}
//                 stroke={tempData.temperature === '30 °C' ? "#000000" : `hsl(${(index * 360 / totalTemps)}, 70%, 50%)`} // Dynamic color for each line
//                 dot={false}
//             />
//         ));
//     };

//     // Calculating xDomain
//     const allFrequencies = plotData.flatMap(entry => entry.data.map(d => d.Frequency));
//     const xDomain = [Math.min(...allFrequencies), Math.max(...allFrequencies)];

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
//             <text x={x} y={y} textAnchor={textAnchor} dominantBaseline={dominantBaseline} dx={dx} dy={dy}>
//                 10<tspan dy={-4} fontSize="0.8em">{exponent}</tspan>
//             </text>
//         );
//     };

//     if (loading) {
//         return <Loader isLoading={loading} />;
//     }

//     return (
//         <div className="flex flex-col items-center justify-evenly p-4 w-full h-full">
//             <h2 className="text-2xl text-center font-bold mb-4">Sheer Modulus V/S Frequency (Hz)</h2>
//             {loading ? (<Loader isLoading={loading} />) : (
//                 <ResponsiveContainer width="100%" height={600}>
//                     <LineChart>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis
//                             dataKey="Frequency"
//                             scale="log"
//                             // domain={['dataMin', 'dataMax']}
//                             domain={xDomain}
//                             type="number"
//                             // ticks={[0.1, 1, 10]}
//                             ticks={xTicks}
//                             // tickFormatter={(tick) => tick.toFixed(1)}
//                             // tickFormatter={(value) => `10^${Math.log10(value).toFixed(0)}`}
//                             tick={<CustomTickFormatter />}
//                             interval="preserveEnd"
//                             label={{ value: "Frequency (Hz)", position: "insideRight", offset: 50, fontSize: 18, style: { fontWeight: '15' }, fill: '#000' }}
//                             dy={10}
//                         />
//                         <YAxis
//                             label={{ value: "Shear Modulus (MPa)", angle: -90, position: "insideLeft", fontSize: 18, fill: '#000', style: { fontWeight: '15' } }}
//                         />
//                         <Tooltip formatter={value => value.toFixed(1)} />
//                         <Legend align="center"
//                             verticalAlign="top"
//                             iconSize={12}
//                             wrapperStyle={{ paddingBottom: "20px" }}
//                         />
//                         {renderLines()}
//                     </LineChart>
//                 </ResponsiveContainer>)}
//         </div>
//     );
// };

// export default SheerModulusVsFrequencyGraph;








import axios from "axios";
import { useEffect, useRef, useState } from "react";
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import ErrorComponent from "../components/shared/ErrorComponent";
import FullscreenChart from "../components/shared/FullScreenChart";
import Loader from "../components/shared/Loader";

const SheerModulusVsFrequencyGraph = () => {
    const [plotData, setPlotData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const chartContainerRef = useRef(null);

    useEffect(() => {
        const fetchGraphData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/get-sheer-modulus-vs-frequency');
                console.log('Raw Graph Data:', response.data.graphData);
                setPlotData(response.data.graphData);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching graph data:', err);
                setError(err);
            }
        };

        fetchGraphData();
    }, []);

    // Function to toggle fullscreen
    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            // Enter fullscreen
            if (chartContainerRef.current.requestFullscreen) {
                chartContainerRef.current.requestFullscreen().catch(err => {
                    console.error(`Error attempting to enable fullscreen: ${err.message}`);
                });
            } else if (chartContainerRef.current.webkitRequestFullscreen) { /* Safari */
                chartContainerRef.current.webkitRequestFullscreen();
            } else if (chartContainerRef.current.msRequestFullscreen) { /* IE11 */
                chartContainerRef.current.msRequestFullscreen();
            }
        } else {
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) { /* Safari */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE11 */
                document.msExitFullscreen();
            }
        }
    };

    // Update isFullScreen state when fullscreen changes
    useEffect(() => {
        const handleFullScreenChange = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullScreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
        document.addEventListener('mozfullscreenchange', handleFullScreenChange);
        document.addEventListener('MSFullscreenChange', handleFullScreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullScreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullScreenChange);
            document.removeEventListener('MSFullscreenChange', handleFullScreenChange);
        };
    }, []);

    // Function to render lines for each temperature
    const renderLines = () => {
        if (!plotData || plotData.length === 0) return null;

        const uniqueTemperatures = plotData.map(tempData => tempData.temperature);
        const totalTemps = uniqueTemperatures.length;

        return plotData.map((tempData, index) => (
            <Line
                key={index}
                dataKey="StorageModulus"
                data={tempData.data}
                name={tempData.temperature}
                stroke={tempData.temperature === '30 °C' ? "#000000" : `hsl(${(index * 360 / totalTemps)}, 70%, 50%)`}
                dot={false}
            />
        ));
    };

    // Calculating xDomain
    const calculateXDomain = () => {
        if (!plotData || plotData.length === 0) return [0.1, 10];

        const allFrequencies = plotData.flatMap(entry => entry.data.map(d => d.Frequency));
        return [Math.min(...allFrequencies) || 0.1, Math.max(...allFrequencies) || 10];
    };

    const xDomain = calculateXDomain();

    const generateLogTicks = (min, max, exponentIncreaseStepUp) => {
        const minExp = Math.floor(Math.log10(min));
        const maxExp = Math.floor(Math.log10(max));

        return Array.from({ length: Math.floor((maxExp - minExp) / exponentIncreaseStepUp) + 1 }, (_, i) => Math.pow(10, minExp + i * exponentIncreaseStepUp));
    }

    const xTicks = generateLogTicks(xDomain[0], xDomain[1], 1);

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
            <text x={x} y={y} textAnchor={textAnchor} dominantBaseline={dominantBaseline} dx={dx} dy={dy}>
                10<tspan dy={-4} fontSize="0.8em">{exponent}</tspan>
            </text>
        );
    };

    if (loading) {
        return <Loader isLoading={loading} />;
    }

    if (error) return <ErrorComponent codeColor={error.status === 500 ? '#dc3545' : '#ffc107'} showErrorIcon={true} showHeader={true} showErrorCode={true} errorCode={error.status} errorMessage={error.message} subMessage='You can navigate to home page by clicking' />
    // Create data structure for LineChart that works with all data
    const prepareDataForLineChart = () => {
        if (!plotData || plotData.length === 0) return [];

        // Create a single dataset for all temperatures
        return plotData.map(tempData => ({
            temperature: tempData.temperature,
            data: tempData.data
        }));
    };

    const chartData = prepareDataForLineChart();

    return (
        <FullscreenChart watermark={{
            text: 'NYU-ViscoMOD',
            position: 'bottom-right',
            color: 'rgba(0,0,0,0.5)',
            fontSize: 30,
            rotation: 0,
            bottomShift: '10%',
            topShift: 0,
            leftShift: 0,
            rightShift: '4%'
        }} title={'Sheer Modulus V/S Frequency (Hz)'} >
            <ResponsiveContainer width="100%" height={600}>
                <LineChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <XAxis
                        dataKey="Frequency"
                        scale="log"
                        domain={xDomain}
                        type="number"
                        ticks={xTicks}
                        tick={<CustomTickFormatter />}
                        interval="preserveEnd"
                        label={{ value: "Frequency (Hz)", position: "insideBottom", offset: -10, fontSize: 18, style: { fontWeight: '15' }, fill: '#000' }}
                        dy={10}
                    />
                    <YAxis
                        label={{ value: "Shear Modulus (MPa)", angle: -90, position: "insideLeft", fontSize: 18, fill: '#000', style: { fontWeight: '15' } }}
                    />
                    <Tooltip formatter={value => value.toFixed(1)} />
                    <Legend
                        align="center"
                        verticalAlign="top"
                        iconSize={12}
                        wrapperStyle={{ paddingBottom: "20px" }}
                    />
                    {renderLines()}
                </LineChart>
            </ResponsiveContainer>
        </FullscreenChart>
    );
};

export default SheerModulusVsFrequencyGraph;