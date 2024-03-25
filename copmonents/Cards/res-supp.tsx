import { Alert, Button, CardActions, styled } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import * as React from 'react';

import {
  HistoryDataDocument,
  useAddHistoryToFirestoreMutation,
  useSuppDataQuery,
} from '@/generated/graphql';

import { useAuthContext } from '../auth-context-provider';
import { CustomDialog } from '../modal';

const CusotmBtn = styled(Button)({
  color: 'white',
  backgroundColor: '#5CA6EB',
});

const MyAlert = (message: string) => {
  return message.includes('uloženo') ? (
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
        Vyzvednutí nejdříve <strong>{pickUp}</strong>
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
  const { user } = useAuthContext();
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
    if (user) {
      const result = await mutation({
        variables: {
          Id: user.uid,
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
      SetAlert(MyAlert('Uživatel musí být přihlášen na svů účet'));
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
              Cena: {price}
            </Typography>
            <Typography component="p" style={{ textAlign: 'center' }}>
              Bez DPH : {price - Math.round((price / 100) * 21)}
            </Typography>

            <CardActions>
              {name === 'dpd' ? (
                <Link href="https://zrukydoruky.dpd.cz/">
                  <CusotmBtn>Objednat</CusotmBtn>
                </Link>
              ) : (
                <Link key="orderPage" href={`../../orderPage`}>
                  <CusotmBtn>Objedant</CusotmBtn>
                </Link>
              )}
              <CusotmBtn
                onClick={() => Save(dataFrPage, supplier, price, history)}
              >
                Uložit
              </CusotmBtn>
            </CardActions>
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};
