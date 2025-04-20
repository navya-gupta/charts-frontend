import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ErrorComponent from '../components/shared/ErrorComponent';
import FullscreenChart from '../components/shared/FullScreenChart';
import Loader from '../components/shared/Loader';
import Slider from '../components/shared/Slider';
import { relaxationModulusWithTime } from '../utils/dataFormatters';

const RelaxationModulusChart = () => {
    const [upperBoundA, setUpperBoundA] = useState(500);
    const [upperBoundD, setUpperBoundD] = useState(500);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Add ref to track API calls
    const apiCallCount = useRef(0);


    // Modified debounce function with logging
    const debounce = (func, delay) => {
        let debounceTimer;
        return (...args) => {
            console.log(`Debounce called with args:`, args);
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                console.log(`Executing debounced function with args:`, args);
                func(...args);
            }, delay);
        };
    };


    const fetchData = useCallback(
        debounce(async (aBound, dBound) => {
            const currentCall = ++apiCallCount.current;
            console.log(`Starting API call #${currentCall} with bounds:`, { aBound, dBound });
            setLoading(true);
            setError(null);

            try {
                const urlParams = new URLSearchParams(window.location.search);
                const uploadIdFromUrl = urlParams.get('upload_id');

                const response = await axios.get(`/api/get-relaxtion-modulus-vs-time`, {
                    params: { a_upper_bound: aBound, d_upper_bound: dBound, upload_id: uploadIdFromUrl },
                });

                // Log the raw response
                console.log(`API call #${currentCall} response:`, response);

                console.log("Resp", response.data.graphData);

                if (response.data.status === 'success' && Array.isArray(response.data.graphData)) {
                    const processedData = response.data.graphData.map(point => ({
                        time: Number(point.time),
                        Etime: Number(point.Etime)
                    }));

                    setChartData(processedData);
                } else {
                    console.error(`API call #${currentCall} failed:`, response.data);
                    setError('Failed to fetch graph data');
                }

            } catch (err) {
                console.error(`API call #${currentCall} error:`, err);
                // setError(err.response?.data?.detail || 'Error fetching data');
                setError(err);
            } finally {
                setLoading(false);
            }

        }, 500)
        , []);

    useEffect(() => {
        fetchData(upperBoundA, upperBoundD)
    }, [upperBoundA, upperBoundD]);

    const handleSliderChange = (setter) => (e) => {
        const value = Number(e.target.value);
        setter(value);
    };

    // useEffect(() => {
    //     const fetchData = async () => {
    //         setLoading(true);
    //         setError('');

    //         try {
    //             const response = await axios.get(`/api/get-relaxtion-modulus-vs-time`, {
    //                 params: {
    //                     a_upper_bound: upperBoundA,
    //                     d_upper_bound: upperBoundD
    //                 }
    //             });

    //             if (response.data.status === 'success' && Array.isArray(response.data.graphData)) {
    //                 const processedData = response.data.graphData.map(point => ({
    //                     time: Number(point.time),
    //                     Etime: Number(point.Etime)
    //                 }));

    //                 setChartData(processedData);
    //             } else {
    //                 setError('Failed to fetch graph data');
    //             }
    //         } catch (err) {
    //             console.error('Fetch error:', err);
    //             setError(err.response?.data?.detail || 'Error fetching data');
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchData();
    // }, []); // Only fetch once on mount

    console.log('Chart render data:', {
        dataLength: chartData.length,
        firstPoint: chartData[0],
        lastPoint: chartData[chartData.length - 1],
        loading,
        error
    });

    // Calculate domains from actual data
    const xDomain = chartData.length > 0 ? [
        Math.min(...chartData.map(d => d.time)),
        Math.max(...chartData.map(d => d.time))
    ] : ['auto', 'auto'];

    const yDomain = chartData.length > 0 ? [
        Math.min(...chartData.map(d => d.Etime)),
        Math.max(...chartData.map(d => d.Etime))
    ] : ['auto', 'auto'];

    const generateLogTicks = (min, max, exponentIncreaseStepUp) => {
        const minExp = Math.floor(Math.log10(min)) - 1;
        const maxExp = Math.floor(Math.log10(max)) + 1;

        return Array.from({ length: Math.floor((maxExp - minExp) / exponentIncreaseStepUp) + 1 }, (_, i) => Math.pow(10, minExp + i * exponentIncreaseStepUp));
    }

    const xTicks = generateLogTicks(xDomain[0], xDomain[1], 2);
    const yTicks = generateLogTicks(yDomain[0], yDomain[1], 1);
    const xDomainExpanded = [xTicks[0], xTicks[xTicks.length - 1]];

    if (loading) {
        return <Loader isLoading={loading} />;
    }

    if (error) return <ErrorComponent codeColor={error.status === 500 ? '#dc3545' : '#ffc107'} showErrorIcon={true} showHeader={true} showErrorCode={true} errorCode={error.status} errorMessage={error.message} subMessage='You can navigate to home page by clicking' />

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

    const excelFormattedChartData = relaxationModulusWithTime(chartData);
    const xAxisLabelOffset = 30;
    const yAxisLabelOffset = -20;

    return (
        <FullscreenChart
            title='Relaxation Modulus with Time'
            watermark={{
                text: 'NYU-ViscoMOD',
                position: 'bottom-right',
                color: 'rgba(0,0,0,0.5)',
                fontSize: 30,
                rotation: 0,
                bottomShift: '12%',
                topShift: 0,
                leftShift: 0,
                rightShift: '5%'
            }}
            exportData={excelFormattedChartData}
        >


            <div className='w-full h-full'>
                <div className="flex flex-col justify-between items-center">
                    <div className="flex flex-col justify-center mb-5">
                        <Slider
                            label="Upper Bound for 'a'"
                            min={1}
                            max={2000}
                            value={upperBoundA}
                            onChange={setUpperBoundA}
                        />

                        <Slider
                            label="Upper Bound for 'd'"
                            min={1}
                            max={2000}
                            value={upperBoundD}
                            onChange={setUpperBoundD}
                        />
                    </div>
                </div>

                {/* Chart container with explicit dimensions */}
                {/* <div style={{ width: '100%', height: '500px', position: 'relative' }}>
                    {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>} */}

                {!loading && !error && chartData.length > 0 && (
                    <ResponsiveContainer width="100%" height={700}>
                        <LineChart
                            data={chartData}
                            margin={{ top: 10, right: 30, left: 70 + yAxisLabelOffset, bottom: 35 + xAxisLabelOffset }}
                        >
                            <XAxis
                                dataKey="time"
                                type="number"
                                scale="log"
                                domain={xDomainExpanded
                                }
                                ticks={xTicks.slice(1)}
                                tick={(props) => <CustomTickFormatter {...props} isYAxis={false} />}
                                // tickFormatter={(value) => `${value.toExponential(1)}`}
                                label={{
                                    value: 'Time (s)', position: 'bottom', offset: xAxisLabelOffset, fill: '#000', style: {
                                        fontSize: 18,
                                        fontWeight: '700'
                                    }
                                }}
                            />
                            <YAxis
                                type="number"
                                domain={yDomain}
                                ticks={yTicks}
                                tickFormatter={(value) => value.toFixed(1)}
                                label={{
                                    value: 'Relaxation Modulus (MPa)', angle: -90, position: 'insideLeft', offset: yAxisLabelOffset, fill: '#000', style: {
                                        fontSize: 18,
                                        fontWeight: '700'
                                    }
                                }}
                            />
                            <Tooltip
                                formatter={(value) => [value.toFixed(2), 'Modulus']}
                                labelFormatter={(value) => `Time: ${value.toExponential(2)} s`}
                            />
                            {/* <Legend /> */}
                            <Line
                                type="monotone"
                                dataKey="Etime"
                                stroke="#2ca02c"
                                dot={false}
                                name="Relaxation Modulus"
                                isAnimationActive={false}  // Disable animation for better performance
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* </div> */}

        </FullscreenChart>
    );
};

export default RelaxationModulusChart;