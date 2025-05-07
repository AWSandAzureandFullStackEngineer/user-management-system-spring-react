// src/components/layout/Navbar.tsx
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom'; // Assuming React Router for navigation
// import { useUserStore } from '../../store/userStore'; // Example: if using a global user store

// Example: Replace with your actual icon components or SVGs
const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);


const Navbar: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    // const { isAuthenticated, logout, currentUser } = useUserStore(); // Example usage

    // Placeholder for authentication status - replace with your actual auth logic
    const isAuthenticated = false; // Example: useUserStore().isAuthenticated;
    const currentUser = { username: 'Guest' }; // Example: useUserStore().currentUser;

    const handleLogout = () => {
        // logout(); // Call logout from your auth store/context
        // navigate('/login'); // Redirect to login page
        alert('Logout clicked (implement me!)');
        setIsMobileMenuOpen(false);
    };

    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive
                ? 'bg-indigo-700 text-white dark:bg-indigo-600'
                : 'text-gray-700 dark:text-gray-300 hover:bg-indigo-500 hover:text-white dark:hover:bg-gray-700'
        }`;

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo / Site Name */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                            UMS
                        </Link>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        <NavLink to="/" className={navLinkClasses}>
                            Home
                        </NavLink>
                        <NavLink to="/users" className={navLinkClasses}>
                            Users
                        </NavLink>
                        {/* Add more navigation links here */}
                        {isAuthenticated ? (
                            <>
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  Hi, {currentUser?.username}
                </span>
                                <button onClick={handleLogout} className={navLinkClasses({ isActive: false })}>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <NavLink to="/login" className={navLinkClasses}>
                                Login
                            </NavLink>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                            aria-controls="mobile-menu"
                            aria-expanded={isMobileMenuOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden" id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <NavLink to="/" className={navLinkClasses} onClick={() => setIsMobileMenuOpen(false)}>
                            Home
                        </NavLink>
                        <NavLink to="/users" className={navLinkClasses} onClick={() => setIsMobileMenuOpen(false)}>
                            Users
                        </NavLink>
                        {/* Add more mobile navigation links here */}
                        {isAuthenticated ? (
                            <>
                <span className="block px-3 py-2 text-gray-700 dark:text-gray-300 text-sm">
                  Hi, {currentUser?.username}
                </span>
                                <button onClick={handleLogout} className={`w-full text-left ${navLinkClasses({ isActive: false })}`}>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <NavLink to="/login" className={navLinkClasses} onClick={() => setIsMobileMenuOpen(false)}>
                                Login
                            </NavLink>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
