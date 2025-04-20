import axios from 'axios'; // Import axios
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    CartesianGrid,
    ComposedChart,
    Legend,
    Line,
    ResponsiveContainer,
    Scatter,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import ErrorComponent from '../components/shared/ErrorComponent';
import FullscreenChart from '../components/shared/FullScreenChart';
import Loader from '../components/shared/Loader';
import Slider from '../components/shared/Slider';
import { masterCurveDataFormatter } from '../utils/dataFormatters';

const MasterCurveGraph = () => {
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [error, setError] = useState(null);
    const [isFittedCurveVisible, setIsFittedCurveVisible] = useState(true);
    const [upperBoundA, setUpperBoundA] = useState(500);
    const [upperBoundD, setUpperBoundD] = useState(500);
    const apiCallCount = useRef(0);

    // Debounce function
    const debounce = (func, delay) => {
        let debounceTimer;
        return (...args) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func(...args), delay);
        };
    };

    // Fetch data with debouncing and axios
    const fetchData = useCallback(
        debounce(async (aBound, dBound) => {
            const currentCall = ++apiCallCount.current;
            setIsLoading(true);
            setError(null);
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const uploadIdFromUrl = urlParams.get('upload_id');
                // Assuming you need this from the reference
                const response = await axios.get('/api/get-master-curve-for-all-temperatures', { // Adjust endpoint as needed
                    params: { a_upper_bound: aBound, d_upper_bound: dBound, upload_id: uploadIdFromUrl }
                });
                if (response.data.status === 'success' && Array.isArray(response.data.graphData)) {
                    setChartData(response.data.graphData);
                } else {
                    setError('Failed to fetch graph data');
                }
            } catch (err) {
                console.error(`API call #${currentCall} error:`, err);
                setError(err.response?.data?.detail || err.message);
            } finally {
                setIsLoading(false);
            }
        }, 500),
        []
    );

    useEffect(() => {
        fetchData(upperBoundA, upperBoundD);
    }, [upperBoundA, upperBoundD, fetchData]);

    useEffect(() => {
        const handleResize = () => requestAnimationFrame(() => setWindowWidth(window.innerWidth));
        let resizeTimer;
        const throttledResize = () => {
            if (!resizeTimer) {
                resizeTimer = setTimeout(() => {
                    resizeTimer = null;
                    handleResize();
                }, 100);
            }
        };
        window.addEventListener('resize', throttledResize);
        return () => {
            window.removeEventListener('resize', throttledResize);
            clearTimeout(resizeTimer);
        };
    }, []);

    const getColor = useCallback((index) => {
        const totalTemps = chartData.length;
        return `hsl(${(index * 360 / totalTemps)}, 70%, 50%)`;
    }, [chartData.length]);

    const {
        hasValidDataStructure,
        frequencies,
        moduli,
        xDomain,
        yDomain,
        xTicks,
        yTicks,
        xDomainExpanded,
        yDomainExpanded
    } = useMemo(() => {
        if (chartData.length === 0) {
            return {
                hasValidDataStructure: false,
                frequencies: [],
                moduli: [],
                xDomain: [0, 0],
                yDomain: [0, 0],
                xTicks: [],
                yTicks: [],
                xDomainExpanded: [0, 0],
                yDomainExpanded: [0, 0]
            };
        }
        const hasValidDataStructure = chartData.every(item =>
            item.reference_temp !== undefined && Array.isArray(item.data)
        );
        if (!hasValidDataStructure) {
            return {
                hasValidDataStructure: false,
                frequencies: [],
                moduli: [],
                xDomain: [0, 0],
                yDomain: [0, 0],
                xTicks: [],
                yTicks: [],
                xDomainExpanded: [0, 0],
                yDomainExpanded: [0, 0]
            };
        }
        const frequencies = [];
        const moduli = [];
        chartData.forEach(tempData => {
            tempData.data.forEach(point => {
                if (point.frequency) frequencies.push(point.frequency);
                if (point.storage_modulus) moduli.push(point.storage_modulus);
                if (point.fitted_storage_modulus) moduli.push(point.fitted_storage_modulus);
            });
        });
        if (frequencies.length === 0 || moduli.length === 0) {
            return {
                hasValidDataStructure: true,
                frequencies: [],
                moduli: [],
                xDomain: [0, 0],
                yDomain: [0, 0],
                xTicks: [],
                yTicks: [],
                xDomainExpanded: [0, 0],
                yDomainExpanded: [0, 0]
            };
        }
        const xDomain = [Math.min(...frequencies), Math.max(...frequencies)];
        const yDomain = [Math.min(...moduli), Math.max(...moduli)];
        const generateXLogTicks = (min, max, step) => {
            const minExp = Math.floor(Math.log10(min)) - 1;
            const maxExp = Math.floor(Math.log10(max)) + 1;
            return Array.from(
                { length: Math.floor((maxExp - minExp) / step) + 1 },
                (_, i) => Math.pow(10, minExp + i * step)
            );
        };
        const generateYLinearTicks = (min, max) => {
            const intervalSize = 100;
            const minTick = Math.floor(min / intervalSize) * intervalSize;
            const maxTick = Math.ceil(max / intervalSize) * intervalSize;
            return Array.from(
                { length: (maxTick - minTick) / intervalSize + 1 },
                (_, i) => minTick + (i * intervalSize)
            );
        };
        const xTicks = generateXLogTicks(xDomain[0], xDomain[1], 2);
        const yTicks = generateYLinearTicks(yDomain[0], yDomain[1]);
        const xDomainExpanded = [xTicks[0], xTicks[xTicks.length - 1]];
        const yDomainExpanded = [0, Math.ceil(yDomain[1] / 100) * 100];
        return { hasValidDataStructure, frequencies, moduli, xDomain, yDomain, xTicks, yTicks, xDomainExpanded, yDomainExpanded };
    }, [chartData]);

    const CustomTickFormatter = useCallback(({ x, y, payload, isYAxis = false }) => {
        if (!payload.value) return null;
        if (!isYAxis) {
            const exponent = Math.log10(payload.value).toFixed(0);
            return (
                <text x={x} y={y} textAnchor="middle" dominantBaseline="hanging" dy={5}>
                    10<tspan dy={-4} fontSize="0.8em">{exponent}</tspan>
                </text>
            );
        }
        return (
            <text x={x} y={y} textAnchor="end" dominantBaseline="middle" dx={-10}>
                {payload.value}
            </text>
        );
    }, []);

    const CustomTooltip = useCallback(({ active, payload }) => {
        if (!active || !payload || !payload.length) return null;
        const referenceTemp = payload[0]?.payload?.reference_temp || '';
        const frequency = payload[0]?.payload?.frequency;
        const storageModulus = payload[0]?.payload?.storage_modulus;
        const fittedStorageModulus = payload[0]?.payload?.fitted_storage_modulus;
        return (
            <div className="bg-white p-3 border border-gray-300 rounded shadow-md max-w-xs">
                {referenceTemp && <p className="font-bold text-sm border-b pb-1 mb-2">Temperature: {referenceTemp}°C</p>}
                <div className="text-xs space-y-1">
                    {frequency && <p>Frequency: {frequency.toExponential(2)} Hz</p>}
                    {storageModulus && <p>Storage Modulus: {storageModulus.toFixed(2)} MPa</p>}
                    {fittedStorageModulus && isFittedCurveVisible && <p>Fitted Modulus: {fittedStorageModulus.toFixed(2)} MPa</p>}
                </div>
            </div>
        );
    }, [isFittedCurveVisible]);

    const ToggleFittedCurveButton = () => (
        <label className="inline-flex items-center me-5 cursor-pointer">
            <input
                type="checkbox"
                checked={isFittedCurveVisible}
                onChange={() => setIsFittedCurveVisible(!isFittedCurveVisible)}
                className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-300 rounded-full peer transition-all duration-200 ease-in-out
                peer-checked:bg-[#54058c] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white
                after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                after:duration-200 after:ease-in-out peer-checked:after:translate-x-full peer-checked:after:border-white">
            </div>
            <span className="ms-3 text-md font-medium text-gray-900">Fitted Curve</span>
        </label>
    );

    if (isLoading) return <Loader isLoading={isLoading} />;
    if (error) return <ErrorComponent codeColor={error.status === 500 ? '#dc3545' : '#ffc107'} showErrorIcon={true} showHeader={true} showErrorCode={true} errorCode={error.status} errorMessage={error.message} subMessage='You can navigate to home page by clicking' />;
    if (!hasValidDataStructure) return <ErrorComponent showErrorIcon={true} errorCode='400' errorMessage='Error: Invalid data structure' subMessage='Please try uploading a different CSV file or you can navigate to home page by clicking' />;
    if (frequencies.length === 0 || moduli.length === 0) return <ErrorComponent showErrorIcon={true} errorCode='400' errorMessage='No valid data points found.' subMessage='Please try uploading a different CSV file or you can navigate to home page by clicking' />;

    const excelFormattedChartData = masterCurveDataFormatter(chartData);
    const xAxisLabelOffset = 30;
    const yAxisLabelOffset = -20;

    return (
        <FullscreenChart
            title='Master Curve for All Reference Temperatures'
            surplusActionButtons={[<ToggleFittedCurveButton key="toggle" />]}
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
                <ResponsiveContainer width="100%" height={700} debounce={300}>
                    <ComposedChart margin={{ top: 10, right: 30, left: 70 + yAxisLabelOffset, bottom: 35 + xAxisLabelOffset }}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis
                            type="number"
                            dataKey="frequency"
                            scale="log"
                            domain={xDomainExpanded}
                            ticks={xTicks.slice(1)}
                            tick={(props) => <CustomTickFormatter {...props} isYAxis={false} />}
                            interval={0}
                            label={{
                                value: 'Reduced Frequency (Hz)', position: 'bottom', offset: xAxisLabelOffset, fill: '#000', style: {
                                    fontSize: 18,
                                    fontWeight: '700'
                                }
                            }}
                        />
                        <YAxis
                            type="number"
                            dataKey="storage_modulus"
                            scale="linear"
                            domain={yDomainExpanded}
                            ticks={yTicks}
                            tick={(props) => <CustomTickFormatter {...props} isYAxis={true} />}
                            interval={0}
                            label={{
                                value: 'Storage Modulus (MPa)', angle: -90, position: 'insideLeft', offset: yAxisLabelOffset, fill: '#000', style: {
                                    fontSize: 18,
                                    fontWeight: '700'
                                }
                            }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend align='center' verticalAlign='top' iconSize={12} wrapperStyle={{ paddingBottom: '20px' }} />
                        {chartData.map((temp, index) => (
                            <Scatter
                                key={`scatter-${temp.reference_temp}`}
                                name={`${temp.reference_temp}°C`}
                                data={temp.data}
                                dataKey="storage_modulus"
                                fill={getColor(index)}
                                shape="circle"
                                legendType="line"
                                isAnimationActive={false}
                            />
                        ))}
                        {chartData.map((temp, index) => (
                            isFittedCurveVisible && (<Line
                                key={`line-${temp.reference_temp}`}
                                data={temp.data}
                                name={null}
                                type="monotone"
                                dataKey="fitted_storage_modulus"
                                stroke='#000000'
                                dot={false}
                                strokeDasharray="5 5"
                                legendType={'none'}
                                isAnimationActive={false}
                            />)
                        ))}
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </FullscreenChart>
    );
};

export default MasterCurveGraph;