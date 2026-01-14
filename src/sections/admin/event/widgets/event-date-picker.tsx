'use client';

// @mui
import { DateField as MuiDatePicker } from '@mui/x-date-pickers';
// components
import { Controller } from 'react-hook-form';
// libs
import { dayjs } from 'src/libs/dayjs';

// ----------------------------------------------------------------------

interface EventDatePickerProps {
  control: any;
  onSubmitting: boolean;
}

// ----------------------------------------------------------------------

export default function EventDatePicker({ control, onSubmitting }: EventDatePickerProps) {
  return (
    <Controller
      name="eventDate"
      control={control}
      render={({ field, fieldState }) => (
        <MuiDatePicker
          label="Fecha de Ejecución"
          minDate={dayjs().startOf('year')}
          value={field.value ? dayjs(field.value).utc() : null}
          onChange={(newValue) => {
            field.onChange(newValue?.isValid() ? newValue.utc().toDate() : null);
          }}
          disabled={onSubmitting}
          sx={{
            width: '100%',
          }}
          slotProps={{
            textField: {
              error: !!fieldState.error,
              helperText: fieldState.error?.message,
              fullWidth: true,
            },
          }}
        />
      )}
    />
  );
}
