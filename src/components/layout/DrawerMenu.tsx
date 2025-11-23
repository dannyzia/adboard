import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface DrawerMenuProps {
    transparent?: boolean;
}

export const DrawerMenu: React.FC<DrawerMenuProps> = ({ transparent }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleNavigation = (path: string) => {
        setIsOpen(false);
        // Small delay to allow close animation to start
        setTimeout(() => navigate(path), 300);
    };

    const menuItems = [
        { label: 'Home', subLabel: 'Return to start', path: '/' },
        { label: 'Browse Ads', subLabel: 'Find what you need', path: '/#browse-ads' },
        { label: 'Post Ad', subLabel: 'Sell your items', path: '/post-ad' },
        ...(isAuthenticated
            ? [
                { label: 'Dashboard', subLabel: 'Manage your ads', path: '/dashboard' },
                { label: 'Pricing', subLabel: 'View plans', path: '/pricing' },
            ]
            : [
                { label: 'Login', subLabel: 'Access your account', path: '/login' },
                { label: 'Sign Up', subLabel: 'Create an account', path: '/register' },
            ]),
        { label: 'Admin', subLabel: 'Staff access', path: '/admin/login' },
    ];

    return (
        <>
            {/* Menu Trigger Button */}
            <div className="relative z-[70]">
                {/* SVG Clip Path Definition */}
                <svg width="0" height="0" className="absolute">
                    <defs>
                        <clipPath id="menuButtonClip" clipPathUnits="objectBoundingBox">
                            <path d="M0,0 H1 L0.87,0.76 C0.84,0.9, 0.81,1, 0.77,1 H0.23 C0.19,1, 0.16,0.9, 0.13,0.76 L0,0 Z" />
                        </clipPath>
                    </defs>
                </svg>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`
            group relative px-8 py-3 font-bold tracking-wider uppercase transition-all duration-300
            ${isOpen ? 'text-white' : 'text-gray-800'}
          `}
                >
                    <div className={`
            flex items-center gap-3 bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full shadow-sm hover:shadow-md transition-all
            ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}
          `}>
                        <span className="text-sm font-bold tracking-widest">MENU</span>
                        <div className="flex flex-col gap-1">
                            <span className="w-6 h-0.5 bg-gray-800"></span>
                            <span className="w-6 h-0.5 bg-gray-800"></span>
                            <span className="w-4 h-0.5 bg-gray-800 ml-auto"></span>
                        </div>
                    </div>

                    {/* Close Button (visible when open) */}
                    <div className={`
            absolute inset-0 flex items-center justify-center
            ${isOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90 pointer-events-none'}
            transition-all duration-300
          `}>
                        <span className="text-white text-xl">✕</span>
                    </div>
                </button>
            </div>

            {/* Full Screen Overlay */}
            <div
                className={`
          fixed inset-0 bg-gray-900 z-[60] transition-all duration-500 ease-[cubic-bezier(0.77,0,0.175,1)]
          ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
        `}
            >
                <div className="container mx-auto px-6 h-full flex flex-col justify-center">
                    <ul className="space-y-8">
                        {menuItems.map((item, index) => (
                            <li
                                key={item.label}
                                className={`
                  transform transition-all duration-700 ease-out
                  ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}
                `}
                                style={{ transitionDelay: `${150 + index * 100}ms` }}
                            >
                                <button
                                    onClick={() => handleNavigation(item.path)}
                                    className="group flex items-baseline gap-4 text-left w-full hover:translate-x-4 transition-transform duration-300"
                                >
                                    <span className="text-4xl md:text-6xl font-bold text-white group-hover:text-teal-400 transition-colors">
                                        {item.label}
                                    </span>
                                    <span className="text-gray-400 text-lg font-light group-hover:text-white transition-colors">
                                        {item.subLabel}
                                    </span>
                                </button>
                            </li>
                        ))}

                        {/* Logout Option */}
                        {isAuthenticated && (
                            <li
                                className={`
                  transform transition-all duration-700 ease-out
                  ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}
                `}
                                style={{ transitionDelay: `${150 + menuItems.length * 100}ms` }}
                            >
                                <button
                                    onClick={() => {
                                        logout();
                                        setIsOpen(false);
                                    }}
                                    className="text-xl text-red-400 hover:text-red-300 mt-8 block"
                                >
                                    Log Out
                                </button>
                            </li>
                        )}
                    </ul>
                </div>

                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>
        </>
    );
};
