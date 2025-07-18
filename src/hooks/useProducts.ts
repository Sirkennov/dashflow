import { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  type DocumentData,
  FieldValue // Importa FieldValue para createdAt
} from 'firebase/firestore';
import { db } from '../firebase';

// Define la interfaz ProductData
export interface ProductData extends DocumentData {
    id: string; 
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    createdAt: FieldValue; // Usaremos FieldValue para la creación de Timestamp
}

interface UseProductsResult {
    products: ProductData[];
    loading: boolean;
    error: string | null;
}

export const useProducts = (): UseProductsResult => {
    const [products, setProducts] = useState<ProductData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true); 
        setError(null); 

        const productsCollectionRef = collection(db, 'products');
        // Ordenamos los productos por la fecha de creación en orden descendente para ver los más recientes
        const q = query(productsCollectionRef, orderBy('createdAt', 'desc')); 

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const productsData: ProductData[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data(); 
                // Asegúrate de que todos los campos esperados estén presentes y sean del tipo correcto
                if (
                    data.name && 
                    data.description !== undefined && // description podría ser una cadena vacía
                    typeof data.price === 'number' && 
                    typeof data.stock === 'number' && 
                    data.category &&
                    data.createdAt
                ) {
                    productsData.push({
                        id: doc.id,
                        name: data.name,
                        description: data.description,
                        price: data.price,
                        stock: data.stock,
                        category: data.category,
                        createdAt: data.createdAt, // Esto será un Timestamp de Firestore
                    });
                } else {
                    console.warn("Documento de producto incompleto o mal formado:", doc.id, data);
                }
            });
            setProducts(productsData);
            setLoading(false); 
        }, (err) => {
            console.error("Error fetching products from Firestore:", err);
            setError(`Error al cargar productos: ${err.message || 'Error desconocido.'}`); 
            setLoading(false); 
        });

        return () => unsubscribe();
    }, []); 

    return { products, loading, error };
};