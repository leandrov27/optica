'use client';

// react
import { useState, useEffect } from 'react';
// @mui
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
// data
import rawLocales from 'src/data/locales.json'; // tu archivo local

// ---------- tipos ----------
type LocaleItem = {
    countryCode: string;
    countryName: string;
    currencyCode?: string;
    currencySymbol?: string;
    currencyName?: string;
    languageCode?: string;
    languageName?: string;
    flag?: string;
};

type RawLocale = {
    locale: string;
    language: {
        name: string;
        iso_639_1?: string;
        countries?: { name: string; code?: string }[];
    };
    country: {
        name_local: string;
        code?: string;
        currency?: string;
        currency_code?: string;
        currency_symbol?: string;
        flag?: string;
    };
};

// ---------- helpers ----------
function mapRawToLocaleItem(raw: RawLocale): LocaleItem {
    const countryCode =
        raw.country?.code ??
        (raw.language?.countries && raw.language.countries[0]?.code) ??
        '';
    const countryName =
        raw.country?.name_local ??
        (raw.language?.countries && raw.language.countries[0]?.name) ??
        '';
    const currencyCode = raw.country?.currency_code ?? raw.country?.currency ?? undefined;
    const currencySymbol = raw.country?.currency_symbol ?? raw.country?.currency_symbol ?? undefined;
    const currencyName = raw.country?.currency ?? undefined;
    
    const languageCode = raw.locale ?? raw.locale ?? undefined;
    const languageName = raw.language?.name ?? undefined;
    
    const flag = raw.country?.flag ?? undefined;

    return {
        countryCode,
        countryName,
        currencyCode,
        currencySymbol,
        currencyName,
        languageCode,
        languageName,
        flag,
    };
}

function getFlagEmoji(countryCode: string) {
    if (!countryCode) return '';
    return countryCode
        .toUpperCase()
        .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

// ---------- componente ----------
interface CountryAutocompleteProps {
    helperText?: string;
    error?: boolean;
    onSubmitting?: boolean;
    onHandleChange: (selected: LocaleItem | null) => void;
}

export default function CountryAutocomplete({
    helperText,
    error,
    onSubmitting = false,
    onHandleChange,
}: CountryAutocompleteProps) {
    const [countries, setCountries] = useState<LocaleItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Cast seguro: asumimos que el JSON tiene la forma RawLocale[]
        const raw = (rawLocales as unknown) as RawLocale[];

        // mapear
        const mapped = raw
            .map((r) => mapRawToLocaleItem(r))
            // filtrar entries sin countryCode o sin countryName
            .filter((m) => m.countryCode && m.countryName);

        // dedupe por countryCode (por si hay varios locales por país)
        const unique = Array.from(
            new Map(mapped.map((it) => [it.countryCode, it])).values()
        );

        setCountries(unique);
        // simulamos pequeña carga para spinner si querés
        setTimeout(() => setLoading(false), 100); // o 0 si no querés delay
    }, []);

    return (
        <Autocomplete
            fullWidth
            disabled={onSubmitting}
            options={countries}
            getOptionLabel={(option) => `${option.countryName} ${option.currencyCode ? `(${option.currencyCode})` : ''}`}
            loading={loading}
            noOptionsText="No se encontraron países."
            onChange={(event, value) => {
                onHandleChange(value ?? null);
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
                            {option.flag ?? getFlagEmoji(option.countryCode)} {option.countryName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {option.languageCode ? `🌐 ${option.languageCode} · ` : ''}
                            {option.currencyCode ? `💱 ${option.currencyCode}` : option.currencyName ?? ''}
                        </Typography>
                    </Box>
                );
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="País"
                    placeholder="Seleccionar país..."
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
    );
}
