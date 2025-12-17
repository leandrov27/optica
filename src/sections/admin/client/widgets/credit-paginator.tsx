// @mui
import { Pagination, PaginationProps } from '@mui/material';
// routes
import { useRouter } from 'src/routes/hook';
// libs
import queryString from 'query-string';

// ----------------------------------------------------------------------

type Props = {
    color?: "primary" | "warning";
    currentPage: number;
    totalPages: number;
    paginationProps?: PaginationProps;
    paramName?: string;
};

// ----------------------------------------------------------------------

export default function CreditPaginator({
    color = "primary",
    currentPage,
    totalPages,
    paginationProps,
    paramName = 'page'
}: Props) {
    const router = useRouter();

    const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
        const currentParams = queryString.parse(location.search);

        // Usar paramName en lugar de 'page'
        const updatedParams = {
            ...currentParams,
            [paramName]: value,
        };

        const updatedUrl = queryString.stringifyUrl({
            url: window.location.pathname,
            query: updatedParams,
        });

        router.push(updatedUrl);
    };

    if (totalPages <= 1) return null;

    return (
        <Pagination
            {...paginationProps}
            count={totalPages}
            page={currentPage}
            onChange={handleChange}
            color={color}
        />
    );
}