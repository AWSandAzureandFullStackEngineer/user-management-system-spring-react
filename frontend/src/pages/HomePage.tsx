import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white p-4">
            <div className="text-center max-w-2xl">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-down">
                    User Management System
                </h1>
                <p className="text-lg md:text-xl mb-8 animate-fade-in-up delay-200">
                    Welcome to the UMS application. Manage users efficiently and securely.
                    Built with React, Vite, TypeScript, Tailwind CSS, and a Spring Boot backend.
                </p>
                <div className="space-y-4 md:space-y-0 md:space-x-4 animate-fade-in-up delay-400">
                    <Link
                        to="/users/create" // Adjust if your route is different
                        className="inline-block bg-white text-indigo-600 font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-indigo-100 transition-colors duration-300 transform hover:scale-105"
                    >
                        Create New User
                    </Link>
                    <Link
                        to="/users" // Adjust if your route for listing users is different
                        className="inline-block bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-white hover:text-indigo-600 transition-colors duration-300 transform hover:scale-105"
                    >
                        View All Users
                    </Link>
                </div>
            </div>
            <footer className="absolute bottom-8 text-center text-sm text-indigo-200">
                Powered by Spring Boot & React
            </footer>
        </div>
    );
};
export default HomePage;
