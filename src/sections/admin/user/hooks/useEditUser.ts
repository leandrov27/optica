'use client';

// react
import { useCallback, useMemo } from 'react';

// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
// components
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// schemas
import { UpdateUserSchema, type IUserData, type IUpdateUserPayload } from 'src/core/schemas';
// libs
import ax, { API_ENDPOINTS } from 'src/libs/fetcher';
// pckgs
import { toast } from 'sonner';

// ----------------------------------------------------------------------

interface useEditUserProps {
    user: IUserData;
}

// ----------------------------------------------------------------------

export default function useEditUser({ user }: useEditUserProps) {
    const router = useRouter();
    const password = useBoolean();

    const defaultValues = useMemo<IUpdateUserPayload>(
        () => ({
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            phone: user?.phone || '',
            role: 'ADMIN'
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [user]
    );


    const methods = useForm<IUpdateUserPayload>({
        resolver: zodResolver(UpdateUserSchema),
        defaultValues
    });

    const {
        reset,
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = useCallback(async (formValues: IUpdateUserPayload) => {
        try {
            const resp = await ax.put(API_ENDPOINTS.admin.user.update(user.id), formValues);
            toast.success(resp.data.message);

            reset();
            router.refresh();
            router.replace(paths.admin.user.list);
        } catch (err: any) {
            toast.error(err.message);
        }
    }, [user, reset, router]);

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
