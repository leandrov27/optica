import 'react-international-phone/style.css';

import {
  BaseTextFieldProps,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import {
  CountryIso2,
  defaultCountries,
  FlagImage,
  parseCountry,
  usePhoneInput,
} from 'react-international-phone';

export interface MUIPhoneProps extends BaseTextFieldProps {
  value: string;
  onChange: (phone: string) => void;
  defaultFlag?: CountryIso2;
}

const MuiPhone: React.FC<MUIPhoneProps> = ({ value, onChange, defaultFlag = 'mx', ...restProps }) => {
  const {
    inputValue,
    handlePhoneValueChange,
    inputRef,
    country,
    setCountry,
  } = usePhoneInput({
    defaultCountry: defaultFlag,
    value,
    countries: defaultCountries,
    forceDialCode: true,
    onChange: (data) => {
      onChange(data.phone);
    },
  });

  return (
    <TextField
      variant="outlined"
      label="Nro. de Teléfono"
      color="primary"
      placeholder="Phone number"
      value={inputValue}
      onChange={handlePhoneValueChange}
      type="tel"
      inputRef={inputRef}
      InputProps={{
        startAdornment: (
          <InputAdornment
            position="start"
            style={{ marginRight: '2px', marginLeft: '-8px' }}
          >
            <Select
              value={country.iso2}
              onChange={(e) => setCountry(e.target.value as CountryIso2)}
              renderValue={(value) => (
                <FlagImage iso2={value} style={{ display: 'flex' }} />
              )}
              MenuProps={{
                style: {
                  height: '300px',
                  width: '360px',
                  top: '10px',
                  left: '-34px',
                },
              }}
              sx={{
                width: 'max-content',
                fieldset: { display: 'none' },
                '&.Mui-focused:has(div[aria-expanded="false"])': {
                  fieldset: { display: 'block' },
                },
                '.MuiSelect-select': {
                  padding: '8px',
                  paddingRight: '24px !important',
                },
                svg: {
                  right: 0,
                },
              }}
            >
              {defaultCountries.map((c) => {
                const countryData = parseCountry(c);
                return (
                  <MenuItem key={countryData.iso2} value={countryData.iso2}>
                    <FlagImage iso2={countryData.iso2} style={{ marginRight: '8px' }} />
                    <Typography marginRight="8px">{countryData.name}</Typography>
                    <Typography color="gray">+{countryData.dialCode}</Typography>
                  </MenuItem>
                );
              })}
            </Select>
          </InputAdornment>
        ),
      }}
      {...restProps}
    />
  );
};

export default MuiPhone;