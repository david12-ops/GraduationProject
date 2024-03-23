import { Button, CardActions, styled } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import * as React from 'react';

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

const UpdateButton = styled(Button)({
  backgroundColor: '#5362FC',
  color: 'white',
  padding: '10px 15px',
});

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
      <Typography
        component={'p'}
        style={{ marginTop: '8px', marginBottom: '8px' }}
      >
        Zásilku je nutné <strong>zabalit do krabice</strong>
      </Typography>
    ) : (
      <Typography
        component={'p'}
        style={{ marginTop: '8px', marginBottom: '8px' }}
      >
        Zásilku není nutné <strong>zabalit do krabice</strong>
      </Typography>
    );

  const paragraph2 =
    folie === 'Yes' ? (
      <Typography
        component={'p'}
        style={{ marginTop: '8px', marginBottom: '8px' }}
      >
        Může být zabaleno ve <strong>fólii</strong>
      </Typography>
    ) : (
      <Typography
        component={'p'}
        style={{ marginTop: '8px', marginBottom: '8px' }}
      >
        Nesmí být zabaleno ve <strong>fólii</strong>
      </Typography>
    );

  const paragraph3 =
    shippingLabel === 'Yes' ? (
      <Typography
        component={'p'}
        style={{ marginTop: '8px', marginBottom: '8px' }}
      >
        Přepravní štítek kurýr <strong>přiveze</strong>
      </Typography>
    ) : (
      <Typography
        component={'p'}
        style={{ marginTop: '8px', marginBottom: '8px' }}
      >
        Přepravní štítek kurýr <strong>nepřiveze</strong>
      </Typography>
    );

  const paragraph4 =
    sendCash === 'Yes' ? (
      <Typography
        component={'p'}
        style={{ marginTop: '8px', marginBottom: '8px' }}
      >
        Možnost zaslání <strong>na dobírku</strong>
      </Typography>
    ) : (
      <Typography
        component={'p'}
        style={{ marginTop: '8px', marginBottom: '8px' }}
      >
        Zaslání <strong>na dobírku</strong> není možné
      </Typography>
    );

  return (
    <Typography component={'div'} style={{ margin: '10px' }}>
      <Typography
        component={'p'}
        style={{ marginTop: '8px', marginBottom: '8px' }}
      >
        Vyzvednutí nejdříve <strong>{pickUp}</strong>
      </Typography>
      <Typography
        component={'p'}
        style={{ marginTop: '8px', marginBottom: '8px' }}
      >
        Doručení nejdřive <strong>{delivery}</strong>
      </Typography>
      {paragraph}
      {paragraph2}
      {paragraph3}
      <Typography
        component={'p'}
        style={{ marginTop: '8px', marginBottom: '8px' }}
      >
        Pojištění <strong> do {insurance} Kč v ceně</strong>
      </Typography>
      {paragraph4}
    </Typography>
  );
};

export const AdmPageSuppCard: React.FC<Props> = ({
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
        backgroundColor: '#DDD8BD',
        margin: '20px',
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Typography
          sx={{ padding: '20px', fontSize: '30px', textAlign: 'center' }}
          gutterBottom
          variant="h4"
          component="h6"
        >
          <strong>{name}</strong>
        </Typography>
        {/* <CardMedia
          sx={{
            gridColumnStart: 2,
            width: '100',
            height: '50px',
            padding: '20px',
          }}
          image="/static/images/cards/contemplative-reptile.jpg"
        /> */}
        <Typography
          component={'div'}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
          }}
        >
          <Typography
            sx={{
              fontSize: '22px',
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
            sx={{ fontSize: '16px' }}
            variant="body2"
            color="text.secondary"
          >
            <CardActions>
              <Link
                key="UpdateFromSupplier"
                href={`../../Forms/UpdateFromSupplier/${suppId}`}
              >
                <UpdateButton>Upravit</UpdateButton>
              </Link>
            </CardActions>
          </Typography>
        </Typography>
      </CardContent>
    </Card>
  );
};

// upravit opacity
