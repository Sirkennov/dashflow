import { FaThLarge, FaUsers, FaBox } from 'react-icons/fa';

interface SidebarProps {
    onNavLinkClick: (path: string) => void;
    activePath: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNavLinkClick, activePath }) => {
    const getLinkClasses = (path: string) => {
        const isActive = activePath === path;
        return `flex items-center p-2 text-gray-700 rounded-md transition-colors duration-200 ease-in-out
                    ${isActive 
                        ? 'bg-gray-300 text-green-700 font-semibold border-l-4 border-green-500' 
                        : 'hover:bg-gray-300 hover:text-gray-900'
                    }
                `;
    };

    return (
        <aside className="w-64 bg-gray-200 shadow-md flex flex-col justify-between rounded-lg">
            <div className="p-3.5">
                <div className="flex items-center justify-center h-12">
                    <span className="text-2xl font-bold text-gray-800">DashFlow</span>
                </div>
            </div>

            {/* Menú de Navegación */}
            <nav className="flex-1 px-4 py-6">
                <ul>
                    <li className='mb-2 text-gray-500 text-sm font-semibold uppercase tracking-wider pl-2'>Menú</li>
                    <li className="mb-2">
                        <a
                            href="#"
                            onClick={() => onNavLinkClick('/dashboard')}
                            className={getLinkClasses('/dashboard')}
                        >
                            <FaThLarge className="mr-3 text-xl" />
                            Dashboard
                        </a>
                    </li>
                    <li className="mb-2">
                        <a
                            href="#"
                            onClick={() => onNavLinkClick('/clientes')}
                            className={getLinkClasses('/clientes')}
                        >
                            <FaUsers className="mr-3 text-xl" />
                            Clientes
                        </a>
                    </li>
                    <li className="mb-2">
                        <a
                            href="#"
                            onClick={() => onNavLinkClick('/productos')}
                            className={getLinkClasses('/productos')}
                        >
                            <FaBox className="mr-3 text-xl" />
                            Productos
                        </a>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};
