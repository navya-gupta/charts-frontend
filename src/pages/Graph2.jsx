import axios from "axios";
import React, { useEffect, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const MasterCurve = () => {
    const [chartData, setChartData] = useState([]);

    // Fetch data using Axios
    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/get-master-curve-for-all-temperatures") // 🔹 Replace with actual API URL
            .then((response) => {
                console.log("Fetched Data:", response.data); // Debugging

                // Ensure graphData exists and is an array
                if (!response.data || !Array.isArray(response.data.graphData)) {
                    console.error("Invalid data format:", response.data);
                    return;
                }

                // Correctly process the nested structure
                const formattedData = response.data.graphData.flatMap(({ reference_temp, data }) =>
                    data.map(({ frequency, storage_modulus, fitted_storage_modulus }) => ({
                        frequency,
                        storage_modulus,
                        fitted_storage_modulus,
                        reference_temp, // ✅ Include reference temperature
                    }))
                );

                setChartData(formattedData);
            })
            .catch((error) => {
                console.error("Error fetching chart data:", error);
            });
    }, []);

    return (
        <div style={{ width: "100%", height: 400 }}>
            <h2>Storage Modulus vs. Frequency</h2>
            {chartData.length === 0 ? (
                <p>Loading chart data...</p>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="frequency"
                            tickFormatter={(tick) => tick.toFixed(2)}
                            label={{ value: "Frequency (Hz)", position: "insideBottom", offset: -5 }}
                        />
                        <YAxis label={{ value: "Modulus (MPa)", angle: -90, position: "insideLeft" }} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="storage_modulus" stroke="#8884d8" name="Storage Modulus" />
                        <Line type="monotone" dataKey="fitted_storage_modulus" stroke="#82ca9d" name="Fitted Storage Modulus" />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default MasterCurve;
