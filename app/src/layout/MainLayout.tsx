import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        return localStorage.getItem('sidebar-collapsed') === 'true';
    });

    const handleToggleSidebar = () => {
        if (window.innerWidth > 1024) {
            setSidebarCollapsed(prev => {
                const newValue = !prev;
                localStorage.setItem('sidebar-collapsed', String(newValue));
                return newValue;
            });
        } else {
            setSidebarOpen(prev => !prev);
        }
    };

    return (
        <div className="layout-container">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} collapsed={sidebarCollapsed} />
            {sidebarOpen && <div className="sidebar-backdrop" onClick={(e) => { e.stopPropagation(); setSidebarOpen(false); }} />}
            <div className="layout-main">
                <Header onToggleSidebar={handleToggleSidebar} />
                <main className="layout-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
