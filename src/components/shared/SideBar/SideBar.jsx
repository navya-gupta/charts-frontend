// src/components/Sidebar.jsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraphIcon, HomeIcon, MenuIcon, UploadIcon } from '../../../assets/svgs/SidebarIconsSVG';
import SidebarMenuItem from './SidebarMenuItem';

const Sidebar = ({ collapsed, toggleSidebar }) => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    // Menu items data with imported icons
    const menuItems = [
        { url: '/', title: 'Home', icon: HomeIcon },
        { url: '/upload', title: 'Upload CSV', icon: UploadIcon },
        { url: '/menu', title: 'Menu', icon: MenuIcon },
        // { url: '/graph', title: 'Graph', icon: GraphIcon }
    ];

    return (
        <div className={`${collapsed ? 'w-16' : 'w-64'} min-h-screen bg-[#343a40] text-white flex-shrink-0 transition-all duration-300`}>
            {/* Header */}
            <div className="flex items-center p-4 border-b-[3px] border-gray-700">
                {!collapsed && <h1 className="text-white text-xl font-semibold">Options</h1>}
                <button
                    onClick={toggleSidebar}
                    className={`rounded-full ml-auto p-1 bg-white text-black focus:outline-none transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                </button>
            </div>

            {/* Menu Items */}
            <div className="overflow-y-auto h-[calc(100vh-72px)]">
                <ul>
                    {menuItems.map((item, index) => (
                        <SidebarMenuItem
                            key={index}
                            url={item.url}
                            icon={item.icon}
                            title={item.title}
                            collapsed={collapsed}
                            isActive={isActive}
                        />
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;