import axios from "axios";
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

const Graph = () => {
    const [plotData, setPlotData] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchGraphData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/get-sheer-modulus-vs-frequency');
                console.log('Raw Graph Data:', response.data.graphData);
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
        return plotData.map((tempData, index) => (
            <Line
                key={index}
                dataKey="StorageModulus"
                data={tempData.data}
                name={tempData.temperature}
                stroke={`hsl(${index * 30}, 70%, 50%)`} // Dynamic color for each line
                dot={false}
            />
        ));
    };

    // return (
    //     <ResponsiveContainer width="100%" height={600}>
    //         <LineChart>
    //             <CartesianGrid strokeDasharray="3 3" />
    //             <XAxis
    //                 dataKey="Frequency"
    //                 scale="log"
    //                 domain={['dataMin', 'dataMax']}
    //                 type="number"
    //                 tickFormatter={(tick) => tick.toFixed(1)}
    //                 label={{ value: "Frequency (Hz)", position: "bottom", offset: -5 }}
    //             />
    //             <YAxis
    //                 label={{ value: "Shear Modulus (MPa)", angle: -90, position: "insideLeft" }}
    //             />
    //             <Tooltip />
    //             <Legend />
    //             {renderLines()}
    //         </LineChart>
    //     </ResponsiveContainer>
    // );

    // const LogTickFormatter = ({ x, y, payload }) => {
    //     const value = payload.value;
    //     let label = "";

    //     if (value === 0.1) {
    //         label = "10⁻¹";
    //     } else if (value === 1) {
    //         label = "10⁰";
    //     } else if (value === 10) {
    //         label = "10¹";
    //     }

    //     return (
    //         <text x={x} y={y + 20} textAnchor="middle" fontSize={18}>
    //             {label}
    //         </text>
    //     );
    // };

    // LogTickFormatter.propTypes = {
    //     x: PropTypes.number.isRequired,
    //     y: PropTypes.number.isRequired,
    //     payload: PropTypes.shape({
    //         value: PropTypes.number.isRequired
    //     }).isRequired
    // };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Sheer Modulus V/S Frequency (Hz)</h2>
            {loading ? (<p>Loading. . .</p>) : (
                <ResponsiveContainer width="100%">
                    <LineChart>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="Frequency"
                            scale="log"
                            domain={[0.1, 10]}
                            type="number"
                            tick={{ fontSize: 18 }}
                            ticks={[0.1, 1, 10]}
                            label={{
                                value: "Frequency (Hz)", position: "insideBottom", style: {
                                    fontSize: 18,
                                    margin: { top: 20 },
                                    textAnchor: 'middle',
                                    offset: -10
                                }
                            }}
                        />
                        <YAxis
                            label={{ value: "Shear Modulus (MPa)", angle: -90, position: "insideLeft", offset: 0, style: { textAnchor: 'middle' } }}
                        />
                        <Tooltip />
                        <Legend verticalAlign="bottom" align="center" wrapperStyle={{ marginTop: 20 }} />
                        {renderLines()}
                    </LineChart>
                </ResponsiveContainer>
            )}

        </div>
    )
};

export default Graph;
