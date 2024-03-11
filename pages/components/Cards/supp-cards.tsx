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
      <p>
        The shipment must be packed <strong>in a box</strong>
      </p>
    ) : (
      <p>
        Shipment does not need to be packed <strong>in a box</strong>
      </p>
    );

  const paragraph2 =
    folie === 'Yes' ? (
      <p>
        Can be packaged in <strong>folie</strong>
      </p>
    ) : (
      <p>
        Can not be packaged in <strong>folie</strong>
      </p>
    );

  const paragraph3 =
    shippingLabel === 'Yes' ? (
      <p> Shipping label will be delivered by courier</p>
    ) : (
      <p> The shipping label will not be delivered by courier</p>
    );

  const paragraph4 =
    sendCash === 'Yes' ? (
      <p>
        Possibility to send <strong>cash on delivery</strong>
      </p>
    ) : (
      <p>
        It is not possible to send <strong>cash on delivery</strong>
      </p>
    );

  return (
    <div>
      <p>
        Pick up first <strong>{pickUp}</strong>
      </p>
      <p>
        Delivery first <strong>{delivery}</strong>
      </p>
      {paragraph}
      {paragraph2}
      {paragraph3}
      <p>
        {insurance > 0
          ? `Insurance up to ${insurance} CZK included`
          : 'No insurance'}
      </p>
      {paragraph4}
    </div>
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
              <Button className={styles.crudbtnTable}>Packages</Button>
            </Link>
          </CardActions>
        </Typography>
      </CardContent>
    </Card>
  );
};

// 404 not found
