// src/components/layout/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                    <p>&copy; {new Date().getFullYear()} User Management System. All rights reserved.</p>
                    <p className="mt-1">
                        Built with React, Vite, Spring Boot, and Tailwind CSS.
                    </p>
                    {/* Optional: Add social media links or other footer content */}
                    {/*
          <div className="mt-4 flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Facebook</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">...</svg>
            </a>
            // Add other social icons
          </div>
          */}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
