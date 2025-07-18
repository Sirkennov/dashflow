import { useState, useRef, useEffect } from 'react';
import { type ProductData } from '../hooks/useProducts';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

interface ProductFormModalProps {
    onClose: () => void;
    onSaveProduct: (productData: Omit<ProductData, 'id' | 'createdAt'> | ProductData) => Promise<void>;
    currentProduct?: ProductData | null; // El producto actual si estamos editando
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({ onClose, onSaveProduct, currentProduct }) => {
    // Estados para los campos del formulario, inicializados con los datos del producto actual si es edición
    const [name, setName] = useState(currentProduct?.name || '');
    const [description, setDescription] = useState(currentProduct?.description || '');
    const [price, setPrice] = useState(currentProduct?.price ? String(currentProduct.price) : '');
    const [stock, setStock] = useState(currentProduct?.stock ? String(currentProduct.stock) : '');
    const [category, setCategory] = useState(currentProduct?.category || ''); // Estado para la categoría

    // Estados para los mensajes de error de validación
    const [nameError, setNameError] = useState<string | null>(null);
    const [descriptionError, setDescriptionError] = useState<string | null>(null);
    const [priceError, setPriceError] = useState<string | null>(null);
    const [stockError, setStockError] = useState<string | null>(null);
    const [categoryError, setCategoryError] = useState<string | null>(null); // Estado de error para categoría

    // Estado para indicar si el formulario se está enviando (para deshabilitar el botón)
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Referencia al contenedor del modal para detectar clics fuera y cerrarlo
    const modalContentRef = useRef<HTMLDivElement>(null);

    // Determina el texto del botón de envío y el título del modal
    const title = currentProduct ? "Editar Producto" : "Nuevo Producto";
    const submitButtonText = currentProduct ? 'Guardar Cambios' : 'Añadir Producto';

    // Efecto para detectar clics fuera del modal y cerrarlo
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalContentRef.current && !modalContentRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]); // Se vuelve a ejecutar si onClose cambia (aunque en este caso es estable)

    // Función de validación del formulario
    const validateForm = () => {
        let isValid = true;

        // Validar Nombre
        if (name.trim() === '') {
            setNameError('El nombre del producto no puede estar vacío.');
            isValid = false;
        } else {
            setNameError(null);
        }

        // Validar Descripción
        if (description.trim() === '') {
            setDescriptionError('La descripción no puede estar vacía.');
            isValid = false;
        } else {
            setDescriptionError(null);
        }

        // Validar Precio
        const parsedPrice = Number(price); // Convertir a número para validación
        if (price.trim() === '') {
            setPriceError('El precio no puede estar vacío.');
            isValid = false;
        } else if (isNaN(parsedPrice)) {
            setPriceError('El precio debe ser un número entero.');
            isValid = false;
        } else if (parsedPrice < 0) {
            setPriceError('El precio no puede ser negativo.');
            isValid = false;
        } else {
            setPriceError(null);
        }

        // Validar Stock
        const parsedStock = Number(stock); // Convertir a número para validación
        if (stock.trim() === '') {
            setStockError('El stock no puede estar vacío.');
            isValid = false;
        } else if (isNaN(parsedStock) || !Number.isInteger(parsedStock)) { // Debe ser un número entero
            setStockError('El stock debe ser un número entero.');
            isValid = false;
        } else if (parsedStock < 0) {
            setStockError('El stock no puede ser negativo.');
            isValid = false;
        } else {
            setStockError(null);
        }

        // Validar Categoría
        if (category.trim() === '') {
            setCategoryError('La categoría no puede estar vacía.');
            isValid = false;
        } else {
            setCategoryError(null);
        }

        return isValid;
    };

    // Manejador de envío del formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); 

        // Ejecutar la validación antes de intentar guardar
        if (!validateForm()) { 
            return;
        }

        setIsSubmitting(true); // Indica que el envío está en curso
        try {
            // Crea el objeto de datos del producto sin 'id' ni 'createdAt' inicialmente
            const productDataToSave: Omit<ProductData, 'id' | 'createdAt'> = {
                name: name.trim(),
                description: description.trim(),
                price: parseFloat(price),
                stock: parseInt(stock),
                category: category.trim(),
            };

            if (currentProduct && currentProduct.id) {
                // Modo Edición: Incluye el ID y el createdAt original del producto
                await onSaveProduct({ ...productDataToSave, id: currentProduct.id, createdAt: currentProduct.createdAt });
            } else {
                await onSaveProduct(productDataToSave);
            }
            onClose(); // Cierra el modal al guardar exitosamente
        } catch (error) {
            console.error("Error al guardar el producto en el modal:", error);
            alert("Hubo un error al guardar el producto. Por favor, inténtalo de nuevo."); // Muestra un mensaje al usuario
        } finally {
            setIsSubmitting(false); // Restablece el estado de envío
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center overflow-auto items-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md" ref={modalContentRef}>
                <h3 className="text-xl font-bold mb-4 text-gray-800">{title}</h3>
                <form onSubmit={handleSubmit}>
                    <Input
                        label='Nombre del Producto'
                        id="productName"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {nameError && <p className="text-sm text-red-500 -mt-3">{nameError}</p>}
                    <Input
                        label='Descripción'
                        id="productDescription"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    {descriptionError && <p className="text-sm text-red-500 -mt-3">{descriptionError}</p>}
                    <Input
                        label='Precio'
                        id="productPrice"
                        type="text"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        step="0.01"
                    />
                    {priceError && <p className="text-sm text-red-500 -mt-3">{priceError}</p>}
                    <Input
                        label='Stock'
                        id="productStock"
                        type="text"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                    />
                    {stockError && <p className="text-sm text-red-500 -mt-3">{stockError}</p>}
                    <Input
                        label='Categoría'
                        id="productCategory"
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />
                    {categoryError && <p className="text-sm text-red-500 -mt-3">{categoryError}</p>}
                    <div className="flex items-center justify-between mt-6">
                        <Button
                            type="submit"
                            className="bg-green-500 hover:bg-green-700"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Guardando...' : submitButtonText}
                        </Button>
                        <Button
                            type="button"
                            className="bg-red-500 hover:bg-red-700"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};