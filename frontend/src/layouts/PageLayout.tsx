import React, { ReactNode } from 'react';

interface PageLayoutProps {
    children: ReactNode;
    title?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, title }) => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Example: Navbar placeholder
      <Navbar />
      */}
            <header className="bg-white dark:bg-gray-800 shadow sticky top-0 z-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    {/* You can put a Navbar here or just a simple title */}
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {title || 'User Management System'}
                    </h1>
                </div>
            </header>

            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>

            {/* Example: Footer placeholder
      <Footer />
      */}
            <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-500 dark:text-gray-400 text-sm">
                    &copy; {new Date().getFullYear()} User Management System. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default PageLayout;
