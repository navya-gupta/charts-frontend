import loaderImage from '../../assets/images/NYU_logo.jpg';
const Loader = ({ isLoading }) => {
    return (
        <div
            className={`fixed inset-0 flex items-center justify-center bg-white z-50 transition-transform duration-700 ${isLoading ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
                }`}
        >
            {loaderImage ? <img src={loaderImage} alt="Loading..." className="w-16 h-16 animate-pulse" /> : <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            }
        </div>

    );
};

export default Loader;
