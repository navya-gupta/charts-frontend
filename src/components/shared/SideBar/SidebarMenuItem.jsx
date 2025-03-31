// 

import { Link } from "react-router-dom";

// SidebarMenuItem component
const SidebarMenuItem = ({ url, icon, title, collapsed, isActive }) => {
    return (
        <li>
            <div className='px-[8px] py-[3px]'>
                <Link
                    to={url}
                    className={`rounded-md flex items-center py-3 px-1 text-white hover:text-white ${collapsed ? 'justify-center px-2' : 'px-4'} hover:bg-${isActive(url) ? '[#54058c]' : '[#494e53]'} ${isActive(url) ? 'bg-[#54058c]' : ''}`}
                >
                    <div className={`${collapsed ? 'w-8' : 'w-6 mr-3'} flex justify-center ${collapsed ? '' : 'ml-2'}`}>
                        {icon}
                    </div>
                    {!collapsed && <span className="ml-2">{title}</span>}
                </Link>
            </div>
        </li>
    );
};

export default SidebarMenuItem;