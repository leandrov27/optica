'use client';

// react
import { useCallback, useEffect } from 'react';

// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
// components
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// schemas
import { CreateUpdateClientWithTaxInfoSchema, type ICreateUpdateClientWithTaxInfoPayload } from 'src/core/schemas';
// libs
import ax, { API_ENDPOINTS } from 'src/libs/fetcher';
// pckgs
import { toast } from 'sonner';

// ----------------------------------------------------------------------

export default function useCreateClient() {
    const router = useRouter();

    const methods = useForm({
        resolver: zodResolver(CreateUpdateClientWithTaxInfoSchema),
        defaultValues: {
            enableTaxInfo: false,
            //
            firstName: '',
            lastName: '',
            birthDate: '',
            email: '',
            phone: '',
            type: 'INDIVIDUAL',
            observations: '',
            taxInfo: {
                rfc: '',
                businessName: '',
                billingEmail: '',
                postalCode: '',
                taxRegime: '601',
                cfdiUse: 'G01',
                paymentMethod: 'PUE',
                paymentForm: '01',
                address: ''
            }
        },
    });

    const {
        reset,
        control,
        handleSubmit,
        watch,
        resetField,
        formState: { isSubmitting },
    } = methods;

    const isTaxInfoEnabled = watch('enableTaxInfo');

    const onSubmit = useCallback(async (formValues: ICreateUpdateClientWithTaxInfoPayload) => {
        try {
            const resp = await ax.post(API_ENDPOINTS.admin.client.create, formValues);
            toast.success(resp.data.message);

            reset();
            router.refresh();
            router.replace(paths.admin.client.list);
        } catch (error: any) {
            toast.error(error.message);
        }
    }, [reset, router]);

    useEffect(() => {
        if (!isTaxInfoEnabled) {
            handleResetTaxInfoData();
        }
    }, [isTaxInfoEnabled]);

    const handleResetTaxInfoData = () => {
        resetField("taxInfo.rfc");
        resetField("taxInfo.businessName");
        resetField("taxInfo.taxRegime");
        resetField("taxInfo.cfdiUse");
        resetField("taxInfo.postalCode");
        resetField("taxInfo.billingEmail");
        resetField("taxInfo.paymentMethod");
        resetField("taxInfo.paymentForm");
        resetField("taxInfo.address");
    }

    return {
        //* hookform
        isTaxInfoEnabled,
        isSubmitting,
        handleSubmit,
        onSubmit,
        control,
        methods,
        // &
        handleResetTaxInfoData
    }
}
