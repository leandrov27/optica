'use client';

// react
import { useState, useEffect, useMemo, ReactNode } from 'react';
// @mui
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
// libs
import ax, { API_ENDPOINTS } from 'src/libs/fetcher';
// pkgs
import { debounce } from 'lodash';
// schemas
import { type IClientRaw } from 'src/core/schemas';

// ----------------------------------------------------------------------

type IClientAutocomplete = IClientRaw;

interface ClientAutocompleteProps {
    helperText?: string;
    error: boolean;
    onSubmitting: boolean;
    onHandleChange: (value: number) => void;
}

// ----------------------------------------------------------------------

export default function ClientAutocomplete({ helperText, error, onSubmitting, onHandleChange }: ClientAutocompleteProps) {
    const [inputValue, setInputValue] = useState<string>('');
    const [options, setOptions] = useState<IClientAutocomplete[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const debouncedSearch = useMemo(() => debounce(async (query: string) => {
        if (!query || query.length < 1) {
            setOptions([]);
            return;
        }

        try {
            const resp = await ax.get<{ clients: IClientAutocomplete[] }>(
                API_ENDPOINTS.admin.client.search(query)
            );
            setOptions(resp.data.clients);
        } catch (err) {
            console.error('Error fetching clients:', err);
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
            getOptionLabel={(option) =>
                `${option.displayName} (${option.phone})`
            }
            loading={loading}
            loadingText="Cargando resultados..."
            noOptionsText={
                loading
                    ? 'Buscando...'
                    : inputValue.length === 0
                        ? 'Buscar cliente por nombre, rfc, email o teléfono...'
                        : 'No se encontraron coincidencias.'
            }
            onChange={(event, value) => {
                if (value) {
                    onHandleChange(value.id);
                } else {
                    onHandleChange(0);
                    setInputValue('');
                }
            }}
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
                            {option.displayName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            📄 {option.type === 'INDIVIDUAL' ? 'Física' : 'Moral'} · 📞 {option.phone}
                        </Typography>
                    </Box>
                );
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    placeholder="Buscar cliente..."
                    helperText={helperText}
                    error={!!error}
                    disabled={onSubmitting}
                    onChange={(e) => setInputValue(e.target.value)}
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
