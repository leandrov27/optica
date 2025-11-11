// @mui
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers";
// components
import { Controller } from "react-hook-form";
import { type ICreateNotePayload } from "src/core/schemas";
// libs
import { dayjs } from "src/libs/dayjs";

// ----------------------------------------------------------------------

interface DatePickerProps {
    name: keyof Pick<ICreateNotePayload, 'deliveryDate'>;
    control: any;
    label: string
    onSubmitting: boolean;
}

// ----------------------------------------------------------------------

export default function DatePicker({ name, control, onSubmitting }: DatePickerProps) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <MuiDatePicker
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
