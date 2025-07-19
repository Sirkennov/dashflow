import { useMemo } from 'react';
import { useUsers } from '../hooks/useUsers';
import { useProducts } from '../hooks/useProducts';
import {
    FaUsers,
    FaBox,
    FaDollarSign,
    FaExclamationTriangle,
    FaUserPlus,
    FaCube,
    FaTag,
    FaBoxes
} from 'react-icons/fa';

// Umbral para bajo stock
const LOW_STOCK_THRESHOLD = 10;
// Umbral para alto stock
const HIGH_STOCK_THRESHOLD = 100;


export const DashboardPage = () => {
    const { users, loading: usersLoading, error: usersError } = useUsers();
    const { products, loading: productsLoading, error: productsError } = useProducts();

    const loading = usersLoading || productsLoading;
    const error = usersError || productsError;

    // --- Cálculos de datos para los widgets ---
    // Valor total del inventario
    const totalInventoryValue = useMemo(() => {
        if (!products) return 0;
        return products.reduce((sum, product) => sum + product.price * product.stock, 0);
    }, [products]);

    // Productos con stock bajo (stock <= LOW_STOCK_THRESHOLD) - LIMITADO A 5
    const lowStockProducts = useMemo(() => {
        if (!products) return [];
        return products.filter(product => product.stock > 0 && product.stock <= LOW_STOCK_THRESHOLD).slice(0, 5);
    }, [products]);

    // Productos con stock alto (stock >= HIGH_STOCK_THRESHOLD) - LIMITADO A 5
    const highStockProducts = useMemo(() => {
        if (!products) return [];
        return products.filter(product => product.stock >= HIGH_STOCK_THRESHOLD).slice(0, 5);
    }, [products]);

    // Precio Promedio de Productos
    const averageProductPrice = useMemo(() => {
        if (!products || products.length === 0) return 0;
        const totalPrices = products.reduce((sum, product) => sum + product.price, 0);
        return totalPrices / products.length;
    }, [products]);

    // Usuarios recientes - LIMITADO A 5
    const latestUsers = useMemo(() => {
        if (!users) return [];
        return users.slice().sort((a, b) => (a.name || '').localeCompare(b.name || '')).slice(0, 5);
    }, [users]);

    // Productos recientes - LIMITADO A 5
    const latestProducts = useMemo(() => {
        if (!products) return [];
        return products.slice(0, 5);
    }, [products]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-700 text-lg">Cargando datos del dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg m-4">
                <h2 className="text-xl font-semibold mb-2">Error al cargar el Dashboard</h2>
                <p>{error}</p>
                <p>Por favor, inténtalo de nuevo más tarde.</p>
            </div>
        );
    }

    return (
        <div className="p-6 h-full flex flex-col overflow-y-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
            {/* Contenedor principal del Dashboard con 4 columnas para pantallas grandes */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Columna superior: Widgets de Métricas Clave */}
                <div className="grid lg:col-span-4 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-6">
                    {/* Widget: Total de Usuarios Registrados */}
                    <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4 border border-gray-100">
                        <div className="p-3 bg-green-100 rounded-full text-green-600 flex-shrink-0">
                            <FaUsers className="w-8 h-8" />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <p className="
                                text-gray-500 text-sm whitespace-nowrap overflow-hidden text-ellipsis
                            ">
                                Total de Usuarios
                            </p>
                            <p className="
                                text-2xl font-bold text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis
                            ">
                                {users.length}
                            </p>
                        </div>
                    </div>

                    {/* Widget: Total de Productos en Stock */}
                    <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4 border border-gray-100">
                        <div className="p-3 bg-blue-100 rounded-full text-blue-600 flex-shrink-0 ">
                            <FaBox className="w-8 h-8" />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <p className="
                                text-gray-500 text-sm whitespace-nowrap overflow-hidden text-ellipsis
                            ">
                                Total de Productos
                            </p>
                            <p className="
                                text-2xl font-bold text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis
                            ">
                                {products.length}
                            </p>
                        </div>
                    </div>

                    {/* Widget: Valor Total del Inventario */}
                    <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4 border border-gray-100">
                        <div className="p-3 bg-yellow-100 rounded-full text-yellow-600 flex-shrink-0">
                            <FaDollarSign className="w-8 h-8" />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <p className=" 
                                text-gray-500 text-sm whitespace-nowrap overflow-hidden text-ellipsis
                            ">
                                Valor Total Inventario
                            </p>
                            <p className="
                                text-2xl font-bold text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis
                            ">
                                ${totalInventoryValue.toLocaleString(
                                    undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                }
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Widget: Precio Promedio de Productos */}
                    <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4 border border-gray-100">
                        <div className="p-3 bg-purple-100 rounded-full text-purple-600 flex-shrink-0">
                            <FaTag className="w-8 h-8" />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <p className="
                                text-gray-500 text-sm whitespace-nowrap overflow-hidden text-ellipsis
                            ">
                                Precio Promedio Producto
                            </p>
                            <p className="
                                text-2xl font-bold text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis
                            ">
                                ${averageProductPrice.toLocaleString(
                                    undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                }
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Columna inferior: Widgets de Listas (Bajo Stock, Alto Stock, Últimos Usuarios, Últimos Productos) */}
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 lg:col-span-4 gap-6">
                    {/* Widget: Productos con Bajo Stock */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <h3 className="text-xl font-semibold text-gray-800 mb-5 flex items-center">
                            <FaExclamationTriangle className="text-orange-500 mr-3 text-2xl" /> Productos con Bajo Stock {/* Icono un poco más grande */}
                        </h3>
                        {lowStockProducts.length > 0 ? (
                            <ul className="space-y-4">
                                {lowStockProducts.map(product => (
                                    <li key={product.id} className="
                                        flex justify-between items-center
                                        bg-orange-100 p-4 rounded-lg border
                                        border-orange-200 shadow-sm transition-all
                                        duration-200 hover:shadow-md
                                    ">
                                        <div className="flex flex-col flex-grow overflow-hidden mr-2"> {/* flex-grow y overflow-hidden para el texto */}
                                            <span className="
                                                font-bold text-lg
                                                text-orange-800 whitespace-nowrap overflow-hidden text-ellipsis
                                            ">
                                                {product.name}
                                            </span>
                                            <span className="
                                                text-sm text-orange-600 whitespace-nowrap overflow-hidden text-ellipsis
                                            ">
                                                Categoría: {product.category || 'N/A'}
                                            </span>
                                        </div>
                                        <span className="
                                            font-extrabold text-xl
                                            text-orange-700 bg-orange-200
                                            px-3 py-1 rounded-full
                                        ">
                                            Stock: {product.stock}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-700 p-4 bg-green-100 rounded-lg border border-green-200 text-center font-medium">
                                ¡Excelente! No hay productos con bajo stock.
                            </p>
                        )}
                    </div>
                    {/* Widget: Productos con Stock Alto */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <h3 className="text-xl font-semibold text-gray-800 mb-5 flex items-center">
                            <FaBoxes className="text-blue-500 mr-3 text-2xl" /> Productos con Stock Alto {/* Icono un poco más grande */}
                        </h3>
                        {highStockProducts.length > 0 ? (
                            <ul className="space-y-4">
                                {highStockProducts.map(product => (
                                    <li key={product.id} className="
                                        flex justify-between items-center
                                        bg-blue-100 p-4 rounded-lg border
                                        border-blue-200 shadow-sm transition-all
                                        duration-200 hover:shadow-md
                                    ">
                                        <div className="flex flex-col flex-grow overflow-hidden mr-2"> {/* flex-grow y overflow-hidden para el texto */}
                                            <span className="
                                                font-bold text-lg
                                                text-blue-800 whitespace-nowrap overflow-hidden text-ellipsis
                                            ">
                                                {product.name}
                                            </span>
                                            <span className="
                                                text-sm text-blue-600 whitespace-nowrap overflow-hidden text-ellipsis
                                            ">
                                                Categoría: {product.category || 'N/A'}
                                            </span>
                                        </div>
                                        <span className="
                                                font-extrabold text-xl
                                                text-blue-700 bg-blue-200
                                                px-3 py-1 rounded-full
                                            ">
                                            Stock: {product.stock}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-700 p-4 bg-gray-100 rounded-lg border border-gray-200 text-center font-medium">
                                No hay productos con stock inusualmente alto.
                            </p>
                        )}
                    </div>
                    {/* Widget: Últimos Usuarios Registrados */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 lg:col-span-1">
                        <h3 className="text-xl font-semibold text-gray-800 mb-5 flex items-center">
                            <FaUserPlus className="text-purple-500 mr-3 text-2xl" /> Últimos Usuarios {/* Icono un poco más grande */}
                        </h3>
                        {latestUsers.length > 0 ? (
                            <ul className="space-y-4">
                                {latestUsers.map(user => (
                                    <li key={user.id} className="
                                        flex items-center bg-gray-50 p-4 
                                        rounded-lg border border-gray-200 shadow-sm 
                                        transition-all duration-200 hover:shadow-md
                                    ">
                                        {/* Avatar del Usuario - Ahora w-10 h-10 para un tamaño que se ajusta mejor al diseño general y al texto */}
                                        <img
                                            src={user.avatarUrl || "src/assets/images/fotoperfil.webp"}
                                            alt={"fotoejemplo"}
                                            className="w-10 h-10 rounded-full object-cover mr-4 ring-2 ring-purple-300 ring-offset-2 flex-shrink-0"
                                        />
                                        <div className="flex-grow overflow-hidden"> {/* flex-grow y overflow-hidden para el texto del usuario */}
                                            <p className="
                                                font-bold text-lg text-gray-800 whitespace-nowrap 
                                                overflow-hidden text-ellipsis
                                            ">
                                                {user.name} {user.lastName}
                                            </p>
                                            <p className="
                                                text-sm text-gray-600 whitespace-nowrap 
                                                overflow-hidden text-ellipsis
                                            ">
                                                {user.city}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-700 p-4 bg-gray-100 rounded-lg border border-gray-200 text-center font-medium">
                                No hay usuarios recientes para mostrar.
                            </p>
                        )}
                    </div>

                    {/* Widget: Últimos Productos Registrados */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 lg:col-span-1">
                        <h3 className="text-xl font-semibold text-gray-800 mb-5 flex items-center">
                            <FaCube className="text-orange-500 mr-3 text-2xl" /> Últimos Productos
                        </h3>
                        {latestProducts.length > 0 ? (
                            <ul className="grid grid-cols-1 gap-4">
                                {latestProducts.map(product => (
                                    <li key={product.id} className="
                                        bg-gray-50 p-4 rounded-lg border
                                        border-gray-200 shadow-sm transition-all
                                        duration-200 hover:shadow-md
                                        flex flex-col sm:flex-row items-start
                                        sm:items-center justify-between
                                    ">
                                        <div className="flex-grow mb-2 sm:mb-0 overflow-hidden">
                                            <p className="
                                                font-bold text-lg text-gray-800 mb-1 
                                                whitespace-nowrap overflow-hidden text-ellipsis
                                            ">
                                                {product.name}
                                            </p>
                                            <p className="
                                                text-sm text-gray-600 
                                                whitespace-nowrap overflow-hidden text-ellipsis
                                            ">
                                                Categoría:
                                                <span className="
                                                    font-medium text-gray-700 ml-1
                                                ">
                                                    {product.category || 'N/A'}
                                                </span>
                                            </p>
                                            <p className="
                                                text-sm text-gray-600 
                                                whitespace-nowrap overflow-hidden text-ellipsis
                                            ">
                                                Stock:
                                                <span className="
                                                    font-medium text-gray-700 ml-1
                                                ">
                                                    {product.stock}
                                                </span>
                                            </p>
                                        </div>
                                        <p className="
                                            font-bold text-xl text-green-600
                                            whitespace-nowrap overflow-hidden text-ellipsis
                                        ">
                                            ${product.price}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-700 p-4 bg-gray-100 rounded-lg border border-gray-200 text-center font-medium">
                                No hay productos recientes para mostrar.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};