// @mui
import { MobileDatePicker } from "@mui/x-date-pickers";
// components
import { type Control, Controller } from "react-hook-form";
// schemas
import { type ICreateUpdateDiagnosisPayload } from "src/core/schemas";
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
                <MobileDatePicker
                    label="Fecha"
                    format={field.value ? "dddd DD [de] MMMM [de] YYYY" : ""}
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
