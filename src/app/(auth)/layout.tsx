'use client';

// auth
import { GuestGuard } from 'src/core/auth/guard';
// components
import Compact from 'src/layouts/compact';

// ----------------------------------------------------------------------

// 10249532762 id recarga 20.000



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
