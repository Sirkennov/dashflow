import { useState, useEffect, useRef } from 'react'; // Importa useEffect y useRef
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export const MainHeader: React.FC = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null); // Crea una referencia para el contenedor del dropdown
    const navigate = useNavigate();

    // Función para manejar el cierre de sesión
    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log('Sesión cerrada exitosamente!');
            navigate('/login');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    // Función para alternar el dropdown
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // useEffect para cerrar el dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);


    return (
        <header className="bg-gray-200 shadow-sm px-6 py-2  flex items-center justify-end rounded-lg">
            {/* Asigna la referencia al div que envuelve la imagen de perfil y el dropdown */}
            <div className="relative flex items-center gap-3" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={toggleDropdown}
                    className="
                            cursor-pointer rounded-full w-10 h-10 overflow-hidden
                            focus:outline-none focus:ring-2 focus:ring-blue-500
                        ">
                    <img
                        src="src/assets/images/fotoperfil.png"
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                    />
                </button>
                <div>
                    <p className="font-semibold text-gray-800">John Doe</p>
                    <p className="text-sm text-gray-500">tmichael@gmail.com</p>
                </div>

                {/* Dropdown de Perfil */}
                {isDropdownOpen && (
                    <div className="
                            absolute right-25 top-10 mt-2 w-36 bg-white rounded-md shadow-lg
                            p-1 z-10
                        ">
                        <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                            onClick={() => {
                                setIsDropdownOpen(false);
                            }}
                        >
                            Editar Perfil
                        </a>
                        <div className="border-t border-gray-200 my-1"></div>
                        <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 cursor-pointer text-sm text-red-600 hover:bg-red-100 rounded-md"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};
