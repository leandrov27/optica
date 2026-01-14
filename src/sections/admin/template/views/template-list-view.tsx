'use client';

// react
import { useState } from 'react';
// @mui
import { Alert, Container, Link } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
// components
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
// types
import { type ITemplate } from 'src/core/schemas';
//
import TemplateListTable from '../components/template-list-table';
import ax, { API_ENDPOINTS } from 'src/libs/fetcher';
import { toast } from 'sonner';

// ----------------------------------------------------------------------

interface TemplateListViewProps {
  templatesData: Pick<ITemplate, 'data'>;
}

// ----------------------------------------------------------------------

export default function TemplateListView({ templatesData }: TemplateListViewProps) {
  const settings = useSettingsContext();
  const router = useRouter();

  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSync = async () => {
    setSyncing(true);
    setError(null);

    try {
      const resp = await ax.put(API_ENDPOINTS.admin.template.sync);
      router.refresh();
      toast.success(resp.data.message);
    } catch (e: any) {
      setError(e?.message || 'Error inesperado.');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Lista de Plantillas de WhatsApp"
        links={[
          {
            name: 'Tablero de Ventas',
            href: paths.admin.root,
          },
          { name: 'Plantillas de WhatsApp' },
        ]}
        action={
          <LoadingButton
            sx={{ minWidth: 20 }}
            variant="contained"
            loading={syncing}
            onClick={handleSync}
          >
            <Iconify icon="material-symbols:sync-rounded" />
            Sincronizar Plantillas
          </LoadingButton>
        }
        sx={{
          mb: { xs: 2, md: 2 },
        }}
      />

      <Alert severity="info" variant="outlined" sx={{ mb: 2 }}>
        Las plantillas pueden tardar hasta <strong>24 horas</strong> en ser aprobadas por{' '}
        <strong>Meta</strong>. Si necesitas realizar cambios, edítalas directamente en la consola de
        Meta y recuerda
        <strong> sincronizar tus plantillas</strong> sólo cuando sean aprobadas.&nbsp;
        <Link
          href="https://developers.facebook.com/apps"
          target="_blank"
          rel="noopener noreferrer"
          underline="always"
        >
          Ir a la plataforma de Meta
        </Link>
      </Alert>

      <TemplateListTable templatesData={templatesData} />
    </Container>
  );
}
