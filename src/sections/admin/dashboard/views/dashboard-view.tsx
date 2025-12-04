'use client';

// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// components
import { useSettingsContext } from 'src/components/settings';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function DashboardView() {
    const settings = useSettingsContext();

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <Card sx={{ p: 3 }} style={{ textAlign: "center" }}>
                <Typography component="div" variant="h5" sx={{ mb: 2 }}>
                    ¡Hola, te damos la bienvenida!
                </Typography>

                <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />

                <Typography sx={{ pb: 3 }} variant="h2" color='text.secondary' component="div">
                    The <Typography variant="h2" component='span' color='primary.main'>RNPM</Typography> Stack
                </Typography>

                <Grid container justifyContent={'center'}>
                    <Grid xs={6} sm={2} md={2} sx={{ mb: 3 }}>
                        <Box sx={{ mx: 'auto', maxWidth: 280, textAlign: 'center' }}>

                            <Iconify icon={'bxl:react'} width={46} sx={{ color: 'primary.main' }} />

                            <Typography variant="subtitle1" gutterBottom>
                                React.js
                            </Typography>
                            <Typography variant='subtitle2' sx={{ color: 'text.secondary', mt: -1.5 }}>v18.2</Typography>
                        </Box>
                    </Grid>

                    <Grid xs={6} sm={2} md={2} sx={{ mb: 3 }}>
                        <Box sx={{ mx: 'auto', maxWidth: 280, textAlign: 'center' }}>

                            <Iconify icon={'teenyicons:nextjs-outline'} width={46} sx={{ color: 'primary.main' }} />

                            <Typography variant="subtitle1" gutterBottom>
                                Next.js
                            </Typography>
                            <Typography variant='subtitle2' sx={{ color: 'text.secondary', mt: -1.5 }}>v14</Typography>
                        </Box>
                    </Grid>

                    <Grid xs={6} sm={2} md={2} sx={{ mb: 3 }}>
                        <Box sx={{ mx: 'auto', maxWidth: 280, textAlign: 'center' }}>

                            <Iconify icon={'simple-icons:prisma'} width={46} sx={{ color: 'primary.main' }} />

                            <Typography variant="subtitle1" gutterBottom>
                                Prisma
                            </Typography>
                            <Typography variant='subtitle2' sx={{ color: 'text.secondary', mt: -1.5 }}>v7.1</Typography>
                        </Box>
                    </Grid>


                    <Grid xs={6} sm={2} md={2} sx={{ mb: 3 }}>
                        <Box sx={{ mx: 'auto', maxWidth: 280, textAlign: 'center' }}>

                            <Iconify icon={'devicon-plain:materialui'} width={46} sx={{ color: 'primary.main' }} />

                            <Typography variant="subtitle1" gutterBottom>
                                Material UI
                            </Typography>
                            <Typography variant='subtitle2' sx={{ color: 'text.secondary', mt: -1.5 }}>v5.15</Typography>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ mb: 3, borderStyle: 'dashed' }} />

                <Typography variant="subtitle2" color='text.secondary' component="div">
                    App: <Typography variant="subtitle2" component='span' color='primary.main'>v1.0</Typography>
                </Typography>
            </Card>
        </Container>
    )
}
