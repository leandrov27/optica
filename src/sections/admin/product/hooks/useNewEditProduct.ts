'use client';

// react
import { useCallback, useEffect, useMemo, useState } from 'react';
// components
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
// routes
import { useRouter } from 'src/routes/hook';
// schemas
import {
    CreateProductSchema,
    UpdateProductSchema,
    type ICreateProductPayload,
    type IUpdateProductPayload,
    type IProductData,
} from 'src/core/schemas';
// libs
import ax, { API_ENDPOINTS } from 'src/libs/fetcher';
// pkgs
import { toast } from 'sonner';

// ----------------------------------------------------------------------

interface useNewEditProductProps {
    product?: IProductData;
}

// ----------------------------------------------------------------------

export default function useNewEditProduct({ product }: useNewEditProductProps) {
    const router = useRouter();
    const isEdit = !!product;
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    const defaultValues = useMemo<ICreateProductPayload | IUpdateProductPayload>(
        () => ({
            categoryId: product?.category.id || 0,
            code: product?.code || '',
            description: product?.description || '',
            price: Number(product?.price) || 0,
            notes: product?.notes || '',
        }),
        [product]
    );

    useEffect(() => {
        if (product) {
            setValue('categoryId', product.category.id);
            setValue('code', product.code);
            setValue('description', product.description);
            setValue('price', Number(product.price));
            setValue('notes', product.notes);
        } else {
            setValue('categoryId', 0);
            setValue('code', '');
            setValue('description', '');
            setValue('price', 0);
            setValue('notes', '');
        }
    }, [product]);

    const methods = useForm({
        resolver: zodResolver(isEdit ? UpdateProductSchema : CreateProductSchema),
        defaultValues,
    });

    const {
        reset,
        control,
        setValue,
        clearErrors,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = useCallback(async (formValues: ICreateProductPayload | IUpdateProductPayload) => {
        try {
            if (isEdit) {
                const resp = await ax.put(API_ENDPOINTS.admin.product.update(product.id), formValues);
                toast.success(resp.data.message);
            } else {
                const resp = await ax.post(API_ENDPOINTS.admin.product.create, formValues);
                toast.success(resp.data.message);
            }

            setIsSuccess(true);
            reset();
            router.refresh();
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.message);
        }
    }, [product, reset, isEdit, router]);

    const handleCancel = useCallback(() => {
        clearErrors();
        reset(defaultValues);
    }, [clearErrors, reset, defaultValues]);

    const resetSuccess = useCallback(() => {
        setIsSuccess(false);
    }, []);

    return {
        //^ states
        isEdit,
        isSuccess,
        //* hookform
        control,
        methods,
        isSubmitting,
        handleSubmit,
        //& methods
        handleCancel,
        resetSuccess,
        onSubmit,
    }
}
