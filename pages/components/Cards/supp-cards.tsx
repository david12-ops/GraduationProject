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
  shippingLabel: string;
  insurance: number;
  sendCash: string;
  suppId: string;
};

const Paragraph = (
  pickUp: string,
  delivery: string,
  packInBox: string,
  folie: string,
  shippingLabel: string,
  insurance: number,
  sendCash: string,
) => {
  const paragraph =
    packInBox === 'Yes' ? (
      <Typography component={'p'} style={{ margin: '10px' }}>
        Zásilku je nutné <strong>zabalit do krabice</strong>
      </Typography>
    ) : (
      <Typography component={'p'} style={{ margin: '10px' }}>
        Zásilku není nutné <strong>zabalit do krabice</strong>
      </Typography>
    );

  const paragraph2 =
    folie === 'Yes' ? (
      <Typography component={'p'} style={{ margin: '10px' }}>
        Může být zabaleno ve <strong>fólii</strong>
      </Typography>
    ) : (
      <Typography component={'p'} style={{ margin: '10px' }}>
        Nesmí být zabaleno ve <strong>fólii</strong>
      </Typography>
    );

  const paragraph3 =
    shippingLabel === 'Yes' ? (
      <Typography component={'p'} style={{ margin: '10px' }}>
        Přepravní štítek kurýr <strong>přiveze</strong>
      </Typography>
    ) : (
      <Typography component={'p'} style={{ margin: '10px' }}>
        Přepravní štítek kurýr <strong>nepřiveze</strong>
      </Typography>
    );

  const paragraph4 =
    sendCash === 'Yes' ? (
      <Typography component={'p'} style={{ margin: '10px' }}>
        Možnost zaslání <strong>na dobírku</strong>
      </Typography>
    ) : (
      <Typography component={'p'} style={{ margin: '10px' }}>
        Zaslání <strong>na dobírku</strong> není možné
      </Typography>
    );

  return (
    <Typography component={'div'} style={{ margin: '10px' }}>
      <Typography component={'p'} style={{ margin: '10px' }}>
        Vyzvednutí nejdříve<strong>{pickUp}</strong>
      </Typography>
      <Typography component={'p'} style={{ margin: '10px' }}>
        Doručení nejdřive <strong>{delivery}</strong>
      </Typography>
      {paragraph}
      {paragraph2}
      {paragraph3}
      <Typography component={'p'} style={{ margin: '10px' }}>
        Pojištění <strong> do {insurance} Kč v ceně</strong>
      </Typography>
      {paragraph4}
    </Typography>
  );
};

export const DetailSupps: React.FC<Props> = ({
  name,
  pickUp,
  delivery,
  packInBox,
  folie,
  shippingLabel,
  insurance,
  sendCash,
  suppId,
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
          {Paragraph(
            pickUp,
            delivery,
            packInBox,
            folie,
            shippingLabel,
            insurance,
            sendCash,
          )}
        </Typography>
        <Typography
          sx={{ gridColumnStart: 3, padding: '20px', fontSize: '16px' }}
          variant="body2"
          color="text.secondary"
        >
          <CardActions style={{ justifyContent: 'center' }}>
            <Link key="packsCard" href={`/packsCard/${suppId}`}>
              <Button className={styles.crudbtnTable}>Balíčky</Button>
            </Link>
          </CardActions>
        </Typography>
      </CardContent>
    </Card>
  );
};

// 404 not found
