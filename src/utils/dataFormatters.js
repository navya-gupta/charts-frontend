// MasterCurveGraph.jsx
export const masterCurveDataFormatter = (data) => {
    // Flatten nested data structure (specific to MasterCurveGraph format)

    const flattenedData = data.flatMap(temp =>
        temp.data.map(point => ({
            'Reference Temp (°C)': temp.reference_temp,
            'Frequency': point.frequency,
            'Storage Modulus': point.storage_modulus,
            'Fitted Storage Modulus': point.fitted_storage_modulus || null
        }))
    );

    return flattenedData;
};

// Modulus vs Strain Rate for Different Temperatures & Modulus vs Temperature for Different Strain Rates & Modulus vs Strain Rate Vs Temperatures (3D)
export const modulusVsStrainRateVsTemperatureDataFormatter = (data) => {
    const formattedData = data.map(tempDataArray => ({
        'Ref Temp (°C)': tempDataArray[0],
        'Strain Rate 1e-06 (1/s)': tempDataArray[1],
        'Strain Rate 1e-05 (1/s)': tempDataArray[2],
        'Strain Rate 0.0001 (1/s)': tempDataArray[3],
        'Strain Rate 0.001 (1/s)': tempDataArray[4],
        'Strain Rate 0.01 (1/s)': tempDataArray[5],
        'Strain Rate 0.1 (1/s)': tempDataArray[6]
    }));

    return formattedData;
};

// Shear Modulus V/S Frequency (Hz)
export const shearModulusVsFrequencyFormatter = (data) => {

    const flattenedData = data.flatMap(tempData =>
        tempData.data.map(point => ({
            'Reference Temp (°C)': tempData.temperature,
            'Frequency': point.Frequency,
            'Storage Modulus': point.StorageModulus,
        }))
    );

    return flattenedData;
};

// Relaxation Modulus With Time
export const relaxationModulusWithTime = (data) => {
    const formattedData = data.map(point => ({
        'Time (s)': point.time,
        'Relaxation Modulus (MPa)': point.Etime
    }));

    return formattedData;
};