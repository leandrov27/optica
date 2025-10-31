// config
import { VPS_URL } from "src/config/config-public";

// ----------------------------------------------------------------------

export const fileToBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

// ----------------------------------------------------------------------

export async function handleImageVPS(fotoValue: string | null | undefined, oldFotoUrl?: string | null): Promise<string | null> {
    // Helper para eliminar imagen anterior del VPS
    const deleteOldImageFromVPS = async (url: string) => {
        try {
            if (url.includes("/uploads/")) {
                const fileName = url.split("/uploads/")[1];
                console.log(`🗑️ Eliminando imagen anterior: ${fileName}`);

                // Llamar al endpoint de eliminación en tu servidor Fastify
                const deleteResponse = await fetch(`${VPS_URL}/delete/${fileName}`, {
                    method: 'DELETE',
                });

                if (deleteResponse.ok) {
                    console.log(`✅ Imagen anterior eliminada: ${fileName}`);
                } else {
                    console.warn(`⚠️ No se pudo eliminar imagen anterior: ${fileName}`);
                }
            }
        } catch (error) {
            console.warn('⚠️ Error al eliminar imagen anterior:', error);
        }
    };

    // 1) Eliminar imagen explícitamente (frontend envía null)
    if (fotoValue === null) {
        if (oldFotoUrl) {
            await deleteOldImageFromVPS(oldFotoUrl);
        }
        return null;
    }

    // 2) Nueva imagen en base64 - SUBIR NUEVA Y ELIMINAR ANTIGUA
    if (typeof fotoValue === "string" && fotoValue.startsWith("data:")) {
        // Primero eliminar la imagen anterior si existe
        if (oldFotoUrl) {
            await deleteOldImageFromVPS(oldFotoUrl);
        }

        try {
            // Subir nueva imagen
            const response = await fetch(`${VPS_URL}/upload`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fotoBase64: fotoValue
                }),
            });

            if (!response.ok) {
                throw new Error(`Error subiendo imagen al VPS: ${response.statusText}`);
            }

            const data = await response.json();
            console.log(`✅ Nueva imagen subida al VPS: ${data.url}`);
            return data.url;

        } catch (error: any) {
            console.error('❌ Error en handleImageVPS:', error);
            throw new Error('No se pudo subir la imagen al servidor');
        }
    }

    // 3) Mantener imagen existente (URL) - NO hacer nada
    if (typeof fotoValue === "string" && !fotoValue.startsWith("data:")) {
        console.log(`🔄 Manteniendo imagen existente: ${fotoValue}`);
        return fotoValue;
    }

    // 4) No hay cambio: devolver oldFotoUrl
    return oldFotoUrl ?? null;
}