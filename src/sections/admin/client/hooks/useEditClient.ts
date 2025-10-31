'use client';

// react
import { useCallback, useMemo, useEffect } from 'react';

// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
// components
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// schemas
import { CreateUpdateClientWithTaxInfoSchema, type ICreateUpdateClientWithTaxInfoPayload, type IClientData } from 'src/core/schemas';
import { type ICFDIUse, type IPaymentForm, type IPaymentMethod, type ITaxRegime } from 'src/core/schemas/sub-schemas';
// libs
import ax, { API_ENDPOINTS } from 'src/libs/fetcher';
// pckgs
import { toast } from 'sonner';

// ----------------------------------------------------------------------

interface useEditClientProps {
    client: IClientData;
}

// ----------------------------------------------------------------------

export default function useEditClient({ client }: useEditClientProps) {
    const router = useRouter();

    const defaultValues = useMemo<ICreateUpdateClientWithTaxInfoPayload>(
        () => ({
            enableTaxInfo: client.taxInfo && client.taxInfo.rfc !== '' ? true : false,
            //
            firstName: client?.firstName || '',
            lastName: client?.lastName || '',
            birthDate: client?.birthDate || '',
            email: client?.email || '',
            phone: client?.phone || '',
            type: client?.type || 'INDIVIDUAL',
            observations: client?.observations || '',
            taxInfo: {
                rfc: client?.taxInfo?.rfc || '',
                businessName: client.taxInfo?.businessName || '',
                billingEmail: client.taxInfo?.billingEmail || '',
                postalCode: client.taxInfo?.postalCode || '',
                taxRegime: client.taxInfo?.taxRegime as ITaxRegime || '601',
                cfdiUse: client.taxInfo?.cfdiUse as ICFDIUse || 'G01',
                paymentMethod: client.taxInfo?.paymentMethod as IPaymentMethod || 'PUE',
                paymentForm: client.taxInfo?.paymentForm as IPaymentForm || '01',
                address: client.taxInfo?.address || '',
            }
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [client]
    );

    const methods = useForm<ICreateUpdateClientWithTaxInfoPayload>({
        resolver: zodResolver(CreateUpdateClientWithTaxInfoSchema),
        defaultValues
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
            const resp = await ax.put(API_ENDPOINTS.admin.client.update(client.id), formValues);
            toast.success(resp.data.message);

            reset();
            router.refresh();
            router.replace(paths.admin.client.list);
        } catch (error: any) {
            toast.error(error.message);
        }
    }, [client, reset, router]);

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
