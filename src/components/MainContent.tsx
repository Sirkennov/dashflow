import React from 'react';

interface MainContentProps {
    children: React.ReactNode;
}

export const MainContent: React.FC<MainContentProps> = ({ children }) => {
    return (
        <main className="flex-1 p-6 bg-gray-200 overflow-y-auto shadow-md shadow-gray-300 rounded-lg">
            {children}
        </main>
    );
};
