// @mui
import { DatePicker } from "@mui/x-date-pickers";
// components
import { Controller } from "react-hook-form";
// libs
import { dayjs } from "src/libs/dayjs";

// ----------------------------------------------------------------------

interface BirthtdatePickerProps {
    control: any;
    onSubmitting: boolean;
}

// ----------------------------------------------------------------------

export default function BirthtdatePicker({ control, onSubmitting }: BirthtdatePickerProps) {
    return (
        <Controller
            name="birthDate"
            control={control}
            render={({ field }) => (
                <DatePicker
                    label="Fecha de Nacimiento"
                    maxDate={dayjs().startOf("day")}
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
