'use client';

// react
import { useCallback, useState } from 'react';
// routes
import { useRouter } from 'src/routes/hook';
// components
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// schemas
import {
    CreatePaymentSchema,
    type IPaymentForm,
    type ICreatePaymentPayload,
} from 'src/core/schemas';
// libs
import ax, { API_ENDPOINTS } from 'src/libs/fetcher';
// pckgs
import { toast } from 'sonner';

// ----------------------------------------------------------------------

interface useCreatePaymentProps {
    noteId: number;
    maxAmount: number;
    onSuccess?: () => void;
    onClose?: () => void;
}

// ----------------------------------------------------------------------

export default function useCreatePayment({
    noteId,
    maxAmount,
    onSuccess,
    onClose
}: useCreatePaymentProps) {
    const router = useRouter();

    const methods = useForm({
        resolver: zodResolver(CreatePaymentSchema),
        defaultValues: {
            noteId: noteId,
            amount: 0,
            notes: '',
            reference: '',
            paymentMethod: '01' as IPaymentForm,
        },
    });

    const {
        reset,
        control,
        handleSubmit,
        formState: { isSubmitting }
    } = methods;

    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    // ----------------------------------------------------------------------

    const sendForm = useCallback(async (formValues: ICreatePaymentPayload) => {
        try {
            // Validación adicional del monto
            if (formValues.amount <= 0) {
                toast.error('El monto debe ser mayor a 0');
                return;
            }

            // Redondear a 2 decimales antes de comparar
            const roundedAmount = Math.round(formValues.amount * 100) / 100;
            const roundedMaxAmount = Math.round(maxAmount * 100) / 100;

            if (roundedAmount > roundedMaxAmount) {
                toast.error(`El monto no puede exceder $${maxAmount.toFixed(2)}`);
                return;
            }

            const payload = {
                ...formValues,
                amount: roundedAmount
            };

            const resp = await ax.post(API_ENDPOINTS.admin.payment.create, payload);
            toast.success(resp.data.message);

            setIsSuccess(true);

            // Resetear formulario
            reset({
                noteId: 0,
                amount: maxAmount > 0 ? maxAmount : 0,
                notes: '',
                reference: '',
                paymentMethod: '01',
            });

            router.refresh();

            // Llamar callbacks de éxito
            if (onSuccess) {
                onSuccess();
            }

            if (onClose) {
                onClose();
            }

        } catch (error: any) {
            console.error('Error al registrar pago:', error);

            // Mostrar mensaje de error específico de la API
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error(error.message || 'Error al registrar el pago');
            }
        }
    }, [reset, router, noteId, maxAmount, onSuccess, onClose]);

    return {
        //~
        isSubmitting,
        handleSubmit,
        isSuccess,
        sendForm,
        methods,
        control,
    }
}
