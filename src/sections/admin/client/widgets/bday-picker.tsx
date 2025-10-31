// @mui
import { MobileDatePicker } from "@mui/x-date-pickers";
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
                <MobileDatePicker
                    label="Fecha de Nacimiento"
                    format={field.value ? "dddd DD [de] MMMM [de] YYYY" : ""}
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
