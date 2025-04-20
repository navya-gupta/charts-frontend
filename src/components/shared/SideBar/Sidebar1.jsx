import { Link, useLocation } from 'react-router-dom';
import { GraphIcon, HomeIcon, MenuIcon, UploadIcon } from '../../../assets/svgs/SidebarIconsSVG';
import SidebarMenuItem from './SidebarMenuItem';

const Sidebar = ({ collapsed, toggleSidebar }) => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };
    const menuItems = [
        { url: '/', title: 'Home', icon: HomeIcon },
        { url: '/upload', title: 'Upload CSV', icon: UploadIcon },
        { url: '/menu', title: 'Menu', icon: MenuIcon },
        { url: '/graph', title: 'Graph', icon: GraphIcon }
    ];


    return (
        <div className={`${collapsed ? 'w-16' : 'w-64'} min-h-screen bg-[#343a40] text-white flex-shrink-0 transition-all duration-300`}>
            {/* Header */}
            <div className="flex items-center p-4 border-b border-gray-700">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-xl font-bold">A</span>
                </div>
                {!collapsed && <h1 className="text-white text-xl font-semibold">Options</h1>}
                <button
                    onClick={toggleSidebar}
                    className={`ml-auto text-white focus:outline-none transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            </div>

            {/* Menu Items */}
            <div className="overflow-y-auto h-[calc(100vh-72px)]">
                {/* <ul>
                    <li>
                        <Link
                            to="/"
                            className={`flex text-white items-center py-3 ${collapsed ? 'justify-center px-2' : 'px-4'} hover:bg-[#494e53] hover:text-white ${isActive('/') ? 'bg-[#007bff]' : ''}`}
                        >
                            <div className={`${collapsed ? 'w-8' : 'w-6 mr-3'} flex justify-center`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            </div>
                            {!collapsed && <span>Home</span>}
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/upload"
                            className={`flex items-center py-3 text-white hover:text-white ${collapsed ? 'justify-center px-2' : 'px-4'} hover:bg-[#494e53] ${isActive('/upload') ? 'bg-[#007bff]' : ''}`}
                        >
                            <div className={`${collapsed ? 'w-8' : 'w-6 mr-3'} flex justify-center`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                            </div>
                            {!collapsed && <span>Upload CSV</span>}
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/menu"
                            className={`flex items-center py-3 text-white hover:text-white ${collapsed ? 'justify-center px-2' : 'px-4'} hover:bg-[#494e53] ${isActive('/menu') ? 'bg-[#007bff]' : ''}`}
                        >
                            <div className={`${collapsed ? 'w-8' : 'w-6 mr-3'} flex justify-center`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </div>
                            {!collapsed && <span>Menu</span>}
                        </Link>
                    </li>
                    <li>
                        <div className='p-2'>
                            <Link
                                to="/graph"
                                className={`rounded-md flex items-center py-3 text-white hover:text-white ${collapsed ? 'justify-center px-2' : 'px-4'} hover:bg-${isActive('/graph') ? '[#007bff]' : '[#494e53]'} ${isActive('/graph') ? 'bg-[#007bff]' : ''}`}
                            >
                                <div className={`${collapsed ? 'w-8' : 'w-6 mr-3'} flex justify-center`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                {!collapsed && <span>Graph</span>}
                            </Link>
                        </div>
                    </li>
                </ul> */}
                <ul>
                    {menuItems.map((item, index) => {
                        <SidebarMenuItem
                            key={index}
                            url={item.url}
                            title={item.title}
                            collapsed={collapsed}
                            isActive={isActive}
                        />
                    })}
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;

















// const Sidebar = () => {
//     const location = useLocation();
//     const [expandedMenus, setExpandedMenus] = useState({
//         layout: false,
//         charts: false,
//         ui: false,
//         forms: false,
//         tables: false,
//         mailbox: false,
//         pages: false,
//         extras: false,
//     });

//     const toggleMenu = (menu) => {
//         setExpandedMenus(prev => ({
//             ...prev,
//             [menu]: !prev[menu]
//         }));
//     };

//     const isActive = (path) => {
//         return location.pathname === path;
//     };

//     return (
//         <div className="w-64 min-h-screen bg-gray-800 text-gray-300 flex-shrink-0">
//             {/* Header */}
//             <div className="flex items-center p-4 border-b border-gray-700">
//                 <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mr-3">
//                     <span className="text-xl font-bold">F</span>
//                 </div>
//                 <h1 className="text-white text-xl font-semibold">AdminLTE 3</h1>
//             </div>

//             {/* Search Bar */}
//             <div className="p-4 border-b border-gray-700">
//                 <div className="flex">
//                     <input
//                         type="text"
//                         placeholder="Search"
//                         className="w-full bg-gray-700 text-white rounded-l py-2 px-3 focus:outline-none"
//                     />
//                     <button className="bg-gray-600 px-3 rounded-r">
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                         </svg>
//                     </button>
//                 </div>
//             </div>

//             {/* Menu Items */}
//             <div className="overflow-y-auto h-[calc(100vh-150px)]">
//                 <ul>
//                     <li>
//                         <Link to="/menu" className={`flex items-center py-3 px-4 hover:bg-gray-700 ${isActive('/menu') ? 'bg-blue-600' : ''}`}>
//                             <div className="w-6 mr-3">
//                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
//                                 </svg>
//                             </div>
//                             <span>Dashboard</span>
//                         </Link>
//                     </li>
//                     <li>
//                         <Link to="/widgets" className="flex items-center py-3 px-4 hover:bg-gray-700">
//                             <div className="w-6 mr-3">
//                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                                 </svg>
//                             </div>
//                             <span>Widgets</span>
//                             <span className="ml-auto bg-red-600 text-white text-xs px-2 py-1 rounded">New</span>
//                         </Link>
//                     </li>
//                     <li>
//                         <button
//                             onClick={() => toggleMenu('layout')}
//                             className="flex items-center w-full py-3 px-4 hover:bg-gray-700"
//                         >
//                             <div className="w-6 mr-3">
//                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
//                                 </svg>
//                             </div>
//                             <span>Layout Options</span>
//                             <span className="ml-auto flex items-center">
//                                 <span className="bg-cyan-600 text-white text-xs px-2 py-1 rounded mr-2">6</span>
//                                 <svg
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     className={`h-4 w-4 transition-transform ${expandedMenus.layout ? 'rotate-90' : ''}`}
//                                     fill="none"
//                                     viewBox="0 0 24 24"
//                                     stroke="currentColor"
//                                 >
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                                 </svg>
//                             </span>
//                         </button>
//                     </li>
//                     <li>
//                         <button
//                             onClick={() => toggleMenu('charts')}
//                             className="flex items-center w-full py-3 px-4 hover:bg-gray-700"
//                         >
//                             <div className="w-6 mr-3">
//                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//                                 </svg>
//                             </div>
//                             <span>Charts</span>
//                             <span className="ml-auto">
//                                 <svg
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     className={`h-4 w-4 transition-transform ${expandedMenus.charts ? 'rotate-90' : ''}`}
//                                     fill="none"
//                                     viewBox="0 0 24 24"
//                                     stroke="currentColor"
//                                 >
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                                 </svg>
//                             </span>
//                         </button>
//                     </li>
//                     <li>
//                         <Link to="/graph" className={`flex items-center py-3 px-4 hover:bg-gray-700 ${isActive('/graph') ? 'bg-blue-600' : ''}`}>
//                             <div className="w-6 mr-3">
//                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//                                 </svg>
//                             </div>
//                             <span>Master Curve Graph</span>
//                         </Link>
//                     </li>

//                     {/* EXAMPLES Section */}
//                     <li className="mt-4 px-4 mb-2">
//                         <span className="text-xs font-bold text-gray-500">EXAMPLES</span>
//                     </li>
//                     <li>
//                         <Link to="/calendar" className="flex items-center py-3 px-4 hover:bg-gray-700">
//                             <div className="w-6 mr-3">
//                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                                 </svg>
//                             </div>
//                             <span>Calendar</span>
//                             <span className="ml-auto bg-cyan-600 text-white text-xs px-2 py-1 rounded">2</span>
//                         </Link>
//                     </li>
//                     <li>
//                         <Link to="/gallery" className="flex items-center py-3 px-4 hover:bg-gray-700">
//                             <div className="w-6 mr-3">
//                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                                 </svg>
//                             </div>
//                             <span>Gallery</span>
//                         </Link>
//                     </li>
//                     <li>
//                         <Link to="/kanban" className="flex items-center py-3 px-4 bg-blue-500 hover:bg-blue-600">
//                             <div className="w-6 mr-3">
//                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                                 </svg>
//                             </div>
//                             <span>Kanban Board</span>
//                         </Link>
//                     </li>
//                     <li>
//                         <button
//                             onClick={() => toggleMenu('mailbox')}
//                             className="flex items-center w-full py-3 px-4 hover:bg-gray-700"
//                         >
//                             <div className="w-6 mr-3">
//                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                                 </svg>
//                             </div>
//                             <span>Mailbox</span>
//                             <span className="ml-auto">
//                                 <svg
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     className={`h-4 w-4 transition-transform ${expandedMenus.mailbox ? 'rotate-90' : ''}`}
//                                     fill="none"
//                                     viewBox="0 0 24 24"
//                                     stroke="currentColor"
//                                 >
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                                 </svg>
//                             </span>
//                         </button>
//                     </li>
//                     <li>
//                         <button
//                             onClick={() => toggleMenu('pages')}
//                             className="flex items-center w-full py-3 px-4 hover:bg-gray-700"
//                         >
//                             <div className="w-6 mr-3">
//                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
//                                 </svg>
//                             </div>
//                             <span>Pages</span>
//                             <span className="ml-auto">
//                                 <svg
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     className={`h-4 w-4 transition-transform ${expandedMenus.pages ? 'rotate-90' : ''}`}
//                                     fill="none"
//                                     viewBox="0 0 24 24"
//                                     stroke="currentColor"
//                                 >
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                                 </svg>
//                             </span>
//                         </button>
//                     </li>
//                     <li>
//                         <button
//                             onClick={() => toggleMenu('extras')}
//                             className="flex items-center w-full py-3 px-4 hover:bg-gray-700"
//                         >
//                             <div className="w-6 mr-3">
//                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                                 </svg>
//                             </div>
//                             <span>Extras</span>
//                             <span className="ml-auto">
//                                 <svg
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     className={`h-4 w-4 transition-transform ${expandedMenus.extras ? 'rotate-90' : ''}`}
//                                     fill="none"
//                                     viewBox="0 0 24 24"
//                                     stroke="currentColor"
//                                 >
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                                 </svg>
//                             </span>
//                         </button>
//                     </li>
//                 </ul>
//             </div>
//         </div>
//     );
// };

// export default Sidebar;