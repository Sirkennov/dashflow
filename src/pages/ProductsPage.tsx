import { useState, useMemo } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useProducts, type ProductData } from '../hooks/useProducts';
import { ProductFormModal } from './ProductFormModal';
import { Pagination } from '../components/Pagination';
import { ContentHeader } from '../components/ContentHeader';

export const ProductsPage: React.FC = () => {
    const { products, loading, error } = useProducts();
    const [showProductFormModal, setShowProductFormModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);

    // Estado para la paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15); // Cantidad de elementos por página

    // --- Estado para el término de búsqueda ---
    const [searchTerm, setSearchTerm] = useState('');

    // --- LÓGICA DE FILTRADO (memorizada para optimización) ---
    const filteredProducts = useMemo(() => {
        if (!searchTerm) { // Si el término de búsqueda está vacío, devuelve todos los productos
            return products;
        }

        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return products.filter(product => {
            // Filtra por nombre, descripción, precio, stock o categoría
            return (
                product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                product.description.toLowerCase().includes(lowerCaseSearchTerm) ||
                product.price.toString().includes(lowerCaseSearchTerm) ||
                product.stock.toString().includes(lowerCaseSearchTerm) ||
                product.category.toLowerCase().includes(lowerCaseSearchTerm)
            );
        });
    }, [products, searchTerm]); // Recalcula solo cuando 'products' o 'searchTerm' cambian

    // Calcular productos para la página actual
    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    // --- Manejo de cambio de página ---
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    // Funciones para abrir/cerrar el modal de formulario
    const handleAddProductClick = () => {
        setSelectedProduct(null); // Asegura que no haya producto seleccionado (modo añadir)
        setShowProductFormModal(true);
    };

    const handleEditProductClick = (product: ProductData) => {
        setSelectedProduct(product); // Establece el producto seleccionado (modo editar)
        setShowProductFormModal(true);
    };

    const handleCloseProductFormModal = () => {
        setShowProductFormModal(false);
        setSelectedProduct(null); // Limpiar producto seleccionado al cerrar
    };

    // --- LÓGICA CRUD CON FIREBASE ---

    // Función para AÑADIR o EDITAR un producto
    const handleSaveProduct = async (productData: Omit<ProductData, 'id' | 'createdAt'> | ProductData) => {
        try {
            if (selectedProduct && (productData as ProductData).id) {
                // Modo EDICIÓN: El producto ya existe, actualizamos
                // Extraemos 'id' y 'createdAt' ya que no queremos que se actualicen
                const { id, createdAt, ...dataToUpdate } = productData as ProductData;
                const productRef = doc(db, 'products', id); // Referencia al documento a actualizar
                await updateDoc(productRef, dataToUpdate); // Actualiza los datos del documento
                console.log("Producto actualizado con ID:", id);
            } else {
                // Modo AÑADIR: Nuevo producto, añadimos un nuevo documento
                // Usamos serverTimestamp() para añadir la fecha de creación en el servidor de Firestore
                await addDoc(collection(db, 'products'), {
                    ...productData,
                    createdAt: serverTimestamp()
                });
                console.log("Nuevo producto añadido.");
            }
        } catch (error) {
            console.error("Error al guardar el producto:", error);
            throw error; // Re-lanza el error para que el formulario lo maneje si es necesario
        }
    };

    // Función para ELIMINAR un producto
    const handleDeleteProduct = async (productId: string) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
            try {
                await deleteDoc(doc(db, 'products', productId)); // Elimina el documento de Firestore
                console.log("Producto eliminado con ID:", productId);
                // Ajusta la paginación si se elimina el último elemento de la página actual
                if (currentProducts.length === 1 && currentPage > 1 && products.length - 1 <= indexOfFirstProduct) {
                    setCurrentPage(prev => prev - 1);
                }
            } catch (error) {
                console.error("Error al eliminar el producto:", error);
                alert("Hubo un error al eliminar el producto."); // Muestra un mensaje de error al usuario
            }
        }
    };

    // --- Manejo de estados de carga/error ---
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-full">
                <p className="text-gray-700">Cargando productos...</p>
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
                    title="Productos"
                    onClick={handleAddProductClick}
                    searchValue={searchTerm}
                    onSearchChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                />

                {/* Tabla de productos */}
                <div className="flex-grow overflow-y-auto overflow-x-auto">
                    <table className="w-full table-fixed divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0 rounded-b-lg">
                            <tr>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[50px] min-w-[50px]">
                                    ID
                                </th>
                                <th className="pr-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px] min-w-[100px]">
                                    Nombre
                                </th>
                                <th className="pr-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[140px] min-w-[100px]">
                                    Descripción
                                </th>
                                <th className="pr-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px] min-w-[100px]">
                                    Precio
                                </th>
                                <th className="pr-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px] min-w-[100px]">
                                    Stock
                                </th>
                                <th className="pr-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px] min-w-[100px]">
                                    Categoría
                                </th>
                                <th className="pr-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[80px] min-w-[80px]">
                                    Creado
                                </th>
                                <th className="pr-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[90px] min-w-[90px]">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentProducts.map((product, index) => {
                                const sequentialId = (currentPage - 1) * itemsPerPage + index + 1;
                                const creationDate = product.createdAt instanceof Timestamp
                                    ? product.createdAt.toDate().toLocaleDateString('es-ES', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })
                                    : 'N/A'; // Muestra 'N/A' si createdAt no es un Timestamp válido
                                return (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-center text-sm text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">
                                            {sequentialId}
                                        </td>
                                        <td className="pr-6 py-4 text-sm text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">
                                            {product.name}
                                        </td>
                                        <td className="pr-6 py-4 text-sm text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">
                                            {product.description}
                                        </td>
                                        <td className="pr-6 py-4 text-sm text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">
                                            {product.price}
                                        </td>
                                        <td className="pr-6 py-4 text-sm text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">
                                            {product.stock}
                                        </td>
                                        <td className="pr-6 py-4 text-sm text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">
                                            {product.category}
                                        </td>
                                        <td className="pr-6 py-4 text-sm text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">
                                            {creationDate}
                                        </td>
                                        <td className="pr-6 py-4 text-sm font-medium">
                                            <div className="flex items-center justify-center space-x-3">
                                                <button
                                                    className="text-indigo-600 hover:text-indigo-900 transition-colors cursor-pointer"
                                                    onClick={() => handleEditProductClick(product)}
                                                >
                                                    <FiEdit className="w-5 h-5" />
                                                </button>
                                                <button
                                                    className="text-red-600 hover:text-red-900 transition-colors cursor-pointer"
                                                    onClick={() => handleDeleteProduct(product.id)}
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
                    totalItems={filteredProducts.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            </div>
            {/* Renderiza el modal del formulario si showProductFormModal es true */}
            {showProductFormModal && (
                <ProductFormModal
                    onClose={handleCloseProductFormModal}
                    onSaveProduct={handleSaveProduct}
                    currentProduct={selectedProduct}
                />
            )}
        </div>
    );
};