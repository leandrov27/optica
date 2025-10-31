// sections
import { UserEditProfileView } from "src/sections/admin/user/views";

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Mi Perfil',
};

export default async function UserProfilePage() {
  return <UserEditProfileView />;
}
