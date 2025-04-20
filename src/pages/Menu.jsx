import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import masterCurveImage from '../assets/images/chart_images/master_curve_for_all_reference_temperatures.png';
import modulusVsStrainRateImage from '../assets/images/chart_images/modulus_vs_strain_rate.png';
import modulusVsTemperatureImage from '../assets/images/chart_images/modulus_vs_temperature.png';
import relaxationModulusWithTimeImage from '../assets/images/chart_images/relaxation_modulus_with_time.png';
import sheerModulusWithFrequencyImage from '../assets/images/chart_images/sheer_modulus_with_frequency.png';
import ChartCard from '../components/shared/ChartCard/ChartCard';
import Loader from '../components/shared/Loader';



const Menu = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [imagesLoaded, setImagesLoaded] = useState(0);
    const urlParams = new URLSearchParams(window.location.search);
    const uploadIdFromUrl = urlParams.get('upload_id');

    const chartInformationData = [
        {
            id: 1,
            title: 'Master Curve For All Reference Temperatures',
            chartImage: masterCurveImage,
            navigateUrl: `/master-curve-graph?upload_id=${uploadIdFromUrl}`
        },
        {
            id: 2,
            title: 'Modulus V/S Strain Rate',
            chartImage: modulusVsStrainRateImage,
            navigateUrl: `/modulus-vs-strain-rate?upload_id=${uploadIdFromUrl}`
        },
        {
            id: 3,
            title: 'Sheer Modulus With Frequency',
            chartImage: sheerModulusWithFrequencyImage,
            navigateUrl: `/sheer-modulus-vs-frequency?upload_id=${uploadIdFromUrl}`
        },
        {
            id: 4,
            title: 'Modulus V/S Temperature',
            chartImage: modulusVsTemperatureImage,
            navigateUrl: `/modulus-vs-temperature?upload_id=${uploadIdFromUrl}`
        },
        {
            id: 5,
            title: 'Relaxation Modulus With Time',
            chartImage: relaxationModulusWithTimeImage,
            navigateUrl: `/relaxation-modulus-with-time?upload_id=${uploadIdFromUrl}`
        }
    ];

    // Track image loading
    useEffect(() => {
        const totalImages = chartInformationData.length;
        const loadImages = () => {
            let loadedCount = 0;

            chartInformationData.forEach((chart) => {
                const img = new Image();
                img.src = chart.chartImage;
                img.onload = () => {
                    loadedCount++;
                    setImagesLoaded(loadedCount);
                    if (loadedCount === totalImages) {
                        setLoading(false);
                    }
                };
                img.onerror = () => {
                    loadedCount++;
                    setImagesLoaded(loadedCount);
                    if (loadedCount === totalImages) {
                        setLoading(false);
                    }
                };
            });
        };

        // Add slight delay to ensure component is mounted
        const timer = setTimeout(() => {
            loadImages();
        }, 100);

        return () => clearTimeout(timer);
    }, [chartInformationData]);

    const handleChartNavigation = (url) => {
        console.log(`Navigating to: ${url}`);
        navigate(url);
    };

    return (
        <>
            {loading && <Loader isLoading={loading} />}

            <div className="bg-gray-100 min-h-screen p-6">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6">Charts Available</h1>

                {loading && (
                    <div className="text-sm text-gray-600 mb-4">
                        Loading images: {imagesLoaded} of {chartInformationData.length}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {chartInformationData.map((chart) => (
                        <div key={chart.id} className="h-full">
                            <ChartCard
                                title={chart.title}
                                chartImage={chart.chartImage}
                                navigateUrl={chart.navigateUrl}
                                onShowChart={handleChartNavigation}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Menu;