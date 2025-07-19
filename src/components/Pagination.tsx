interface PaginationProps {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    className?: string;
    onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
    totalItems,
    itemsPerPage,
    currentPage,
    className,
    onPageChange,
}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const getPageNumbers = () => {
        const pageNumbers = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            pageNumbers.push(1);
            if (currentPage > 2) pageNumbers.push('...');
            if (currentPage > 1 && currentPage < totalPages) pageNumbers.push(currentPage);
            if (currentPage < totalPages - 1) pageNumbers.push('...');
            pageNumbers.push(totalPages);

            // Eliminar duplicados y mantener orden
            return Array.from(new Set(pageNumbers)).sort((a: any, b: any) => {
                if (a === '...') return -1;
                if (b === '...') return 1;
                return a - b;
            });
        }
        return pageNumbers;
    };

    return (
        <div className={`${className}`}>
            <div className="px-6 py-3 bg-gray-50 flex items-center justify-between rounded-b-lg border-gray-200">
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <span>Filas visibles: </span><span className="font-semibold">{itemsPerPage}</span>
                    {/* Implementación a futuro del selector de filas visibles */}
                    {/* <button className="ml-2 px-2 py-1 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 text-xs">
                        <span className="transform rotate-90 inline-block">˅</span>
                    </button> */}
                </div>
                <div className="flex items-center space-x-1">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-md hover:bg-gray-200 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        &lt;
                    </button>
                    {getPageNumbers().map((page, index) => (
                        <div key={index}>
                            {page === '...' ? (
                                <span className="px-2 text-gray-500">...</span>
                            ) : (
                                <button
                                    onClick={() => onPageChange(Number(page))}
                                    className={`px-3 py-1 rounded-md text-sm cursor-pointer ${Number(page) === currentPage ? 'bg-blue-500 text-white' : 'hover:bg-gray-200 text-gray-700'
                                        }`}
                                >
                                    {page}
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-md hover:bg-gray-200 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        &gt;
                    </button>
                </div>
            </div>
        </div>
    );
};