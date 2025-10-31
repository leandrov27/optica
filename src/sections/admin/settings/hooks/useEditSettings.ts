"use client";

// react
import { useCallback, useMemo } from "react";
// components
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
// routes
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
// libs
import ax, { API_ENDPOINTS } from "src/libs/fetcher";
// pkgs
import { toast } from "sonner";
// schemas
import { type ISettingsData, type IUpdateSettingsPayload, UpdateSettingsSchema } from "src/core/schemas";
// stores
import { useSettingsStore } from "src/core/stores";
import { fileToBase64 } from "src/utils/upload-vps";

// ----------------------------------------------------------------------

interface useEditSettingsProps {
    settings: ISettingsData;
}

// ----------------------------------------------------------------------

export default function useEditSettings({ settings }: useEditSettingsProps) {
    const router = useRouter();
    const setSettings = useSettingsStore((state) => state.setSettings);

    const defaultValues = useMemo<IUpdateSettingsPayload>(() => ({
        name: settings.name || '',
        phone: settings.phone || '',
        address: settings.address || '',
        localeCode: settings.localeCode || '',
        currencyCode: settings.currencyCode || '',
        currencySymbol: settings.currencySymbol || '',
        companyLogoUrl: settings.companyLogoUrl || null,
        businessLogoUrl: settings.businessLogoUrl || null,
    }), [settings]);

    const methods = useForm<IUpdateSettingsPayload>({
        resolver: zodResolver(UpdateSettingsSchema),
        defaultValues,
    });

    const {
        reset,
        control,
        handleSubmit,
        formState: { isSubmitting },
        watch,
        setValue,
    } = methods;

    const currentBusinessLogo = watch('businessLogoUrl');
    const currentCompanyLogo = watch('companyLogoUrl');

    const onSubmit = useCallback(async (formValues: IUpdateSettingsPayload) => {
        try {
            let businessLogoUrl = formValues.businessLogoUrl;
            if (businessLogoUrl instanceof File) {
                businessLogoUrl = await fileToBase64(businessLogoUrl);
            }

            let companyLogoUrl = formValues.companyLogoUrl;
            if (companyLogoUrl instanceof File) {
                companyLogoUrl = await fileToBase64(companyLogoUrl);
            }

            const resp = await ax.put(API_ENDPOINTS.admin.settings.update, {
                ...formValues,
                businessLogoUrl,
                companyLogoUrl,
            });

            // @ts-ignore
            setSettings(formValues);

            toast.success(resp.data.message);

            router.replace(paths.admin.root);
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || 'Error al procesar los ajustes');
        }
    }, [settings, reset, router]);

    const handleDropBusinessLogo = useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];

            const newFile = Object.assign(file, {
                preview: URL.createObjectURL(file),
            });

            if (file) {
                setValue('businessLogoUrl', newFile, { shouldValidate: true });
            }
        },
        [setValue]
    );

    const handleUndropBusinessLogo = useCallback(() => {
        // Lógica inteligente que detecta el contexto:
        if (currentBusinessLogo instanceof File) {
            // Si hay un archivo nuevo seleccionado, restaurar la imagen original
            setValue('businessLogoUrl', settings.businessLogoUrl ? settings.businessLogoUrl : null, {
                shouldValidate: true,
                shouldDirty: true
            });
        } else if (currentBusinessLogo) {
            // Si hay una imagen (string URL), quitarla completamente
            setValue('businessLogoUrl', null, { shouldValidate: true });
        }
        // Si no hay imagen, no hacer nada
    }, [setValue, currentBusinessLogo, settings.businessLogoUrl]);

    const handleDropCompanyLogo = useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];

            const newFile = Object.assign(file, {
                preview: URL.createObjectURL(file),
            });

            if (file) {
                setValue('companyLogoUrl', newFile, { shouldValidate: true });
            }
        },
        [setValue]
    );

    const handleUndropCompanyLogo = useCallback(() => {
        // Lógica inteligente que detecta el contexto:
        if (currentCompanyLogo instanceof File) {
            // Si hay un archivo nuevo seleccionado, restaurar la imagen original
            setValue('companyLogoUrl', settings.companyLogoUrl ? settings.companyLogoUrl : null, {
                shouldValidate: true,
                shouldDirty: true
            });
        } else if (currentBusinessLogo) {
            // Si hay una imagen (string URL), quitarla completamente
            setValue('companyLogoUrl', null, { shouldValidate: true });
        }
        // Si no hay imagen, no hacer nada
    }, [setValue, currentCompanyLogo, settings.companyLogoUrl]);

    return {
        //* hookform
        control,
        methods,
        isSubmitting,
        handleSubmit,
        //& methods
        handleDropBusinessLogo,
        handleUndropBusinessLogo,
        //
        handleDropCompanyLogo,
        handleUndropCompanyLogo,
        //
        onSubmit,
    }
}
