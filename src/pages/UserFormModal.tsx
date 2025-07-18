import { useState, useRef } from 'react';
import { type UserData } from '../hooks/useUsers';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

interface UserFormModalProps {
    onClose: () => void;
    onSaveUser: (userData: Omit<UserData, 'id'> | UserData) => Promise<void>;
    currentUser?: UserData | null;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({ onClose, onSaveUser, currentUser }) => {

    const [name, setName] = useState(currentUser?.name || '');
    const [lastName, setLastName] = useState(currentUser?.lastName || '');
    const [salary, setSalary] = useState(currentUser?.salary ? String(currentUser.salary) : '');
    const [country, setCountry] = useState(currentUser?.country || '');
    const [city, setCity] = useState(currentUser?.city || '');

    // Estados para almacenar los mensajes de error de validación
    const [nameError, setNameError] = useState<string | null>(null);
    const [lastNameError, setLastNameError] = useState<string | null>(null);
    const [salaryError, setSalaryError] = useState<string | null>(null);
    const [countryError, setCountryError] = useState<string | null>(null);
    const [cityError, setCityError] = useState<string | null>(null);

    // Estado para indicar si el formulario se está enviando
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Referencia al contenedor del modal para detectar clics fuera
    const modalContentRef = useRef<HTMLDivElement>(null);


    // Expresiones regulares para validación:
    // ^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$
    // ^        -> Inicio de la cadena
    // [a-zA-Z] -> Letras de la A a la Z (mayúsculas y minúsculas)
    // áéíóúÁÉÍÓÚ -> Vocales acentuadas
    // ñÑ       -> Letra eñe
    // \s       -> Espacios en blanco
    // +        -> Uno o más caracteres del conjunto anterior
    // $        -> Fin de la cadena
    const lettersOnlyRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

    // ^[0-9]+$ -> Solo números (uno o más)
    const numbersOnlyRegex = /^[0-9]+$/;

    // Función de validación
    const validateForm = () => {
        let isValid = true;

        // Validar Nombre
        if (name.trim() === '') {
            setNameError('El nombre no puede estar vacío.');
            isValid = false;
        } else if (!lettersOnlyRegex.test(name.trim())) {
            setNameError('El nombre solo puede contener letras y espacios.');
            isValid = false;
        } else {
            setNameError(null);
        }

        // Validar Apellido
        if (lastName.trim() === '') {
            setLastNameError('El apellido no puede estar vacío.');
            isValid = false;
        } else if (!lettersOnlyRegex.test(lastName.trim())) {
            setLastNameError('El apellido solo puede contener letras y espacios.');
            isValid = false;
        } else {
            setLastNameError(null);
        }

        // Validar Salario
        if (salary.trim() === '') {
            setSalaryError('El salario no puede estar vacío.');
            isValid = false;
        } else if (!numbersOnlyRegex.test(salary.trim())) {
            setSalaryError('El salario debe contener solo números.');
            isValid = false;
        } else {
            const numericSalary = Number(salary);
            if (numericSalary <= 0) {
                setSalaryError('El salario debe ser un número positivo.');
                isValid = false;
            } else {
                setSalaryError(null);
            }
        }

        // Validar País
        if (country.trim() === '') {
            setCountryError('El país no puede estar vacío.');
            isValid = false;
        } else if (!lettersOnlyRegex.test(country.trim())) {
            setCountryError('El país solo puede contener letras y espacios.');
            isValid = false;
        } else {
            setCountryError(null);
        }

        // Validar Ciudad
        if (city.trim() === '') {
            setCityError('La ciudad no puede estar vacía.');
            isValid = false;
        } else if (!lettersOnlyRegex.test(city.trim())) {
            setCityError('La ciudad solo puede contener letras y espacios.');
            isValid = false;
        } else {
            setCityError(null);
        }

        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Ejecutar la validación antes de intentar guardar
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true); // Indicar que se está enviando
        try {
            const userDataToSave: Omit<UserData, 'id'> | UserData = {
                name: name.trim(),
                lastName: lastName.trim(),
                salary: Number(salary),
                country: country.trim(),
                city: city.trim(),
            };

            if (currentUser && currentUser.id) {
                (userDataToSave as UserData).id = currentUser.id;
            }

            await onSaveUser(userDataToSave);
            onClose(); // Cerrar el modal solo si el guardado fue exitoso
        } catch (error) {
            console.error("Error al guardar usuario:", error);
            alert("Hubo un error al guardar el usuario. Por favor, inténtalo de nuevo.");
        } finally {
            setIsSubmitting(false); // Siempre resetear el estado de envío
        }
    };

    // --- Función para cerrar el modal al hacer click fuera de este ---
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (modalContentRef.current && !modalContentRef.current.contains(e.target as Node)) {
            onClose();
        }
    }

    const title = currentUser ? "Editar Usuario" : "Nuevo Usuario";
    const submitButtonText = currentUser ? 'Guardar Cambios' : 'Añadir Usuario';

    return (
        <div
            className="fixed inset-0 bg-black/50 flex justify-center overflow-auto items-center z-50"
            onClick={handleOverlayClick}
        >
            <div className="bg-white p-6 rounded-lg w-full max-w-md" ref={modalContentRef}>
                <h3 className="text-xl font-bold mb-4 text-gray-800">{title}</h3>
                <form onSubmit={handleSubmit}>
                    <Input
                        label='Nombre'
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {nameError && <p className="text-sm text-red-500 -mt-3">{nameError}</p>}
                    <Input
                        label='Apellido'
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    {lastNameError && <p className="text-sm text-red-500 -mt-3">{lastNameError}</p>}
                    <Input
                        label='Salario'
                        id="salary"
                        type="text"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                    />
                    {salaryError && <p className="text-sm text-red-500 -mt-3">{salaryError}</p>}
                    <Input
                        label='Pais'
                        id="country"
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    />
                    {countryError && <p className="text-sm text-red-500 -mt-3">{countryError}</p>}
                    <Input
                        label='Ciudad'
                        id="city"
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                    {cityError && <p className="text-sm text-red-500 -mt-3 -mb-0">{cityError}</p>}

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
