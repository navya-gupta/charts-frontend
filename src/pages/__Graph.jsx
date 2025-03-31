import axios from 'axios';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Slider from '../components/shared/Slider';

const RelaxationModulusChart = () => {
    const [bounds, setBounds] = useState({ a: 500, d: 500 });
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);  // Start with true
    const [error, setError] = useState('');

    // Cache for API responses
    const responseCache = useRef(new Map());

    // Track if component is mounted
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    // Memoize the data processing function
    const processApiResponse = useMemo(() => (data) => {
        if (Array.isArray(data)) {
            return data.map(point => ({
                time: Number(point.time),
                Etime: Number(point.Etime)
            }));
        }
        return [];
    }, []);

    // Generate cache key
    const getCacheKey = (a, d) => `${a}-${d}`;

    // Optimized data fetching with caching
    const fetchData = useCallback(async (newBounds) => {
        const cacheKey = getCacheKey(newBounds.a, newBounds.d);

        // Check cache first
        if (responseCache.current.has(cacheKey)) {
            setChartData(responseCache.current.get(cacheKey));
            setLoading(false);
            return;
        }

        if (!isMounted.current) return;

        try {
            setLoading(true);
            const response = await axios.get('/api/get-relaxtion-modulus-vs-time', {
                params: {
                    a_upper_bound: newBounds.a,
                    d_upper_bound: newBounds.d
                }
            });

            if (!isMounted.current) return;

            if (response.data.status === 'success' && Array.isArray(response.data.graphData)) {
                const processedData = processApiResponse(response.data.graphData);
                responseCache.current.set(cacheKey, processedData);
                setChartData(processedData);
                setError('');
            } else {
                setError('Invalid data received from server');
            }
        } catch (err) {
            if (isMounted.current) {
                setError(err.response?.data?.detail || 'Error fetching data');
                console.error('Fetch error:', err);
            }
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
        }
    }, [processApiResponse]);

    // Handle bound changes with throttling
    const handleBoundChange = useCallback((key, value) => {
        setBounds(prev => {
            const newBounds = { ...prev, [key]: value };
            // Only fetch if the value has changed
            if (prev[key] !== value) {
                fetchData(newBounds);
            }
            return newBounds;
        });
    }, [fetchData]);

    // Initial data fetch
    useEffect(() => {
        fetchData(bounds);
    }, []); // Only fetch on mount

    // Memoize chart computations
    const chartComputations = useMemo(() => {
        if (!chartData.length) return {};

        const xDomain = [
            Math.min(...chartData.map(d => d.time)),
            Math.max(...chartData.map(d => d.time))
        ];

        const yDomain = [
            Math.min(...chartData.map(d => d.Etime)),
            Math.max(...chartData.map(d => d.Etime))
        ];

        const xTicks = Array.from({ length: 5 }, (_, i) => {
            const minExp = Math.log10(xDomain[0]);
            const maxExp = Math.log10(xDomain[1]);
            const exp = minExp + (i * (maxExp - minExp) / 4);
            return Math.pow(10, exp);
        });

        const yTicks = Array.from({ length: 6 }, (_, i) => {
            return yDomain[0] + (i * (yDomain[1] - yDomain[0]) / 5);
        });

        return { xDomain, yDomain, xTicks, yTicks };
    }, [chartData]);

    return (
        <div style={{ width: '100%', height: '600px', padding: '20px' }}>
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold mb-4 items-start">Relaxation Modulus with Time</h2>
                <div className="flex flex-col justify-center items-end mb-5">
                    <Slider
                        label="Upper Bound for 'a'"
                        min={100}
                        max={1000}
                        value={bounds.a}
                        onChange={(value) => handleBoundChange('a', value)}
                        disabled={loading}
                    />
                    <Slider
                        label="Upper Bound for 'd'"
                        min={100}
                        max={1000}
                        value={bounds.d}
                        onChange={(value) => handleBoundChange('d', value)}
                        disabled={loading}
                    />
                </div>
            </div>

            <div style={{ width: '100%', height: '500px', position: 'relative' }}>
                {loading && (
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: 'rgba(255, 255, 255, 0.8)',
                        padding: '20px',
                        borderRadius: '8px',
                        zIndex: 1000
                    }}>
                        Loading graph...
                    </div>
                )}
                {error && (
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: 'red',
                        background: 'rgba(255, 255, 255, 0.8)',
                        padding: '20px',
                        borderRadius: '8px',
                        zIndex: 1000
                    }}>
                        {error}
                    </div>
                )}

                {chartData.length > 0 && (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 60, bottom: 30 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="time"
                                type="number"
                                scale="log"
                                domain={chartComputations.xDomain}
                                ticks={chartComputations.xTicks}
                                tickFormatter={(value) => `${value.toExponential(1)}`}
                                label={{ value: 'Time (s)', position: 'bottom', offset: 20 }}
                            />
                            <YAxis
                                type="number"
                                domain={chartComputations.yDomain}
                                ticks={chartComputations.yTicks}
                                tickFormatter={(value) => value.toFixed(1)}
                                label={{ value: 'Relaxation Modulus (MPa)', angle: -90, position: 'insideLeft', offset: -40 }}
                            />
                            <Tooltip
                                formatter={(value) => [value.toFixed(2), 'Modulus']}
                                labelFormatter={(value) => `Time: ${value.toExponential(2)} s`}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="Etime"
                                stroke="#2ca02c"
                                dot={false}
                                name="Relaxation Modulus"
                                isAnimationActive={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default RelaxationModulusChart;