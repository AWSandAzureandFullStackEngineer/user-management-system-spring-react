import React, { Suspense, lazy } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import PageLayout from './layouts/PageLayout';

// Lazy load page components for better initial load performance
const HomePage = lazy(() => import('./pages/HomePage'));
const CreateUserPage = lazy(() => import('./features/userManagement/pages/CreateUserPage'));
const UserListPage = lazy(() => import('./features/userManagement/pages/UserListPage'));


// Basic loading fallback component
const LoadingFallback: React.FC = () => (
    <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold text-gray-700 dark:text-gray-300">Loading page...</div>
    </div>
);

const App: React.FC = () => {
    return (
        <>
            {/* <Navbar /> */}
            <Suspense fallback={<LoadingFallback />}>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />

                    {/* User Management Routes */}
                    {/* CreateUserPage is public as per backend security config */}
                    <Route path="/users/create" element={<CreateUserPage />} />

                    {/* UserListPage might require authentication/admin role */}
                    {/* Example with a conceptual ProtectedRoute */}
                    <Route path="/users" element={<UserListPage />} />


                    {/* Catch-all for 404 Not Found */}
                    {/* <Route path="*" element={<NotFoundPage />} /> */}
                    <Route path="*" element={
                        <PageLayout title="Page Not Found">
                            <div className="text-center py-10">
                                <h1 className="text-4xl font-bold text-red-600 mb-4">404 - Page Not Found</h1>
                                <p className="text-lg text-gray-700 dark:text-gray-300">
                                    Sorry, the page you are looking for does not exist.
                                </p>
                                <Link to="/" className="mt-6 inline-block text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
                                    Go back to Home
                                </Link>
                            </div>
                        </PageLayout>
                    } />
                </Routes>
            </Suspense>
        </>
    );
};

export default App;
