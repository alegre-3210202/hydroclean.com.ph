
import { useState, useEffect } from 'react';

import logo from '../assets/images/hydro_logo.png';

interface SidebarItem {
    icon: string;
    label: string;
    active?: boolean;
    href: string;
}

interface SidebarProps {
    items: SidebarItem[];
    onItemSelect?: (label: string) => void;
}

export default function Sidebar({ items, onItemSelect }: SidebarProps) {
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            const sidebarOpen = localStorage.getItem('sidebarOpen') === 'true';
            if (sidebarOpen !== isOpen) {
                setIsOpen(sidebarOpen);
            }

            const screenWidth = window.innerWidth;
            if (screenWidth > 768) {
                localStorage.setItem('sidebarOpen', 'true');
            }
        }, 10);

        return () => clearInterval(interval);
    }, [isOpen]);

    const handleToggleSidebar = () => {
        if (localStorage.getItem('sidebarOpen') === 'true') {
            localStorage.setItem('sidebarOpen', 'false');
            setIsOpen(false);
        } else {
            localStorage.setItem('sidebarOpen', 'true');
            setIsOpen(true);
        }
    };

    const handleItemClick = (label: string) => {
        if (label === 'Logout') {
            localStorage.removeItem('loggedInUser');
        }
        if (onItemSelect) {
            onItemSelect(label);
        }
    };

    return (
        <aside className={isOpen ? '' : 'hide'}>
            <div className="toggle">
                <div className="logo">
                    <img src={logo} />
                    <h2>Hydro<span className="primary">Clean</span></h2>
                </div>
                <div className="close" id="close-btn" onClick={handleToggleSidebar}>
                    <span className="material-symbols-outlined">
                        arrow_circle_left
                    </span>
                </div>
            </div>

            <div className="sidebar">
                {items.map((item, index) => (
                    <a href={item.href} key={index} onClick={() => handleItemClick(item.label)} className={item.active ? 'active' : ''}>
                        <span className="material-icons-sharp">
                            {item.icon}
                        </span>
                        <h3>{item.label}</h3>
                    </a>
                ))}
            </div>
        </aside>
    );
};