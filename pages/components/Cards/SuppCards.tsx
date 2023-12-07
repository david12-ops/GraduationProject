// eslint-disable-next-line unicorn/filename-case
import { Button, Link } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import * as React from 'react';

import styles from '../../../styles/stylesForm/style.module.css';

type Props = {
  name: string;
  pickUp: string;
  delivery: string;
  packInBox: string;
  folie: string;
  avgPrice: number;
  shippingLabel: string;
  insurance: number;
  sendCash: string;
};

const Odstavec = (
  pickUp: string,
  delivery: string,
  packInBox: string,
  folie: string,
  shippingLabel: string,
  insurance: number,
  sendCash: string,
  FontSize: string,
) => {
  // FontSize ?
  const odstavec =
    packInBox === 'true' ? (
      <p style={{ fontSize: FontSize }}>
        Zásilku je nutné zabalit <strong>do krabice</strong>
      </p>
    ) : (
      <p>
        Zásilku je můžete zabalit <strong>do krabice</strong>
      </p>
    );

  const odstavec2 =
    folie === 'true' ? (
      <p>
        Může být zabaleno <strong>ve fólii</strong>
      </p>
    ) : (
      <p>
        Nesmí být zabaleno <strong>ve fólii</strong>
      </p>
    );

  const odstavec3 =
    shippingLabel === 'true' ? (
      <p> Přepravní štítek přiveze kurýr</p>
    ) : (
      <p> Přepravní štítek nepřiveze kurýr</p>
    );

  const odstavec4 =
    sendCash === 'true' ? (
      <p>
        Možnost poslat <strong>na dobírku</strong>
      </p>
    ) : (
      <p>
        Není Možnost poslat <strong>na dobírku</strong>
      </p>
    );

  return (
    <div>
      <p>
        Vyzvednutí nejdříve <strong>{pickUp}</strong>
      </p>
      <p>
        Doručení nejdříve <strong>{delivery}</strong>
      </p>
      {odstavec}
      {odstavec2}
      {odstavec3}
      <p>
        Pojištění <strong>do {insurance} Kč v ceně</strong>
      </p>
      {odstavec4}
    </div>
  );
};

export const MediaCard: React.FC<Props> = ({
  name,
  pickUp,
  delivery,
  packInBox,
  folie,
  avgPrice,
  shippingLabel,
  insurance,
  sendCash,
}) => {
  return (
    <Card
      sx={{
        minWidth: 300,
        width: 750,
        maxHeight: 500,
        backgroundColor: '#DDD8BD',
        margin: '20px',
      }}
    >
      <CardContent
        sx={{
          display: 'grid',
          columnGap: '50px',
          gridTemplateColumns: 'repeat(3, 1fr)',
        }}
      >
        <Typography
          sx={{ gridColumnStart: 1, padding: '20px', fontSize: '30px' }}
          gutterBottom
          variant="h5"
          component="div"
        >
          <strong>{name}</strong>
        </Typography>
        <CardMedia
          sx={{
            gridColumnStart: 2,
            width: '100',
            height: '50px',
            padding: '20px',
          }}
          image="/static/images/cards/contemplative-reptile.jpg"
        />
        <Typography
          sx={{
            gridColumnStart: 1,
            gridColumnEnd: 3,
            padding: '20px',
            fontSize: '16px',
          }}
          variant="body2"
          color="text.secondary"
        >
          {Odstavec(
            pickUp,
            delivery,
            packInBox,
            folie,
            shippingLabel,
            insurance,
            sendCash,
            '20px',
          )}
        </Typography>
        <Typography
          sx={{ gridColumnStart: 3, padding: '20px', fontSize: '16px' }}
          variant="body2"
          color="text.secondary"
        >
          <div style={{ textAlign: 'center' }}>Avg price: {avgPrice}</div>
          <CardActions style={{ justifyContent: 'center' }}>
            <Link key="packsCard" href={`/packsCard/id_${name}`}>
              <Button className={styles.crudbtnTable}>Packages</Button>
            </Link>
          </CardActions>
        </Typography>
      </CardContent>
    </Card>
  );
};

// chybi link u button, mozne avg ceny
// 404 not found
