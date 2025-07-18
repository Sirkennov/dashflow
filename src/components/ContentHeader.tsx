import { Button } from './Button';
import { SearchInput } from './SearchInput';

interface ContentHeaderProps {
    title: string;
    onClick: () => void;
    searchValue: string;
    onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ContentHeader: React.FC<ContentHeaderProps> = ({
    title,
    onClick,
    searchValue,
    onSearchChange,
}) => {
    return (
        <div className="flex justify-between gap-4 px-6 py-4 bg-red-500 text-white flex-shrink-0">
            <h2 className="text-4xl font-bold">{title}</h2>
            <div className="flex gap-4">
                <SearchInput
                    value={searchValue}
                    onChange={onSearchChange}
                    placeholder={`Buscar ${title.toLowerCase().slice(0, -1)}...`}
                />
                <Button
                    className="bg-green-500 hover:bg-green-700"
                    onClick={onClick}
                >
                    {`Añadir ${title.slice(0, -1)}`}
                </Button>
            </div>
        </div>
    );
};