// src/pages/ProductFormModal.tsx
import { useState, useRef } from 'react';
import { type ProductData } from '../hooks/useProducts'; // Importa la interfaz ProductData
import { Input } from '../components/Input';
import { Button } from '../components/Button';

interface ProductFormModalProps {
    onClose: () => void;
    // La función onSaveProduct manejará tanto la creación como la edición
    onSaveProduct: (productData: Omit<ProductData, 'id' | 'createdAt'> | ProductData) => Promise<void>;
    currentProduct?: ProductData | null; // El producto actual si estamos editando
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({ onClose, onSaveProduct, currentProduct }) => {
    // Estados para los campos del formulario
    const [name, setName] = useState(currentProduct?.name || '');
    const [description, setDescription] = useState(currentProduct?.description || '');
    const [price, setPrice] = useState(currentProduct?.price ? String(currentProduct.price) : '');
    const [stock, setStock] = useState(currentProduct?.stock ? String(currentProduct.stock) : '');
    const [category, setCategory] = useState(currentProduct?.category || '');

    // Estados para los mensajes de error de validación
    const [nameError, setNameError] = useState<string | null>(null);
    const [descriptionError, setDescriptionError] = useState<string | null>(null);
    const [priceError, setPriceError] = useState<string | null>(null);
    const [stockError, setStockError] = useState<string | null>(null);
    const [categoryError, setCategoryError] = useState<string | null>(null);

    // Estado para indicar si el formulario se está enviando
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Referencia al contenedor del modal para detectar clics fuera
    const modalContentRef = useRef<HTMLDivElement>(null);

    // Función de validación del formulario
    const validateForm = () => {
        let isValid = true;

        if (name.trim() === '') {
            setNameError('El nombre del producto no puede estar vacío.');
            isValid = false;
        } else {
            setNameError(null);
        }

        if (description.trim() === '') {
            setDescriptionError('La descripción no puede estar vacía.');
            isValid = false;
        } else {
            setDescriptionError(null);
        }

        if (price.trim() === '') {
            setPriceError('El precio no puede estar vacío.');
            isValid = false;
        } else if (isNaN(Number(price))) {
            setPriceError('El precio debe ser un número.');
            isValid = false;
        } else if (Number(price) < 0) {
            setPriceError('El precio no puede ser negativo.');
            isValid = false;
        } else {
            setPriceError(null);
        }

        if (stock.trim() === '') {
            setStockError('El stock no puede estar vacío.');
            isValid = false;
        } else if (isNaN(Number(stock))) {
            setStockError('El stock debe ser un número entero.');
            isValid = false;
        } else if (Number(stock) < 0) {
            setStockError('El stock no puede ser negativo.');
            isValid = false;
        } else if (!Number.isInteger(Number(stock))) {
            setStockError('El stock debe ser un número entero.');
            isValid = false;
        } else {
            setStockError(null);
        }

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

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            const productDataToSave: Omit<ProductData, 'id' | 'createdAt'> = {
                name,
                description,
                price: Number(price),
                stock: Number(stock),
                category,
            };

            if (currentProduct && currentProduct.id) {
                // Si estamos editando, necesitamos el ID del producto
                await onSaveProduct({ ...productDataToSave, id: currentProduct.id, createdAt: currentProduct.createdAt });
            } else {
                await onSaveProduct(productDataToSave);
            }
            onClose();
        } catch (error) {
            console.error("Error al guardar el producto:", error);
            alert("Hubo un error al guardar el producto. Por favor, inténtalo de nuevo.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const title = currentProduct ? "Editar Producto" : "Nuevo Producto";
    const submitButtonText = currentProduct ? 'Guardar Cambios' : 'Añadir Producto';

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div ref={modalContentRef} className="bg-white p-6 rounded-lg w-full max-w-md">
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
                        type="text" // Usamos text para permitir el input de decimales antes de convertir a number
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                    {priceError && <p className="text-sm text-red-500 -mt-3">{priceError}</p>}
                    <Input
                        label='Stock'
                        id="productStock"
                        type="text" // Usamos text para permitir la validación de entero
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