'use client';

// react
import { useCallback, useState } from 'react';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// routes
import { useRouter } from 'src/routes/hook';
// hookform
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// config
import { ADMIN_PATH_AFTER_LOGIN } from 'src/config/config-public';
// schemas
import { LoginSchema, type ILoginPayload } from 'src/core/schemas';
// utils
import { useAuthContext } from 'src/core/auth/hooks';

// ----------------------------------------------------------------------

export default function useLogin() {
    const password = useBoolean();
    const router = useRouter();
    const { login } = useAuthContext();

    const [errorMsg, setErrorMsg] = useState('');

    const defaultValues = {
        identity: '',
        password: '',
    };

    const methods = useForm<ILoginPayload>({
        resolver: zodResolver(LoginSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        control,
        setError,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = useCallback(
        async (data: ILoginPayload) => {
            try {
                const user = await login?.(data.identity, data.password);
                const role = user?.role;

                if (role === 'ADMIN') {
                    router.push(ADMIN_PATH_AFTER_LOGIN);
                }
            } catch (error) {
                console.error('Login error:', error);

                // Manejar diferentes tipos de errores de Supabase
                if (error.message?.includes('Invalid login credentials')) {
                    setErrorMsg('Credenciales inválidas. Por favor, verifica tu email y contraseña.');
                } else if (error.message?.includes('Email not confirmed')) {
                    setErrorMsg('Por favor, confirma tu email antes de iniciar sesión.');
                } else {
                    setErrorMsg(error.message || 'Error al iniciar sesión. Por favor, intenta nuevamente.');
                }

                reset();
            }
        },
        [login, reset]
    );

    return {
        //* state getters
        password,
        errorMsg,
        //& hookform
        handleSubmit,
        isSubmitting,
        control,
        setError,
        onSubmit,
        methods
    }
}
