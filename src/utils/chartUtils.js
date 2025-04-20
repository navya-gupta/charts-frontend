import React from 'react';

/**
 * Utility function to download a chart as an image
 * @param {React.RefObject} chartRef - Reference to the chart container element
 * @param {Object} options - Configuration options
 * @param {string} options.filename - Name of the downloaded file (default: 'chart.png')
 * @param {string} options.backgroundColor - Background color (default: 'white')
 * @param {Object} options.watermark - Watermark configuration
 * @param {string} options.watermark.text - Watermark text
 * @param {string} options.watermark.color - Watermark color (default: 'rgba(0,0,0,0.1)')
 * @param {string} options.watermark.position - Position ('top-left', 'top-right', 'bottom-left', 'bottom-right', 'center')
 * @param {number} options.watermark.fontSize - Font size in pixels (default: 36)
 * @param {number} options.watermark.rotation - Rotation angle in degrees (default: 0)
 * @param {string} options.watermark.fontFamily - Font family (default: 'Arial')
 * @param {string} options.format - Image format ('png' or 'jpeg') (default: 'png')
 * @param {number} options.quality - JPEG quality (0-1) (default: 0.95)
 * @param {number} options.scale - Scale factor for higher resolution (default: 2)
 */
export const downloadChartAsImage = (chartRef, options = {}) => {
    const {
        filename = 'chart.png',
        backgroundColor = 'white',
        watermark = null,
        format = 'png',
        quality = 0.95,
        scale = 2
    } = options;

    if (!chartRef.current) {
        console.error('Chart reference is not available');
        return;
    }

    try {
        // Get SVG element from the chart container
        const svgElement = chartRef.current.querySelector('svg');
        if (!svgElement) {
            console.error('SVG element not found');
            return;
        }

        // Create a clone of the SVG to avoid modifying the original
        const svgClone = svgElement.cloneNode(true);

        // Get computed styles and apply them to the cloned SVG
        const computedStyle = getComputedStyle(svgElement);
        const width = parseInt(computedStyle.width);
        const height = parseInt(computedStyle.height);

        svgClone.setAttribute('width', width);
        svgClone.setAttribute('height', height);

        // Set background
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('width', '100%');
        rect.setAttribute('height', '100%');
        rect.setAttribute('fill', backgroundColor);
        svgClone.insertBefore(rect, svgClone.firstChild);

        // Convert SVG to a data URL
        const svgData = new XMLSerializer().serializeToString(svgClone);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);

        // Create a canvas to convert SVG to PNG/JPEG
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            // Set canvas dimensions with scale factor for better quality
            canvas.width = width * scale;
            canvas.height = height * scale;

            // Draw background
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Scale the context to improve image quality
            ctx.scale(scale, scale);

            // Draw the image on the canvas
            ctx.drawImage(img, 0, 0, width, height);

            // Find existing watermark in the DOM if not explicitly overridden
            if (watermark) {
                // Check if we should try to match the DOM watermark position
                if (watermark.matchDomPosition) {
                    const watermarkElement = chartRef.current.querySelector('.chart-watermark');
                    if (watermarkElement) {
                        const chartRect = chartRef.current.getBoundingClientRect();
                        const watermarkRect = watermarkElement.getBoundingClientRect();

                        // Calculate relative position within the chart
                        const relativePos = {
                            left: (watermarkRect.left - chartRect.left) / chartRect.width * width,
                            top: (watermarkRect.top - chartRect.top) / chartRect.height * height,
                            width: watermarkRect.width / chartRect.width * width,
                            height: watermarkRect.height / chartRect.height * height
                        };

                        // Apply the DOM position to the canvas watermark
                        addWatermarkAtPosition(ctx, watermark, relativePos, width, height);
                    } else {
                        // Fallback to standard positioning if element not found
                        addWatermarkByPosition(ctx, watermark, width, height);
                    }
                } else {
                    // Use standard positioning calculation
                    addWatermarkByPosition(ctx, watermark, width, height);
                }
            }

            // Convert canvas to data URL and create download link
            const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
            const fileExtension = format === 'jpeg' ? 'jpg' : 'png';

            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = filename.endsWith(`.${fileExtension}`)
                    ? filename
                    : `${filename}.${fileExtension}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                URL.revokeObjectURL(svgUrl);
            }, mimeType, quality);
        };

        img.src = svgUrl;
    } catch (err) {
        console.error('Error downloading chart:', err);
    }
};

/**
 * Add watermark at the exact position from DOM
 * @private
 */
const addWatermarkAtPosition = (ctx, watermark, position, width, height) => {
    const {
        text = 'NYU-ViscoMOD',
        color = 'rgba(0,0,0,0.1)',
        fontSize = 36,
        fontFamily = 'Arial',
        rotation = 0
    } = watermark;

    // Set text properties
    ctx.save();
    ctx.fillStyle = color;
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textBaseline = 'middle';

    // Apply rotation if specified
    if (rotation !== 0) {
        const centerX = position.left + position.width / 2;
        const centerY = position.top + position.height / 2;
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation * Math.PI / 180);
        ctx.translate(-centerX, -centerY);
    }

    // Draw text at the exact position
    ctx.fillText(text, position.left, position.top + position.height / 2);
    ctx.restore();
};

/**
 * Add watermark based on position string (for backward compatibility)
 * @private
 */
const addWatermarkByPosition = (ctx, watermark, width, height) => {
    const {
        text = 'NYU-ViscoMOD',
        color = 'rgba(0,0,0,0.1)',
        position = 'bottom-right',
        fontSize = 36,
        fontFamily = 'Arial',
        rotation = 0,
        bottomShift = null,
        topShift = null,
        leftShift = null,
        rightShift = null
    } = watermark;

    // Set text properties
    ctx.save();
    ctx.fillStyle = color;
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textBaseline = 'middle';

    const textWidth = ctx.measureText(text).width;
    const textHeight = fontSize;

    // Calculate position with percentage-based positioning
    let x, y;

    // Convert percentage shift values to pixel values
    const getShiftValue = (shiftValue, dimension) => {
        if (!shiftValue) return null;
        if (typeof shiftValue === 'string' && shiftValue.endsWith('%')) {
            return (parseFloat(shiftValue) / 100) * dimension;
        }
        return parseFloat(shiftValue);
    };

    const bottomShiftPx = getShiftValue(bottomShift, height);
    const topShiftPx = getShiftValue(topShift, height);
    const leftShiftPx = getShiftValue(leftShift, width);
    const rightShiftPx = getShiftValue(rightShift, width);

    switch (position) {
        case 'top-left':
            x = leftShiftPx || width * 0.1;
            y = topShiftPx || height * 0.1;
            break;
        case 'top-right':
            x = rightShiftPx ? width - textWidth - rightShiftPx : width * 0.9 - textWidth;
            y = topShiftPx || height * 0.1;
            break;
        case 'bottom-left':
            x = leftShiftPx || width * 0.1;
            y = bottomShiftPx ? height - bottomShiftPx : height * 0.9;
            break;
        case 'center':
            x = (width - textWidth) / 2;
            y = height / 2;
            break;
        case 'bottom-right':
        default:
            x = rightShiftPx ? width - textWidth - rightShiftPx : width * 0.9 - textWidth;
            y = bottomShiftPx ? height - bottomShiftPx : height * 0.9;
            break;
    }

    // Apply rotation if specified
    if (rotation !== 0) {
        const centerX = x + textWidth / 2;
        const centerY = y;
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation * Math.PI / 180);
        ctx.translate(-centerX, -centerY);
    }

    // Draw text
    ctx.fillText(text, x, y);
    ctx.restore();
};

/**
 * Hook to create a downloadable chart
 * @param {Object} options - Download options
 * @returns {Object} chart reference and download function
 */
export const useChartDownload = (options = {}) => {
    const chartRef = React.useRef(null);

    const downloadChart = (customOptions = {}) => {
        downloadChartAsImage(chartRef, { ...options, ...customOptions });
    };

    return { chartRef, downloadChart };
};