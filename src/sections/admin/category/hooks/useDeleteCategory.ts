'use client';

// react
import { useState } from "react";
// hooks
import { useBoolean } from "src/hooks/use-boolean";
// routes
import { useRouter, useSearchParams } from "src/routes/hook";
// libs
import ax, { API_ENDPOINTS } from 'src/libs/fetcher';
// pkgs
import { toast } from "sonner";

// ----------------------------------------------------------------------

interface useDeleteCategoryProps {
    itemsInPage: number;
}

// ----------------------------------------------------------------------

export default function useDeleteCategory({ itemsInPage }: useDeleteCategoryProps) {
    const confirm = useBoolean();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const handleDeleteCategory = async (id: number) => {
        setIsDeleting(true);
        try {
            const resp = await ax.delete(API_ENDPOINTS.admin.category.delete(id));

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

                toast.success(`Categoría #${id} eliminada exitosamente. Redirigiendo a página ${newPage}`);
            } else {
                // Si no es necesario cambiar de página, solo refrescar
                router.refresh();
                toast.success(`Categoría #${id} eliminada exitosamente`);
            }

            router.refresh();
            toast.success(resp.data.message);
        } catch (error) {
            console.error('Error al eliminar categoría:', error);
            toast.success(error.message);
            throw error;
        } finally {
            setIsDeleting(false);
            confirm.onFalse();
        }
    };

    return {
        confirm,
        isDeleting,
        handleDeleteCategory
    }
}
