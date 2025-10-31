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
    CreateCategorySchema,
    UpdateCategorySchema,
    type ICreateCategoryPayload,
    type IUpdateCategoryPayload,
    type ICategoryData,
} from 'src/core/schemas';
// libs
import ax, { API_ENDPOINTS } from 'src/libs/fetcher';
// pkgs
import { toast } from 'sonner';

// ----------------------------------------------------------------------

interface useNewEditCategoryProps {
    category?: ICategoryData;
}

// ----------------------------------------------------------------------

export default function useNewEditCategory({ category }: useNewEditCategoryProps) {
    const router = useRouter();
    const isEdit = !!category;
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    const defaultValues = useMemo<ICreateCategoryPayload | IUpdateCategoryPayload>(
        () => ({
            name: category?.name || '',
            icon: category?.icon || '',
        }),
        [category]
    );

    useEffect(() => {
        if (category) {
            setValue('name', category.name);
            setValue('icon', category.icon);
        } else {
            setValue('name', '');
            setValue('icon', '');
        }
    }, [category]);

    const methods = useForm({
        resolver: zodResolver(isEdit ? UpdateCategorySchema : CreateCategorySchema),
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

    const onSubmit = useCallback(async (formValues: ICreateCategoryPayload | IUpdateCategoryPayload) => {
        try {
            if (isEdit) {
                const resp = await ax.put(API_ENDPOINTS.admin.category.update(category.id), formValues);
                toast.success(resp.data.message);
            } else {
                const resp = await ax.post(API_ENDPOINTS.admin.category.create, formValues);
                toast.success(resp.data.message);
            }

            setIsSuccess(true);
            reset();
            router.refresh();
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.message);
        }
    }, [category, reset, isEdit, router]);

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
