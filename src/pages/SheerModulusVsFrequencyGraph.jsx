import { useEffect, useState } from "react";
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
import FullscreenChart from '../components/shared/FullScreenChart';
import Loader from "../components/shared/Loader";
import { getShearModulusVsFrequency } from "../http";
import { shearModulusVsFrequencyFormatter } from "../utils/dataFormatters";

const SheerModulusVsFrequencyGraph = () => {
    const [plotData, setPlotData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGraphData = async () => {
            try {
                const response = await getShearModulusVsFrequency();
                setPlotData(response.data.graphData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching graph data:', error);
            }
        };

        fetchGraphData();
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

    const excelFormattedChartData = shearModulusVsFrequencyFormatter(plotData);
    const xAxisLabelOffset = 30;
    const yAxisLabelOffset = -20;

    return (
        <FullscreenChart
            title="Shear Modulus V/S Frequency (Hz)"
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
                    <LineChart margin={{ top: 10, right: 30, left: 70 + yAxisLabelOffset, bottom: 35 + xAxisLabelOffset }}>
                        <XAxis
                            dataKey="Frequency"
                            scale="log"
                            domain={xDomain}
                            type="number"
                            ticks={xTicks}
                            tick={<CustomTickFormatter />}
                            interval="preserveEnd"
                            label={{
                                value: "Frequency (Hz)", position: 'bottom', offset: xAxisLabelOffset, fill: '#000', style: {
                                    fontSize: 18,
                                    fontWeight: '700'
                                }
                            }}

                            dy={10}
                        />
                        <YAxis
                            label={{
                                value: "Shear Modulus (MPa)", angle: -90, position: "insideLeft", offset: yAxisLabelOffset, fill: '#000', style: {
                                    fontSize: 18,
                                    fontWeight: '700'
                                }
                            }}
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
            </div>
        </FullscreenChart >
    );
};

export default SheerModulusVsFrequencyGraph;