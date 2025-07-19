import { useState, useMemo } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useUsers, type UserData } from '../hooks/useUsers';
import { UserFormModal } from './UserFormModal';
import { Pagination } from '../components/Pagination';
import { ContentHeader } from '../components/ContentHeader';

export const UsersPage: React.FC = () => {
    const { users, loading, error } = useUsers();
    const [showUserFormModal, setShowUserFormModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

    // Estado para la paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15);

    // --- Estado para el término de búsqueda ---
    const [searchTerm, setSearchTerm] = useState('');

    // --- LÓGICA DE FILTRADO ---
    const filteredUsers = useMemo(() => {
        if (!searchTerm) { // Si el término de búsqueda está vacío, devuelve todos los usuarios
            return users;
        }

        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return users.filter(user => {
            return (
                user.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                user.lastName.toLowerCase().includes(lowerCaseSearchTerm) ||
                user.salary.toString().includes(lowerCaseSearchTerm) ||
                user.country.toLowerCase().includes(lowerCaseSearchTerm) ||
                user.city.toLowerCase().includes(lowerCaseSearchTerm)
            );
        });
    }, [users, searchTerm]); // Recalcula solo cuando 'users' o 'searchTerm' cambian

    // Calcular usuarios para la página actual
    const indexOfLastUser = currentPage * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    // --- Manejo de cambio de página ---
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    // Funciones para abrir/cerrar el modal de formulario
    const handleAddUserClick = () => {
        setSelectedUser(null); // Asegura que no haya usuario seleccionado (modo añadir)
        setShowUserFormModal(true);
    };

    const handleEditUserClick = (user: UserData) => {
        setSelectedUser(user); // Establece el usuario seleccionado (modo editar)
        setShowUserFormModal(true);
    };

    const handleCloseUserFormModal = () => {
        setShowUserFormModal(false);
        setSelectedUser(null); // Limpiar usuario seleccionado al cerrar
    };

    // --- LÓGICA CRUD CON FIREBASE ---

    // Función para AÑADIR o EDITAR un usuario
    const handleSaveUser = async (userData: Omit<UserData, 'id'> | UserData) => {
        try {
            if (selectedUser && (userData as UserData).id) {
                // Modo EDICIÓN: El usuario ya existe, actualizamos
                const userRef = doc(db, 'users', (userData as UserData).id);
                await updateDoc(userRef, userData);
            } else {
                // Modo AÑADIR: Nuevo usuario, añadimos un nuevo documento
                await addDoc(collection(db, 'users'), userData);
            }
            setShowUserFormModal(false);
        } catch (error) {
            throw error; // Re-lanza el error para que el formulario lo maneje
        }
    };

    // Función para ELIMINAR un usuario
    const handleDeleteUser = async (userId: string) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
            try {
                await deleteDoc(doc(db, 'users', userId));
                if (currentUsers.length === 1 && currentPage > 1 && users.length - 1 <= indexOfFirstUser) {
                    setCurrentPage(prev => prev - 1);
                }
            } catch (error) {
                alert("Hubo un error al eliminar el usuario.");
            }
        }
    };

    // --- Manejo de estados de carga/error ---
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-full">
                <p className="text-gray-700">Cargando usuarios...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-red-500">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col overflow-hidden">
            <div className="flex flex-col flex-grow overflow-hidden">
                {/* Header */}
                <ContentHeader
                    title="Usuarios"
                    onClick={handleAddUserClick}
                    searchValue={searchTerm}
                    onSearchChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                />

                {/* Tabla de usuarios */}
                <div className="flex-grow overflow-y-auto overflow-x-auto">
                    <table className="w-full table-fixed divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0 rounded-b-lg">
                            <tr>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[50px] min-w-[50px]">
                                    ID
                                </th>
                                <th className="pr-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[130px] min-w-[100px]">
                                    Nombre
                                </th>
                                <th className="pr-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[130px] min-w-[100px]">
                                    Apellido
                                </th>
                                <th className="pr-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px] min-w-[100px]">
                                    Salario
                                </th>
                                <th className="pr-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[140px] min-w-[100px]">
                                    País
                                </th>
                                <th className="pr-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px] min-w-[100px]">
                                    Ciudad
                                </th>
                                <th className="pr-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[90px] min-w-[50px] ">
                                    Acciones
                                </th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentUsers.map((user, index) => {
                                const sequentialId = (currentPage - 1) * itemsPerPage + index + 1;
                                return (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-center text-sm text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">
                                            {sequentialId}
                                        </td>
                                        <td className="pr-6 py-4 text-sm text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">
                                            {user.name}
                                        </td>
                                        <td className="pr-6 py-4 text-sm text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">
                                            {user.lastName}
                                        </td>
                                        <td className="pr-6 py-4 text-sm text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">
                                            {user.salary}
                                        </td>
                                        <td className="pr-6 py-4 text-sm text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">
                                            {user.country}
                                        </td>
                                        <td className="pr-6 py-4 text-sm text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">
                                            {user.city}
                                        </td>
                                        <td className="pr-6 py-4 text-sm font-medium">
                                            <div className="flex items-center justify-center space-x-3">
                                                <button
                                                    className="text-indigo-600 hover:text-indigo-900 transition-colors cursor-pointer"
                                                    onClick={() => handleEditUserClick(user)}
                                                >
                                                    <FiEdit className="w-5 h-5" />
                                                </button>
                                                <button
                                                    className="text-red-600 hover:text-red-900 transition-colors cursor-pointer"
                                                    onClick={() => handleDeleteUser(user.id)}
                                                >
                                                    <FiTrash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {/* Componente de paginación */}
                <Pagination
                    className='flex-shrink-0 border-t border-gray-200'
                    totalItems={users.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            </div>
            {/* Renderiza el modal del formulario si showUserFormModal es true */}
            {showUserFormModal && (
                <UserFormModal
                    onClose={handleCloseUserFormModal}
                    onSaveUser={handleSaveUser}
                    currentUser={selectedUser}
                />
            )}
        </div>
    );
};
