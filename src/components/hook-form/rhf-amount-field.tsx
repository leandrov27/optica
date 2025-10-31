'use client';

import { useState, useEffect } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import TextField, { TextFieldProps } from '@mui/material/TextField';
// stores
import { useSettingsStore } from 'src/core/stores';

type Props = TextFieldProps & {
  name: string;
};

export default function RHFAmountField({ name, helperText, ...other }: Props) {
  const { control } = useFormContext();
  const [displayValue, setDisplayValue] = useState('');

  const settings = useSettingsStore((state) => state.settings);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          const raw = event.target.value.replace(/\./g, '').replace(/\D/g, '');
          const numeric = Number(raw);
          field.onChange(numeric);
          setDisplayValue(
            raw ? new Intl.NumberFormat(settings?.localeCode ?? 'es-PY', {
              style: 'decimal',
            }).format(Number(field.value)) : ''
          );
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
