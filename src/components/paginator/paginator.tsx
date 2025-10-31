// @mui
import { Pagination, PaginationProps } from '@mui/material';
// routes
import { useRouter } from 'src/routes/hook';
// libs
import queryString from 'query-string';

// ----------------------------------------------------------------------

type Props = {
    color?: "primary" | "warning"
    currentPage: number;
    totalPages: number;
    paginationProps?: PaginationProps;
};

// ----------------------------------------------------------------------

export default function Paginator({ color = "primary", currentPage, totalPages, paginationProps }: Props) {
    const router = useRouter();

    const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
        // Obtener los parámetros actuales.
        const currentParams = queryString.parse(location.search);

        // Actualizar los parámetros
        const updatedParams = {
            ...currentParams,
            page: value,
        };

        const updatedUrl = queryString.stringifyUrl({
            url: window.location.pathname,
            query: updatedParams,
        });

        router.push(updatedUrl);
    };

    if (totalPages <= 1) return null;

    return (
        <Pagination {...paginationProps} count={totalPages} page={currentPage} onChange={handleChange} color={color} />
    );
}
