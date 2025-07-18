import { FiSearch } from 'react-icons/fi';

interface SearchInputProps {
    placeholder: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;

}

export const SearchInput: React.FC<SearchInputProps> = ({
    placeholder,
    value,
    onChange,
    className = '',
}) => {
    return (
        <div className={`relative`}>
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`
                    pl-10 pr-4 py-2 rounded-md bg-red-600 w-56
                    text-white placeholder-red-200
                    focus:outline-none focus:border-white
                    border focus:placeholder-white border-red-300 ${className}
                `}
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-200 focus:transform-none focus:text-white w-5 h-5" />
        </div>
    );
};