import type { InputHTMLAttributes } from 'react';

// Define las propiedades de nuestro componente Input
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string; // Propiedad opcional para la etiqueta del campo
  className?: string; // Propiedad opcional para la clase CSS
}

export const Input: React.FC<InputProps> = ({ label, className, ...rest }) => {
  return (
    <div className="mb-4">
      {/* Si se proporciona una 'label', renderiza el elemento <label> */}
      {label && (
        <label htmlFor={rest.id || rest.name} className="block text-gray-700 text-sm font-bold mb-2">
          {label}
        </label>
      )}
      <input
        className={`
            shadow appearance-none border 
            border-gray-400 rounded w-full py-2 px-3 
            text-gray-700 leading-tight 
            focus:outline-none focus:shadow-outline
        ${className}`}
        {...rest} // Aquí se pasan todas las demás propiedades HTML (type, placeholder, value, onChange, etc.)
      />
    </div>
  );
};
