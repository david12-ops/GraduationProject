import { Button, CardActions, Link, styled } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import * as React from 'react';

import {
  HistoryDataDocument,
  SuppDataDocument,
  useDeletePacMutation,
} from '@/generated/graphql';

const DelButton = styled(Button)({
  backgroundColor: 'red',
  color: 'white',
  padding: '8px 13px',
});

const UpdateButton = styled(Button)({
  backgroundColor: '#5362FC',
  color: 'white',
  padding: '8px 13px',
});

type Props = {
  Heiht: number;
  Weight: number;
  Width: number;
  Length: number;
  Name: string;
  Cost: number;
  keyPac: string;
  sId: string;
};

export const PackCard: React.FC<Props> = ({
  Heiht,
  Weight,
  Width,
  Length,
  Name,
  Cost,
  keyPac,
  sId,
}) => {
  const [del] = useDeletePacMutation();
  const Del = async (key: string, suppId: string) => {
    const deleted = await del({
      variables: {
        Id: suppId,
        Key: key,
      },
      refetchQueries: [
        { query: SuppDataDocument },
        { query: HistoryDataDocument },
      ],
      awaitRefetchQueries: true,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    }).catch((error: string) => console.error('Chyba při mazání'));

    if (!deleted?.data?.deletePack?.deletion) {
      console.error(deleted?.data?.deletePack?.error);
    }
  };
  return (
    <Card>
      <CardMedia
        component="img"
        alt={Name}
        height="140"
        image="/nettes-karikaturbeitragspaketgekritzel-geschenk-shop-logo-grafiksymbol-fuer-medienmarkierungen_44769-1534.webp"
      />
      <CardContent>
        <Typography
          sx={{ textAlign: 'center' }}
          gutterBottom
          variant="h5"
          component="div"
        >
          {Name}
        </Typography>

        <Typography
          sx={{ textAlign: 'center', borderBottom: 'solid' }}
          gutterBottom
          variant="h6"
          component="div"
        >
          Parametry
        </Typography>

        <Typography
          sx={{ textAlign: 'center' }}
          sx-gutterbottom="true"
          variant="body1"
          component="div"
        >
          Výška: {Heiht} cm
        </Typography>

        <Typography
          sx={{ textAlign: 'center' }}
          sx-gutterbottom="true"
          variant="body1"
          component="div"
        >
          Šířka: {Width} cm
        </Typography>

        <Typography
          sx={{ textAlign: 'center' }}
          sx-gutterbottom="true"
          variant="body1"
          component="div"
        >
          Délka: {Length} cm
        </Typography>

        <Typography
          sx={{ textAlign: 'center' }}
          sx-gutterbottom="true"
          variant="body1"
          component="div"
        >
          Hmotnost: {Weight} Kg
        </Typography>

        <Typography
          sx={{ textAlign: 'center', borderBottom: 'solid' }}
          gutterBottom
          variant="h6"
          component="div"
        >
          Cena
        </Typography>

        <Typography
          sx={{ textAlign: 'center' }}
          sx-gutterbottom="true"
          variant="body1"
          component="div"
        >
          {Cost} Kč
        </Typography>
      </CardContent>
      <CardActions
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <DelButton onClick={() => Del(keyPac, sId)}>Smazat</DelButton>
        </div>
        <div>
          <Link
            key="UpdateFormPackage"
            href={`../../Forms/UpdateFormPackage/${keyPac}`}
          >
            <UpdateButton>Upravit</UpdateButton>
          </Link>
        </div>
      </CardActions>
    </Card>
  );
};
