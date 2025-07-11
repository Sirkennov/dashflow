import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    className?: string;
}

export const Button: React.FC<ButtonProps> = ({ children, className, ...rest }) => {
    return (
        <button
            className={`
        bg-red-500 hover:bg-red-700 text-white 
        font-bold py-2 px-4 rounded focus:outline-none 
        focus:shadow-outline cursor-pointer ${className}`}
            {...rest} // Aquí se pasan todas las demás propiedades HTML (type, onClick, disabled, etc.)
        >
            {children}
        </button>
    );
};

