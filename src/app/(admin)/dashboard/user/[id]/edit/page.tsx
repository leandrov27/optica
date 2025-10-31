// sections
import { UserEditView } from "src/sections/admin/user/views";
// components
import ErrorCard from "src/components/error-card";
// libs
import db from "src/libs/prisma";
// types
import {
    type IUserData,
} from "src/core/schemas";

// ----------------------------------------------------------------------

export const metadata = {
    title: 'Modificar Usuario',
};

// ----------------------------------------------------------------------

async function getUserById(id: string): Promise<IUserData> {
    const userById = await db.user.findUnique({
        where: { id: Number(id) },
        select: {
            id: true,
            phone: true,
            document: true,
            firstName: true,
            lastName: true,
            displayName: true,
            status: true,
            role: true,
        },
    });

    if (!userById) {
        throw new Error('Usuario no encontrado.');
    }

    return userById;
}

// ----------------------------------------------------------------------

export default async function UserEditPage({ params }: { params: { id: string } }) {
    try {
        const user = await getUserById(params.id);

        return (
            <UserEditView user={user} />
        );
    } catch (error) {
        return (
            <ErrorCard
                message={error instanceof Error ? error.message : 'Error desconocido al cargar usuario'}
            />
        );
    }
}