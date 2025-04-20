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

const ModulusVsTemperatureGraph = () => {
    const navigate = useNavigate();
    const [graphData, setGraphData] = useState([]);
    const [loading, setLoading] = useState(true);
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
                setGraphData(transformedData);
            } catch (error) {
                console.error('Error fetching graph data:', error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchGraphData();
    }, []);

    // Prepare data for plotting - restructured for temperature on x-axis
    const preparedData = graphData.map((tempData) => {
        const dataPoint = { "Temperature": tempData["Ref Temp"] };

        // Add each strain rate as a separate property
        strainRates.forEach((rate, index) => {
            dataPoint[`Rate ${rate}`] = tempData["Modulus Values"][index];
        });

        return dataPoint;
    });

    // Format strain rate for display - fixed to properly display superscript
    const formatStrainRate = (rate) => {
        if (rate.includes('e-')) {
            const [base, exponent] = rate.split('e-');
            return `10^-${exponent}`;
        }
        return rate;
    };

    // Custom tooltip component - fixed to properly display the exponent
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-2 border border-gray-300 rounded shadow">
                    <p className="font-bold mb-1">Temperature: {label}°C</p>
                    {payload.map((entry, index) => {
                        // Extract the strain rate from the dataKey
                        const rateKey = entry.dataKey.replace('Rate ', '');

                        let displayRate;
                        let exponent;
                        let base;

                        // const [base, exponent] = rateKey.split('e-');
                        if (rateKey.includes('e-')) {
                            [base, exponent] = rateKey.split('e-0');
                            displayRate = `${exponent}`;
                        } else {
                            displayRate = rateKey;
                        }

                        return (
                            // <p
                            //     key={index}
                            //     style={{ color: entry.color }}
                            //     className="text-sm"
                            // >
                            //     Strain Rate {displayRate}: {entry.value.toFixed(2)}
                            // </p>

                            //     <li
                            //     key={`item-${index}`}
                            //     className="flex items-center gap-1"
                            //     style={{ color: entry.color }}
                            // >
                            //     <span className="inline-block w-3 h-3" style={{ backgroundColor: entry.color }} />
                            //     <span className="text-md">
                            //         Strain Rate 10<sup style={{ fontSize: '0.8em' }}>-{exponent}</sup>
                            //     </span>
                            // </li>


                            <p key={`tooltip-item-${index}`} className="text-md" style={{ color: entry.color }}>
                                Strain Rate 10<sup style={{ fontSize: '0.8em' }}>{Math.floor(Math.log10(rateKey))}</sup>: {entry.value.toFixed(2)}
                            </p>

                        );
                    })}
                </div>
            );
        }
        return null;
    };

    const CustomLegendContent = (props) => {
        const { payload } = props;

        return (
            <ul className="flex flex-wrap justify-center gap-4 py-2">
                {payload.map((entry, index) => {
                    const rateKey = entry.dataKey.replace('Rate ', '');
                    let displayText;

                    if (rateKey.includes('e-')) {
                        const [base, exponent] = rateKey.split('e-0');
                        return (
                            <li
                                key={`item-${index}`}
                                className="flex items-center gap-1"
                                style={{ color: entry.color }}
                            >
                                <span className="inline-block w-3 h-3" style={{ backgroundColor: entry.color }} />
                                <span className="text-md">
                                    Strain Rate 10<sup style={{ fontSize: '0.8em' }}>-{exponent}</sup>
                                </span>
                            </li>
                        );
                    }

                    return (
                        // <li
                        //     key={`item-${index}`}
                        //     className="flex items-center gap-1"
                        //     style={{ color: entry.color }}
                        // >
                        //     <span className="inline-block w-3 h-3" style={{ backgroundColor: entry.color }} />
                        //     <span className="text-sm">Strain Rate {rateKey}</span>
                        // </li>

                        <li
                            key={`item-${index}`}
                            className="flex items-center gap-1"
                            style={{ color: entry.color }}
                        >
                            <span className="inline-block w-3 h-3" style={{ backgroundColor: entry.color }} />
                            <span className="text-sm">
                                Strain Rate 10<sup style={{ fontSize: '0.8em' }}>{Math.floor(Math.log10(rateKey))}</sup>
                            </span>
                        </li>
                    );
                })}
            </ul>
        );
    };


    // Get color for strain rate lines
    const getColor = (index) => {
        return `hsl(${(index * 360 / strainRates.length)}, 70%, 50%)`;
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

    // Get min and max temperatures for X-axis domain
    const minTemp = Math.min(...preparedData.map(item => item.Temperature));
    const maxTemp = Math.max(...preparedData.map(item => item.Temperature));

    // Generate temperature ticks to ensure all temperatures are visible
    const generateTemperatureTicks = () => {
        const temps = preparedData.map(item => item.Temperature);
        // Sort temperatures and remove duplicates
        return [...new Set(temps)].sort((a, b) => a - b);
    };

    const excelFormattedChartData = modulusVsStrainRateVsTemperatureDataFormatter(rawData);
    const xAxisLabelOffset = 30;
    const yAxisLabelOffset = -20;

    return (
        <FullscreenChart
            title={'Modulus vs Temperature for Different Strain Rates'}
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
                            dataKey="Temperature"
                            type="number"
                            domain={[minTemp, maxTemp]}
                            ticks={generateTemperatureTicks()}
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
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            content={<CustomLegendContent />}
                            align='center'
                            verticalAlign='top'
                            iconSize={12}
                            formatter={(value) => {
                                if (value.startsWith('Strain Rate')) {
                                    return value;
                                }

                                const rate = value.slice(5);
                                let displayRate;

                                if (rate.includes('e-')) {
                                    const [base, exponent] = rate.split('e-');
                                    displayRate = `Strain Rate 10⁻${exponent}`;
                                } else {
                                    displayRate = `Strain Rate ${rate}`;
                                }

                                return displayRate;
                            }}
                            wrapperStyle={{
                                paddingBottom: '20px'
                            }}
                        />
                        {strainRates.map((rate, index) => (
                            <Line
                                key={rate}
                                type="monotone"
                                dataKey={`Rate ${rate}`}
                                stroke={getColor(index)}
                                strokeWidth={2}
                                dot={{ r: 3 }}
                                name={`Strain Rate ${rate}`}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </FullscreenChart>
    );
};

export default ModulusVsTemperatureGraph;