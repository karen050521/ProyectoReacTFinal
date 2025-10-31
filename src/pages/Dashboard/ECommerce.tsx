import CardFour from '../../components/CardFour.tsx';
import CardOne from '../../components/CardOne.tsx';
import CardThree from '../../components/CardThree.tsx';
import CardTwo from '../../components/CardTwo.tsx';
import ChartOne from '../../components/ChartOne.tsx';
import ChartThree from '../../components/ChartThree.tsx';
import ChartTwo from '../../components/ChartTwo.tsx';
import ChatCard from '../../components/ChatCard.tsx';
import MapOne from '../../components/MapOne.tsx';
import TableOne from '../../components/TableOne.tsx';
import { FirebaseStatus } from '../../components/Auth/FirebaseStatus.tsx';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { Home as HomeIcon, People as PeopleIcon } from '@mui/icons-material';

const ECommerce = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Firebase Status Card - Temporal para verificar configuración */}
      <div className="mb-4">
        <FirebaseStatus />
      </div>

      {/* Acceso Rápido a Direcciones - Material UI */}
      <div className="mb-4">
        <Card>
          <CardContent>
            <Typography variant="h6" component="h3" gutterBottom>
              Acceso Rápido
            </Typography>
            <Box display="flex" gap={2}>
              <Button
                variant="contained"
                startIcon={<HomeIcon />}
                onClick={() => navigate('/addresses')}
                color="primary"
              >
                Mi Dirección
              </Button>
              <Button
                variant="outlined"
                startIcon={<PeopleIcon />}
                onClick={() => navigate('/users')}
                color="secondary"
              >
                Usuarios
              </Button>
            </Box>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardOne />
        <CardTwo />
        <CardThree />
        <CardFour />
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartOne />
        <ChartTwo />
        <ChartThree />
        <MapOne />
        <div className="col-span-12 xl:col-span-8">
          <TableOne />
        </div>
        <ChatCard />
      </div>
    </>
  );
};

export default ECommerce;
