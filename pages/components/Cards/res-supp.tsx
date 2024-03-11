import { Button } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import * as React from 'react';

import { authUtils } from '@/firebase/auth-utils';
import {
  HistoryDataDocument,
  useAddHistoryToFirestoreMutation,
  useSuppDataQuery,
} from '@/generated/graphql';

import styles from '../../../styles/stylesForm/style.module.css';

type Props = {
  name: string;
  pickUp: string;
  delivery: string;
  packInBox: string;
  folie: string;
  price: number;
  shippingLabel: string;
  insurance: number;
  sendCash: string;
  dataFrPage: object;
  sId: string;
  packName: string;
};

type Supplier =
  | {
      __typename?: 'QuerySuppD' | undefined;
      sendCashDelivery: string;
      packInBox: string;
      supplierId: string;
      suppName: string;
      pickUp: string;
      delivery: string;
      insurance: number;
      shippingLabel: string;
      foil: string;
      package?: any | undefined;
      location?: any | undefined;
    }
  | undefined;

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
        Insurance <strong>up to {insurance} CZK included</strong>
      </p>
      {paragraph4}
    </div>
  );
};

export const ResSuppCard: React.FC<Props> = ({
  name,
  pickUp,
  delivery,
  packInBox,
  folie,
  price,
  shippingLabel,
  insurance,
  sendCash,
  dataFrPage,
  sId,
  packName,
}) => {
  const dataS = useSuppDataQuery();
  const [history] = useAddHistoryToFirestoreMutation();
  console.log(typeof history);
  const supplier = dataS.data?.suplierData.find((sup) => {
    return sup.supplierId === sId ? sup : null;
  });

  type MutationHistory = typeof history;

  const Save = async (
    data: object,
    suppData: Supplier,
    priceS: number,
    mutation: MutationHistory,
  ) => {
    const user = authUtils.getCurrentUser()?.uid;

    if (user) {
      await mutation({
        variables: {
          Id: user,
          Data: JSON.stringify({
            formData: data,
            data: { suppData, priceS, packName },
          }),
        },
        refetchQueries: [{ query: HistoryDataDocument }],
        awaitRefetchQueries: true,
      }).catch((error: string) => console.error(error));
    }
  };

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
          <div style={{ textAlign: 'center' }}>Price: {price}</div>
          <CardActions style={{ justifyContent: 'center' }}>
            {name === 'dpd' ? (
              <Link href="https://zrukydoruky.dpd.cz/">
                <Button className={styles.crudbtnTable}>Order</Button>
              </Link>
            ) : (
              <Link key="orderPage" href={`../../orderPage`}>
                <Button className={styles.crudbtnTable}>Order</Button>
              </Link>
            )}
            <Button
              onClick={() => Save(dataFrPage, supplier, price, history)}
              className={styles.crudbtnTable}
            >
              Save
            </Button>
          </CardActions>
        </Typography>
      </CardContent>
    </Card>
  );
};
