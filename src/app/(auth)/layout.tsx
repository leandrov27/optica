'use client';

// auth
import { GuestGuard } from 'src/core/auth/guard';
// components
import Compact from 'src/layouts/compact';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <GuestGuard>
      <Compact>{children}</Compact>
    </GuestGuard>
  );
}
