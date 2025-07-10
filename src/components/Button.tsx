import type { ButtonHTMLAttributes } from 'react';

// Define las propiedades de nuestro componente Button
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode; // Contenido del botón (texto, íconos, etc.)
  className?: string; // Propiedad opcional para la clase CSS
}

export const Button: React.FC<ButtonProps> = ({ children, className, ...rest }) => {
  return (
    <button
      className={`
        bg-red-500 hover:bg-red-700 text-white 
        font-bold py-2 px-4 rounded focus:outline-none 
        focus:shadow-outline w-full cursor-pointer ${className}`}
      {...rest} // Aquí se pasan todas las demás propiedades HTML (type, onClick, disabled, etc.)
    >
      {children}
    </button>
  );
};

