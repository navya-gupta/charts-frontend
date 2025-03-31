import React from 'react';

const ErrorComponent = ({
    errorCode = "500",
    codeColor = "#dc3545",
    returnToUrl = "/",
    errorMessage = "Oops! Something went wrong.",
    subMessage = "",
    showHeader = false,
    showErrorCode = false,
    showErrorIcon = false,
    showSubMessage = true
}) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-4xl">
                {/* Header */}
                {showHeader && <div className="mb-8">
                    <h1 className="text-2xl font-medium text-gray-700">
                        {errorCode} Error Page
                    </h1>
                    <div className="text-sm text-gray-500 mt-1">
                        <a href="/" className="text-blue-500 hover:underline">Home</a>
                        <span className="mx-2">/</span>
                        <span>{errorCode} Error Page</span>
                    </div>
                </div>}

                {/* Main Content */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                    {/* Error Code */}
                    {showErrorCode && <div className="text-9xl" style={{ color: codeColor }}>
                        {errorCode}
                    </div>}

                    {/* Error Message */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            {showErrorIcon && <div className={`bg-[${codeColor}] text-white rounded-full p-1`} style={{
                                background: codeColor
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>}
                            <h2 className="text-2xl">{errorMessage}</h2>
                        </div>
                        {showSubMessage && <p className="text-gray-600 mb-2">
                            {subMessage}{" "}
                            <a href={returnToUrl} className="text-blue-500 hover:underline">
                                here
                            </a>.
                        </p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErrorComponent;