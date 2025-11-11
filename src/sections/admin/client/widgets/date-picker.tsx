// @mui
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers";
// components
import { Controller } from "react-hook-form";
// libs
import { dayjs } from "src/libs/dayjs";

// ----------------------------------------------------------------------

interface DatePickerProps {
    control: any;
    onSubmitting: boolean;
}

// ----------------------------------------------------------------------

export default function DatePicker({ control, onSubmitting }: DatePickerProps) {
    return (
        <Controller
            name="date"
            control={control}
            render={({ field }) => (
                <MuiDatePicker
                    label="Fecha"
                    minDate={dayjs().startOf("year")}
                    maxDate={dayjs().endOf("year")}
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(newValue) => {
                        if (newValue?.isValid()) {
                            field.onChange(newValue.format("YYYY-MM-DD"));
                        }
                    }}
                    disabled={onSubmitting}
                    sx={{
                        width: '100%'
                    }}
                />
            )}
        />
    );
}
