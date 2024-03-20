import { Alert, Button, CardActions, styled } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import * as React from 'react';

import { authUtils } from '@/firebase/auth-utils';
import {
  HistoryDataDocument,
  useAddHistoryToFirestoreMutation,
  useSuppDataQuery,
} from '@/generated/graphql';

import { CustomDialog } from '../modal';

const CusotmBtn = styled(Button)({
  color: 'white',
  backgroundColor: '#5CA6EB',
});

const MyAlert = (message: string) => {
  return message.includes('successful') ? (
    <Alert severity="success">{message}</Alert>
  ) : (
    <Alert severity="error">{message}</Alert>
  );
};

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
      <p style={{ margin: '10px' }}>
        The shipment must be packed <strong>in a box</strong>
      </p>
    ) : (
      <p style={{ margin: '10px' }}>
        Shipment does not need to be packed <strong>in a box</strong>
      </p>
    );

  const paragraph2 =
    folie === 'Yes' ? (
      <p style={{ margin: '10px' }}>
        Can be packaged in <strong>folie</strong>
      </p>
    ) : (
      <p style={{ margin: '10px' }}>
        Can not be packaged in <strong>folie</strong>
      </p>
    );

  const paragraph3 =
    shippingLabel === 'Yes' ? (
      <p style={{ margin: '10px' }}>
        Shipping label will be delivered by courier
      </p>
    ) : (
      <p style={{ margin: '10px' }}>
        The shipping label will not be delivered by courier
      </p>
    );

  const paragraph4 =
    sendCash === 'Yes' ? (
      <p style={{ margin: '10px' }}>
        Possibility to send <strong>cash on delivery</strong>
      </p>
    ) : (
      <p style={{ margin: '10px' }}>
        It is not possible to send <strong>cash on delivery</strong>
      </p>
    );

  return (
    <div style={{ margin: '10px' }}>
      <p style={{ margin: '10px' }}>
        Pick up first <strong>{pickUp}</strong>
      </p>
      <p style={{ margin: '10px' }}>
        Delivery first <strong>{delivery}</strong>
      </p>
      {paragraph}
      {paragraph2}
      {paragraph3}
      <p style={{ margin: '10px' }}>
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
  const [alert, SetAlert] = React.useState(<div></div>);
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
      // ?Alert
      const result = await mutation({
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
      if (result?.data?.AddHistory?.message) {
        SetAlert(MyAlert(result?.data?.AddHistory?.message));
      }
    } else {
      SetAlert(MyAlert('User must have account'));
    }
  };

  return (
    <Card
      sx={{
        backgroundColor: 'whitesmoke',
        margin: '20px',
        border: '5px solid #0E95EB',
      }}
    >
      <CardContent>
        <Typography
          sx={{ textAlign: 'center', fontSize: '30px' }}
          gutterBottom
          variant="h5"
          component="div"
        >
          <strong>{name}</strong>
        </Typography>
        {alert}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '35px',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ margin: 'auto' }}>
            <CustomDialog
              title={name}
              description={Paragraph(
                pickUp,
                delivery,
                packInBox,
                folie,
                shippingLabel,
                insurance,
                sendCash,
              )}
            />
          </div>

          <Typography
            sx={{ fontSize: '16px', margin: 'auto' }}
            variant="body2"
            color="text.secondary"
            component={'div'}
          >
            <Typography component="p" style={{ textAlign: 'center' }}>
              Price: {price}
            </Typography>
            <Typography component="p" style={{ textAlign: 'center' }}>
              Without DPH : {price - Math.round((price / 100) * 21)}
            </Typography>

            <CardActions>
              {name === 'dpd' ? (
                <Link href="https://zrukydoruky.dpd.cz/">
                  <CusotmBtn>Order</CusotmBtn>
                </Link>
              ) : (
                <Link key="orderPage" href={`../../orderPage`}>
                  <CusotmBtn>Order</CusotmBtn>
                </Link>
              )}
              <CusotmBtn
                onClick={() => Save(dataFrPage, supplier, price, history)}
              >
                Save
              </CusotmBtn>
            </CardActions>
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};
