import React, { useCallback, useEffect, useMemo, useState } from 'react';

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
import { getMasterCurveForAllTemperatures } from '../http';
import { masterCurveDataFormatter } from '../utils/dataFormatters';

const MasterCurveGraph = () => {
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [error, setError] = useState(null);
    const [isFittedCurveVisible, setIsFittedCurveVisible] = useState(true);

    useEffect(() => {
        const fetchGraphData = async () => {
            try {
                setIsLoading(true);
                const { data } = await getMasterCurveForAllTemperatures();

                console.log(data.graphData);
                if (data?.graphData && Array.isArray(data.graphData)) {
                    setChartData(data.graphData);

                }
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching graph data:', err);

                setError(err);
                console.log(error);
                setIsLoading(false);
            }
        };

        fetchGraphData();
    }, []);

    // Debounced window resize handler
    useEffect(() => {
        const handleResize = () => {
            // Using requestAnimationFrame to limit updates
            requestAnimationFrame(() => {
                setWindowWidth(window.innerWidth);
            });
        };

        // Throttle resize events
        let resizeTimer;
        const throttledResize = () => {
            if (!resizeTimer) {
                resizeTimer = setTimeout(() => {
                    resizeTimer = null;
                    handleResize();
                }, 100); // Adjust this timeout as needed
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

    // Memoize expensive calculations
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
            item.reference_temp !== undefined &&
            Array.isArray(item.data)
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

        // Helper function to generate log ticks for X-axis
        const generateXLogTicks = (min, max, exponentIncreaseStepUp) => {
            const minExp = Math.floor(Math.log10(min)) - 1;
            const maxExp = Math.floor(Math.log10(max)) + 1;
            return Array.from(
                { length: Math.floor((maxExp - minExp) / exponentIncreaseStepUp) + 1 },
                (_, i) => Math.pow(10, minExp + i * exponentIncreaseStepUp)
            );
        };

        // Generate Y-axis ticks at exact 100-unit intervals
        const generateYLinearTicks = (min, max) => {
            const intervalSize = 100;
            const minTick = Math.floor(min / intervalSize) * intervalSize;
            const maxTick = Math.ceil(max / intervalSize) * intervalSize;
            const tickCount = (maxTick - minTick) / intervalSize + 1;

            return Array.from(
                { length: tickCount },
                (_, i) => minTick + (i * intervalSize)
            );
        };

        const xTicks = generateXLogTicks(xDomain[0], xDomain[1], 2);
        const yTicks = generateYLinearTicks(yDomain[0], yDomain[1]);

        const xDomainExpanded = [xTicks[0], xTicks[xTicks.length - 1]];
        // Ensure Y domain starts from 0 and extends to the next multiple of 100 beyond the max value
        const yDomainExpanded = [0, Math.ceil(yDomain[1] / 100) * 100];

        return {
            hasValidDataStructure,
            frequencies,
            moduli,
            xDomain,
            yDomain,
            xTicks,
            yTicks,
            xDomainExpanded,
            yDomainExpanded
        };
    }, [chartData]);

    // Memoize custom components
    const CustomTickFormatter = useCallback(({ x, y, payload, isYAxis = false }) => {
        if (!payload.value) {
            return null;
        }

        // For X-axis (still log scale)
        if (!isYAxis) {
            const exponent = Math.log10(payload.value).toFixed(0);
            return (
                <text x={x} y={y} textAnchor="middle" dominantBaseline="hanging" dy={5}>
                    10<tspan dy={-4} fontSize="0.8em">{exponent}</tspan>
                </text>
            );
        }

        // For Y-axis (now linear scale)
        return (
            <text x={x} y={y} textAnchor="end" dominantBaseline="middle" dx={-10}>
                {payload.value}
            </text>
        );
    }, []);

    const CustomTooltip = useCallback(({ active, payload }) => {
        if (!active || !payload || !payload.length) {
            return null;
        }

        const referenceTemp = payload[0]?.payload?.reference_temp || '';
        const frequency = payload[0]?.payload?.frequency;
        const storageModulus = payload[0]?.payload?.storage_modulus;
        const fittedStorageModulus = payload[0]?.payload?.fitted_storage_modulus;

        return (
            <div className="bg-white p-3 border border-gray-300 rounded shadow-md max-w-xs">
                {referenceTemp && (
                    <p className="font-bold text-sm border-b pb-1 mb-2">Temperature: {referenceTemp}°C</p>
                )}
                <div className="text-xs space-y-1">
                    {frequency && (
                        <p>Frequency: {frequency.toExponential(2)} Hz</p>
                    )}
                    {storageModulus && (
                        <p>Storage Modulus: {storageModulus.toFixed(2)} MPa</p>
                    )}
                    {fittedStorageModulus && isFittedCurveVisible && (
                        <p>Fitted Modulus: {fittedStorageModulus.toFixed(2)} MPa</p>
                    )}
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
            <div className="relative w-11 h-6 bg-gray-300 rounded-full peer 
            transition-all duration-200 ease-in-out
            peer-checked:bg-[#54058c] 
            after:content-[''] 
            after:absolute 
            after:top-[2px] 
            after:left-[2px] 
            after:bg-white 
            after:border-gray-300 
            after:border 
            after:rounded-full 
            after:h-5 
            after:w-5 
            after:transition-all 
            after:duration-200
            after:ease-in-out
            peer-checked:after:translate-x-full 
            peer-checked:after:border-white">
            </div>
            <span className="ms-3 text-md font-medium text-gray-900">Fitted Curve</span>
        </label>
    );

    if (isLoading) {
        return <Loader isLoading={isLoading} />;
    }

    if (error) {
        return <ErrorComponent codeColor={error.status === 500 ? '#dc3545' : '#ffc107'} showErrorIcon={true} showHeader={true} showErrorCode={true} errorCode={error.status} errorMessage={error.message} subMessage='You can navigate to home page by clicking' />
    }

    if (!hasValidDataStructure) {
        return <ErrorComponent showErrorIcon={true} errorCode='400' errorMessage='Error: Invalid data structure' subMessage='Please try uploading a different CSV file or you can navigate to home page by clicking' />
    }

    if (frequencies.length === 0 || moduli.length === 0) {
        return <ErrorComponent showErrorIcon={true} errorCode='400' errorMessage='No valid data points found.' subMessage='Please try uploading a different CSV file or you can navigate to home page by clicking' />
    }

    const excelFormattedChartData = masterCurveDataFormatter(chartData);

    return (
        <FullscreenChart
            title='Master Curve for All Reference Temperatures'
            surplusActionButtons={[<ToggleFittedCurveButton key="toggle" />]}
            watermark={{
                text: 'NYU-ViscoMOD-Capturing',
                position: 'bottom-right',
                color: 'rgba(0,0,0,0.5)',
                fontSize: 30,
                rotation: 0,
                bottomShift: '10%',
                topShift: 0,
                leftShift: 0,
                rightShift: '4%'
            }}
            exportData={excelFormattedChartData}
        >
            <ResponsiveContainer width="100%" height={700} debounce={300}>
                <ComposedChart margin={{ top: 10, right: 30, left: 20, bottom: 30 }}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis
                        type="number"
                        dataKey="frequency"
                        scale="log"
                        domain={xDomainExpanded}
                        ticks={xTicks.slice(1)}
                        tick={(props) => <CustomTickFormatter {...props} isYAxis={false} />}
                        interval={0}
                        label={{ value: 'Reduced Frequency (Hz)', position: 'bottom', offset: 10 }}
                    />
                    <YAxis
                        type="number"
                        dataKey="storage_modulus"
                        scale="linear"
                        domain={yDomainExpanded}
                        ticks={yTicks}
                        tick={(props) => <CustomTickFormatter {...props} isYAxis={true} />}
                        interval={0}
                        label={{ value: 'Storage Modulus (MPa)', angle: -90, position: 'left', offset: -15 }}
                    />
                    <Tooltip content={<CustomTooltip />} />

                    <Legend
                        align='center'
                        verticalAlign='top'
                        iconSize={12}
                        wrapperStyle={{
                            paddingBottom: '20px'
                        }}
                    />

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
        </FullscreenChart>
    );
};

export default MasterCurveGraph;