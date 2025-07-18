import { useState, useMemo } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useProducts, type ProductData } from '../hooks/useProducts'; // Importa useProducts y ProductData
import { ProductFormModal } from './ProductFormModal'; // Importa el nuevo modal
import { Pagination } from '../components/Pagination';
import { ContentHeader } from '../components/ContentHeader';

export const ProductsPage: React.FC = () => {
    const { products, loading, error } = useProducts(); // Usa el hook de productos
    const [showProductFormModal, setShowProductFormModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);

    // Estado para la paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15); // Define cuántos elementos por página

    // Estado para el término de búsqueda
    const [searchTerm, setSearchTerm] = useState('');

    // --- LÓGICA DE FILTRADO Y PAGINACIÓN ---
    const filteredProducts = useMemo(() => {
        let filtered = products;

        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            filtered = products.filter(product => {
                return (
                    product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                    product.description.toLowerCase().includes(lowerCaseSearchTerm) ||
                    product.category.toLowerCase().includes(lowerCaseSearchTerm) ||
                    String(product.price).includes(lowerCaseSearchTerm) ||
                    String(product.stock).includes(lowerCaseSearchTerm)
                );
            });
        }
        return filtered;
    }, [products, searchTerm]);

    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredProducts.slice(startIndex, endIndex);
    }, [filteredProducts, currentPage, itemsPerPage]);

    // --- MANEJADORES DEL MODAL ---
    const handleAddProduct = () => {
        setSelectedProduct(null); // Asegura que el modal esté en modo "añadir"
        setShowProductFormModal(true);
    };

    const handleEditProduct = (product: ProductData) => {
        setSelectedProduct(product); // Pasa el producto para editar
        setShowProductFormModal(true);
    };

    const handleCloseProductFormModal = () => {
        setShowProductFormModal(false);
        setSelectedProduct(null); // Limpia el producto seleccionado al cerrar
    };

    // --- OPERACIONES CRUD DE FIRESTORE ---
    const handleSaveProduct = async (productData: Omit<ProductData, 'id' | 'createdAt'> | ProductData) => {
        try {
            if ('id' in productData && productData.id) {
                // Es una edición
                const { id, createdAt, ...dataToUpdate } = productData;
                const productRef = doc(db, 'products', id);
                await updateDoc(productRef, dataToUpdate);
                console.log("Producto actualizado con ID:", id);
            } else {
                // Es un nuevo producto
                // Añadimos createdAt con serverTimestamp() solo al crear
                const productWithTimestamp = {
                    ...productData,
                    createdAt: serverTimestamp(),
                };
                await addDoc(collection(db, 'products'), productWithTimestamp);
                console.log("Nuevo producto añadido");
            }
        } catch (e) {
            console.error("Error al guardar el producto:", e);
            throw e; // Lanza el error para que el modal pueda manejarlo
        }
    };

    const handleDeleteProduct = async (productId: string) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
            try {
                await deleteDoc(doc(db, 'products', productId));
                console.log("Producto eliminado con ID:", productId);
            } catch (e) {
                console.error("Error al eliminar el producto:", e);
                alert("Hubo un error al eliminar el producto.");
            }
        }
    };

    // --- MANEJADORES DE PAGINACIÓN ---
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // --- MANEJADOR DE BÚSQUEDA ---
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Resetear a la primera página al buscar
    };

    if (loading) {
        return (
            <div className="flex-1 p-6 flex justify-center items-center">
                <p className="text-gray-700">Cargando productos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 p-6 flex justify-center items-center">
                <p className="text-red-500">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-gray-200 rounded-lg shadow-md overflow-hidden">
            <ContentHeader
                title="Productos"
                onClick={handleAddProduct}
                searchValue={searchTerm}
                onSearchChange={handleSearchChange}
            />

            <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="overflow-x-auto rounded-lg shadow">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr className="bg-gray-800 text-white uppercase text-sm font-semibold">
                                <th className="px-5 py-3 border-b-2 border-gray-700 text-left">Nombre</th>
                                <th className="px-5 py-3 border-b-2 border-gray-700 text-left">Descripción</th>
                                <th className="px-5 py-3 border-b-2 border-gray-700 text-left">Precio</th>
                                <th className="px-5 py-3 border-b-2 border-gray-700 text-left">Stock</th>
                                <th className="px-5 py-3 border-b-2 border-gray-700 text-left">Categoría</th>
                                <th className="px-5 py-3 border-b-2 border-gray-700 text-left">Creación</th>
                                <th className="px-5 py-3 border-b-2 border-gray-700 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                                        No se encontraron productos.
                                    </td>
                                </tr>
                            ) : (
                                paginatedProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-100">
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap">{product.name}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap max-w-xs overflow-hidden text-ellipsis">
                                                {product.description || 'N/A'}
                                            </p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap">${product.price.toFixed(2)}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap">{product.stock}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap">{product.category}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap">
                                                {/* Asegúrate de que createdAt sea un objeto Timestamp */}
                                                {'toDate' in product.createdAt ? (product.createdAt as any).toDate().toLocaleDateString() : 'N/A'}
                                            </p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                                            <div className="flex justify-center items-center space-x-3">
                                                <button
                                                    className="text-blue-600 hover:text-blue-900 transition-colors"
                                                    onClick={() => handleEditProduct(product)}
                                                >
                                                    <FiEdit className="w-5 h-5" />
                                                </button>
                                                <button
                                                    className="text-red-600 hover:text-red-900 transition-colors"
                                                    onClick={() => handleDeleteProduct(product.id)}
                                                >
                                                    <FiTrash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination
                    className='flex-shrink-0 border-t border-gray-200 mt-4' // Añadí mt-4 para separación
                    totalItems={filteredProducts.length} // totalItems es el número de elementos filtrados
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            </div>

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