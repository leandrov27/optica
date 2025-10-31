'use client';

// react
import { useState } from "react";
// hooks
import { useBoolean } from "src/hooks/use-boolean";
// routes
import { useRouter, useSearchParams } from "src/routes/hook";
// libs
import ax, { API_ENDPOINTS } from "src/libs/fetcher";
// pkgs
import { toast } from "sonner";

// ----------------------------------------------------------------------

interface useDeleteClientProps {
    itemsInPage: number;
}

// ----------------------------------------------------------------------

export default function useDeleteClient({ itemsInPage }: useDeleteClientProps) {
    const confirm = useBoolean();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const handleDeleteClient = async (id: number) => {
        setIsDeleting(true);
        try {
            const resp = await ax.delete(API_ENDPOINTS.admin.client.delete(id));
            toast.success(resp.data.message);

            // Obtener la página actual de los parámetros de búsqueda
            const currentPage = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;

            // Si era el único registro en la página actual Y no estamos en la página 1
            if (itemsInPage === 1 && currentPage > 1) {
                // Redireccionar a la página anterior
                const newPage = currentPage - 1;

                // Crear nuevos parámetros de búsqueda sin la página actual
                const newSearchParams = new URLSearchParams(searchParams.toString());
                newSearchParams.set('page', newPage.toString());

                // Redireccionar manteniendo otros parámetros de búsqueda
                router.replace(`?${newSearchParams.toString()}`);

                toast.success(`Cliente #${id} eliminado exitosamente. Redirigiendo a página ${newPage}`);
            } else {
                // Si no es necesario cambiar de página, solo refrescar
                router.refresh();
                toast.success(`Cliente #${id} eliminado exitosamente`);
            }

            router.refresh();
            toast.success(`Cliente #${id} eliminado exitosamente`)
        } catch (error) {
            toast.error(error.message);
            console.error('Error al eliminar cliente:', error);
            throw error;
        } finally {
            setIsDeleting(false);
            confirm.onFalse();
        }
    };

    return {
        confirm,
        isDeleting,
        handleDeleteClient
    }
}
