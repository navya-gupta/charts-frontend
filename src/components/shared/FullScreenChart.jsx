import { useMeasure } from "@uidotdev/usehooks";
import React, { useEffect, useRef, useState } from 'react';
import { downloadChartDataAsExcel } from '../../utils/chartExcelUtil';
import { downloadChartAsImage } from '../../utils/chartUtils'; // Import the utility function


// Default watermark configuration
const DEFAULT_WATERMARK = {
    text: 'NYU-ViscoMOD',
    position: 'bottom-right',
    color: 'rgba(0,0,0,0.5)',
    fontSize: 30,
    rotation: 0,
    topShift: null,
    leftShift: null,
    rightShift: null,
    bottomShift: null
};

const FullscreenChart = ({
    children,
    title,
    className = '',
    actionButton = null,
    surplusActionButtons = [],
    showDownloadButton = true,
    downloadOptions = {},
    watermark = DEFAULT_WATERMARK, // Accept watermark as an object with configuration
    exportData = [] // Prop for Chart data to export
}) => {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const chartContainerRef = useRef(null);
    const chartContentRef = useRef(null);
    const watermarkRef = useRef(null);
    const downloadMenuRef = useRef(null);

    // Allow watermark to be a boolean, string, or object
    const watermarkConfig = (() => {
        if (watermark === false) return null;
        if (typeof watermark === 'string') return { ...DEFAULT_WATERMARK, text: watermark };
        if (typeof watermark === 'object') return { ...DEFAULT_WATERMARK, ...watermark };
        return DEFAULT_WATERMARK;
    })();

    // Function to toggle fullscreen
    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            // Enter fullscreen
            if (chartContainerRef.current.requestFullscreen) {
                chartContainerRef.current.requestFullscreen().catch(err => {
                    console.error(`Error attempting to enable fullscreen: ${err.message}`);
                });
            } else if (chartContainerRef.current.webkitRequestFullscreen) { /* Safari */
                chartContainerRef.current.webkitRequestFullscreen();
            } else if (chartContainerRef.current.msRequestFullscreen) { /* IE11 */
                chartContainerRef.current.msRequestFullscreen();
            }
        } else {
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) { /* Safari */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE11 */
                document.msExitFullscreen();
            }
        }
    };

    // Function to download chart
    const handleDownloadChart = () => {
        const options = {
            filename: `${title || 'chart'}.png`,
            ...downloadOptions
        };

        // Use the same watermark configuration for download if not explicitly overridden
        if (watermarkConfig && !downloadOptions.watermark) {
            options.watermark = {
                ...watermarkConfig,
                matchDomPosition: true // Tell the download function to match DOM position
            };
        }

        downloadChartAsImage(chartContentRef, options);
    };


    const handleDownloadChartData = () => {
        downloadChartDataAsExcel(exportData, `${title || 'chart'}_data.xlsx`);
        setIsDropdownOpen(false);
    };

    // Toggle dropdown visibility
    const handleToggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                downloadMenuRef.current &&
                !downloadMenuRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    // Update isFullScreen state when fullscreen changes
    useEffect(() => {
        const handleFullScreenChange = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullScreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
        document.addEventListener('mozfullscreenchange', handleFullScreenChange);
        document.addEventListener('MSFullscreenChange', handleFullScreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullScreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullScreenChange);
            document.removeEventListener('MSFullscreenChange', handleFullScreenChange);
        };
    }, []);

    // Calculate percentage values for positioning
    const getPositionStyle = () => {
        if (!watermarkConfig) return {};

        const position = watermarkConfig.position || 'bottom-right';
        const style = {
            // Default positioning based on named positions
            bottom: position.includes('bottom') ? (watermarkConfig.bottomShift || '10%') : 'auto',
            top: position.includes('top') ? (watermarkConfig.topShift || '10%') : 'auto',
            left: position.includes('left') ? (watermarkConfig.leftShift || '10%') : 'auto',
            right: position.includes('right') ? (watermarkConfig.rightShift || '10%') : 'auto',
        };

        // Center position requires special handling
        if (position === 'center') {
            style.top = '50%';
            style.left = '50%';
            style.transform = watermarkConfig.rotation
                ? `translate(-50%, -50%) rotate(${watermarkConfig.rotation}deg)`
                : 'translate(-50%, -50%)';
        } else if (watermarkConfig.rotation) {
            // Apply rotation for non-centered positions
            style.transform = `rotate(${watermarkConfig.rotation}deg)`;
        }

        return style;
    };



    return (
        <div
            ref={chartContainerRef}
            className={`flex flex-col items-center justify-evenly w-full ${isFullScreen ? 'fixed inset-0 bg-white z-50' : ''} ${className}`}
        >

            {title && <div className="w-full"><h2 className="text-2xl text-center font-semibold mt-4 mb-4">{title}</h2><hr /></div>}
            <div className="w-full flex justify-end items-center mb-2 mt-2">
                <div className="flex items-center space-x-2">
                    {actionButton}
                    {surplusActionButtons.map((button, index) => (
                        <React.Fragment key={`action-button-${index}`}>{button}</React.Fragment>
                    ))}
                    <button
                        onClick={toggleFullScreen}
                        className="border-0 bg-transparent p-2 rounded-md hover:text-gray-500 hover:border-0 hover:outline-none"
                        style={{ outline: 'none' }}
                        title={isFullScreen ? "Exit fullscreen" : "Enter fullscreen"}
                        aria-label={isFullScreen ? "Exit fullscreen" : "Enter fullscreen"}
                    >
                        {isFullScreen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5 4a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H7.414l6.293 6.293a1 1 0 0 1-1.414 1.414L6 6.414V9a1 1 0 1 1-2 0V5a1 1 0 0 1 1-1zm10 12a1 1 0 0 1-1 1h-4a1 1 0 1 1 0-2h2.586l-6.293-6.293a1 1 0 0 1 1.414-1.414L14 13.586V11a1 1 0 1 1 2 0v4a1 1 0 0 1-1 1z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 512 512" fill="currentColor">
                                <path d="M448 344v112a23.94 23.94 0 0 1-24 24H312c-21.39 0-32.09-25.9-17-41l36.2-36.2L224 295.6 116.77 402.9 153 439c15.09 15.1 4.39 41-17 41H24a23.94 23.94 0 0 1-24-24V344c0-21.4 25.89-32.1 41-17l36.19 36.2L184.46 256 77.18 148.7 41 185c-15.1 15.1-41 4.4-41-17V56a23.94 23.94 0 0 1 24-24h112c21.39 0 32.09 25.9 17 41l-36.2 36.2L224 216.4l107.23-107.3L295 73c-15.09-15.1-4.39-41 17-41h112a23.94 23.94 0 0 1 24 24v112c0 21.4-25.89 32.1-41 17l-36.19-36.2L263.54 256l107.28 107.3L407 327.1c15.1-15.2 41-4.5 41 16.9z" />
                            </svg>
                        )}
                    </button>
                    {showDownloadButton && (
                        <div className="relative">
                            <button
                                onClick={handleToggleDropdown}
                                className="bg-transparent p-2 border-0 rounded-md hover:text-gray-500 hover:outline-none outline-none transition-all hover:border-0"
                                title="Download options"
                                aria-label='Download options'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>

                            </button>

                            {isDropdownOpen && (
                                <div ref={downloadMenuRef} className="absolute right-0 mt-2 w-52 bg-white border rounded hover:border-0 hover:outline-0 z-10">
                                    <button
                                        onClick={handleDownloadChart}
                                        className="capitalize border-0 outline-0 bg-transparent block w-full text-left px-4 py-2 hover:bg-gray-100"
                                    >
                                        Download chart image
                                    </button>
                                    <hr />
                                    <button
                                        onClick={handleDownloadChartData}
                                        className="capitalize border-0 outline-0 bg-transparent block w-full text-left px-4 py-2 hover:bg-gray-100"
                                    >
                                        Download chart data
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex items-center justify-center w-full h-full hover:border-0 relative">
                <div
                    ref={chartContentRef}
                    className={`w-full relative`}
                >
                    {React.cloneElement(children, {
                        // height: isFullScreen ? '90%' : children.props.height || 400
                        height: isFullScreen ? 'auto' : children.props.height || 400
                    })}
                    {watermarkConfig && (
                        <div
                            ref={watermarkRef}
                            className="absolute z-10 pointer-events-none select-none chart-watermark"
                            style={{
                                ...getPositionStyle(),
                                fontSize: `${watermarkConfig.fontSize}px`,
                                color: watermarkConfig.color,
                                opacity: parseFloat(watermarkConfig.color.split(',')[3]) || 0.1,
                                zIndex: 10,
                                fontFamily: watermarkConfig.fontFamily || 'Arial'
                            }}
                        >
                            {watermarkConfig.text}
                        </div>
                    )}
                </div>
            </div>
            {/* <hr /><h2 className="text-2xl text-center font-semibold mt-4 mb-4">{title}</h2><hr /> */}

        </div>
    );
};

export default FullscreenChart;