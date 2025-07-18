import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { MainHeader } from '../components/MainHeader';
import { DashboardPage } from './DashboardPage';
import { UsersPage } from './UsersPage';
import { ProductsPage } from './ProductsPage';

export const HomePage: React.FC = () => {
    const [activeContent, setActiveContent] = useState<string>('dashboard');

    const handleNavLinkClick = (path: string) => {
        const contentKey = path.substring(1);
        setActiveContent(contentKey);
    };

    const renderActivePage = () => {
        switch (activeContent) {
            case 'dashboard':
                return <DashboardPage />;
            case 'users':
                return <UsersPage />;
            case 'products':
                return <ProductsPage />;
            default:
                return <DashboardPage />;
        }
    };

    return (
        <div className="flex h-screen bg-white gap-3 p-4">
            {/* Pasa activeContent al Sidebar */}
            <Sidebar onNavLinkClick={handleNavLinkClick} activePath={`/${activeContent}`} />
            <div className="flex-1 flex flex-col flex-grow gap-3">
                <MainHeader />
                <div className="flex-grow overflow-hidden bg-gray-200 shadow-md shadow-gray-300 rounded-lg">
                    {renderActivePage()}
                </div>
            </div>
        </div>
    );
};