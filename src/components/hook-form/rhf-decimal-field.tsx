'use client';

import { useState, useEffect } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import TextField, { TextFieldProps } from '@mui/material/TextField';
// stores
import { useSettingsStore } from 'src/core/stores';

type RHFDecimalFieldProps = TextFieldProps & {
    name: string;
};

export default function RHFDecimalField({ name, helperText, ...other }: RHFDecimalFieldProps) {
    const { control } = useFormContext();
    const [displayValue, setDisplayValue] = useState('');

    const settings = useSettingsStore((state) => state.settings);

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => {
                const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                    let input = event.target.value;

                    // Permitir solo números, puntos o comas
                    input = input.replace(/[^0-9.,]/g, '');

                    // Si hay más de un punto o coma, mantener solo el primero
                    const parts = input.split(/[.,]/);
                    if (parts.length > 2) input = parts[0] + '.' + parts[1];

                    // Reemplazar coma por punto
                    input = input.replace(',', '.');

                    // Convertir a número decimal (sin perder decimales)
                    const numeric = parseFloat(input);
                    field.onChange(isNaN(numeric) ? '' : numeric);

                    // Mostrar lo que el usuario escribe
                    setDisplayValue(input);
                };

                useEffect(() => {
                    if (field.value) {
                        setDisplayValue(
                            new Intl.NumberFormat(settings?.localeCode ?? 'es-PY', {
                                style: 'decimal',
                            }).format(Number(field.value))
                        );
                    }
                }, [field.value, settings?.localeCode]);

                return (
                    <TextField
                        {...field}
                        value={displayValue}
                        onChange={handleChange}
                        fullWidth
                        inputProps={{ inputMode: 'numeric' }}
                        error={!!error}
                        helperText={error ? error.message : helperText}
                        {...other}
                    />
                );
            }}
        />
    );
}
