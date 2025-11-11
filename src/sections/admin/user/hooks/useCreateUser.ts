'use client';

// react
import { useCallback } from 'react';

// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
// components
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// schemas
import { CreateUserSchema, type ICreateUserPayload } from 'src/core/schemas';
// libs
import ax, { API_ENDPOINTS } from 'src/libs/fetcher';
// pckgs
import { toast } from 'sonner';

// ----------------------------------------------------------------------

export default function useCreateUser() {
    const router = useRouter();
    const password = useBoolean();

    const methods = useForm<ICreateUserPayload>({
        resolver: zodResolver(CreateUserSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            phone: '',
            password: '',
            role: 'ADMIN'
        },
    });

    const {
        reset,
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = useCallback(async (formValues: ICreateUserPayload) => {
        try {
            const resp = await ax.post(API_ENDPOINTS.admin.user.create, formValues);
            toast.success(resp.data.message);

            reset();
            router.refresh();
            router.replace(paths.admin.user.list);
        } catch (err: any) {
            toast.error(err.message);
        }
    }, [reset, router]);

    return {
        //^ states
        password,
        //* hookform
        isSubmitting,
        handleSubmit,
        onSubmit,
        control,
        methods,
    }
}
