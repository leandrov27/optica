'use client';

// react
import { useState, useEffect, useMemo } from 'react';
// @mui
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
// libs
import ax, { API_ENDPOINTS } from 'src/libs/fetcher';
// stores
import { useSettingsStore } from 'src/core/stores';
// pkgs
import { debounce } from 'lodash';
// schemas
import { type INoteProduct } from 'src/core/schemas';

// ----------------------------------------------------------------------

interface ProductAutocompleteProps {
    helperText?: string;
    error: boolean;
    onSubmitting: boolean;
    onHandleChange: (product: INoteProduct) => void;
}

// ----------------------------------------------------------------------

export default function ProductAutocomplete({ helperText, error, onSubmitting, onHandleChange }: ProductAutocompleteProps) {
    const settings = useSettingsStore((state) => state.settings);

    const [inputValue, setInputValue] = useState<string>('');
    const [options, setOptions] = useState<INoteProduct[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [value, setValue] = useState<INoteProduct | null>(null); // ← Nuevo estado

    const debouncedSearch = useMemo(() => debounce(async (query: string) => {
        if (!query || query.length < 1) {
            setOptions([]);
            return;
        }

        try {
            const resp = await ax.get<{ products: INoteProduct[] }>(
                API_ENDPOINTS.admin.note.search_product(query)
            );
            setOptions(resp.data.products);
        } catch (err) {
            console.error('Error fetching products:', err);
            setOptions([]);
        }
    }, 300), []);

    useEffect(() => {
        setLoading(true);
        debouncedSearch(inputValue);
        const timeout = setTimeout(() => setLoading(false), 500);

        return () => clearTimeout(timeout);
    }, [inputValue, debouncedSearch]);

    return (
        <Autocomplete
            fullWidth
            disabled={onSubmitting}
            options={options}
            value={value} // ← Controlamos el valor
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            onChange={(event, newValue) => {
                setValue(null); // ← Limpiamos el valor seleccionado
                setInputValue(''); // ← Limpiamos el texto del input

                if (newValue) {
                    onHandleChange({
                        id: newValue.id,
                        description: newValue.description,
                        price: newValue.price,
                    });
                }
            }}
            getOptionLabel={(option) =>
                `${option.description} · ${settings?.currencySymbol} ${option.price}`
            }
            loading={loading}
            loadingText="Cargando resultados..."
            noOptionsText={
                loading
                    ? 'Buscando...'
                    : inputValue.length === 0
                        ? 'Buscar producto por descripción o código...'
                        : 'No se encontraron coincidencias.'
            }
            renderOption={(props, option) => {
                const { key, ...rest } = props;

                return (
                    <Box
                        component="li"
                        key={key}
                        {...rest}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            py: 1,
                            px: 2,
                            borderBottom: '1px solid #f0f0f02c',
                            '&:last-of-type': { borderBottom: 'none' },
                        }}
                    >
                        <Typography variant="subtitle1" fontWeight={600}>
                            {option.description} · {settings?.currencySymbol} {String(option.price)}
                        </Typography>
                    </Box>
                );
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    placeholder="Buscar producto..."
                    helperText={helperText}
                    error={!!error}
                    disabled={onSubmitting}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    )
}