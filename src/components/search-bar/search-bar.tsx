'use client';

// react
import { useEffect } from 'react';
// @mui
import { Box, Stack, IconButton } from '@mui/material';
// routes
import { useRouter, useSearchParams } from 'src/routes/hook';
// components
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Iconify from 'src/components/iconify';
import { useForm } from 'react-hook-form';
// libs
import z from 'src/libs/zod';
// pkgs
import queryString from 'query-string';

// ----------------------------------------------------------------------

interface SearchBarProps {
    placeholder?: string,
}

// ----------------------------------------------------------------------

export default function SearchBar({ placeholder = 'Ingrese un término de búsqueda...' }: SearchBarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const SearchSchema = z.object({
        search: z.string().min(1, 'Debe ingresar un término de búsqueda'),
    });

    const methods = useForm({
        resolver: zodResolver(SearchSchema),
        defaultValues: {
            search: '',
        },
    });

    const { setValue, handleSubmit } = methods;

    const handleSearch = (data: { search: string }) => {
        // Obtener los parámetros actuales.
        const currentParams = queryString.parse(location.search);

        // Actualizar los parámetros: resetear página a 1 y agregar búsqueda
        const updatedParams = {
            ...currentParams,
            search: data.search,
            page: undefined
        };

        const updatedUrl = queryString.stringifyUrl({
            url: window.location.pathname,
            query: updatedParams,
        });

        router.push(updatedUrl);
    };

    const searchQuery = searchParams.get('search');

    useEffect(() => {
        if (searchQuery) {
            setValue('search', searchQuery);
        } else {
            setValue('search', '');
        }
    }, [searchQuery, setValue]);

    const handleClear = () => {
        setValue('search', '');

        // Obtener los parámetros actuales.
        const currentParams = queryString.parse(location.search);

        // Eliminar el parámetro `search` y resetear página a 1
        const updatedParams = {
            ...currentParams,
            search: undefined,
            page: undefined // También resetear página al limpiar
        };

        const updatedUrl = queryString.stringifyUrl({
            url: window.location.pathname,
            query: updatedParams,
        });
        
        router.push(updatedUrl);
    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(handleSearch)}>
            <Box m={2}>
                <Stack direction="row" spacing={1} alignItems="flex-start">
                    <RHFTextField
                        fullWidth
                        placeholder={placeholder}
                        name="search"
                        sx={{
                            flexGrow: 1,
                            minWidth: 0,
                        }}
                    />

                    <Stack flexDirection="row" gap={1} sx={{ mt: 0.5 }}>
                        {searchQuery && (
                            <IconButton
                                color="error"
                                onClick={handleClear}
                                sx={{
                                    border: (theme) => `1px dashed ${theme.palette.error.main}`,
                                    width: 45,
                                    height: 45,
                                    flexShrink: 0,
                                }}
                            >
                                <Iconify icon="hugeicons:clean" />
                            </IconButton>
                        )}

                        <IconButton
                            type="submit"
                            color="primary"
                            sx={{
                                border: (theme) => `1px solid ${theme.palette.primary.main}`,
                                width: 45,
                                height: 45,
                                flexShrink: 0,
                            }}
                        >
                            <Iconify icon="ic:twotone-search" />
                        </IconButton>
                    </Stack>
                </Stack>
            </Box>
        </FormProvider>
    );
}