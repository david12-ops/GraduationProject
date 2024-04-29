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
  switch (message) {
    case 'Bylo už uloženo do historie': {
      return <Alert severity="error">{message}</Alert>;
    }
    case 'Uživatel musí být přihlášen na svů účet': {
      return <Alert severity="error">{message}</Alert>;
    }
    case 'Při ukládání došlo k chybě, zkuste to znovu později': {
      return <Alert severity="error">{message}</Alert>;
    }

    case 'Tuto funkci může používat pouze přihlášený uživatel': {
      return <Alert severity="error">{message}</Alert>;
    }
    case 'Úspěšně uloženo': {
      return <Alert severity="success">{message}</Alert>;
    }
    default: {
      return undefined;
    }
  }
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
        Doručení nejdříve <strong>{delivery}</strong>
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

const toDateInNumForm = (date: string) => {
  const newDate = new Date(date);
  return `${newDate.getDate()}-${newDate.getMonth()}-${newDate.getFullYear()}`;
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      }).catch((error: string) =>
        console.error('Chyba při ukládání do historie'),
      );
      if (result?.data?.AddHistory?.message) {
        const element = MyAlert(result?.data?.AddHistory?.message);
        // eslint-disable-next-line max-depth
        if (element) {
          SetAlert(element);
        }
      }
    } else {
      const element = MyAlert('Uživatel musí být přihlášen na svů účet');
      // eslint-disable-next-line no-lonely-if
      if (element) {
        SetAlert(element);
      }
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
                toDateInNumForm(pickUp),
                toDateInNumForm(delivery),
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
              Cena: {price} Kč
            </Typography>
            <Typography component="p" style={{ textAlign: 'center' }}>
              Bez DPH : {price - Math.round((price / 100) * 21)} Kč
            </Typography>

            <CardActions>
              {name === 'dpd' ? (
                <Link href="https://zrukydoruky.dpd.cz/">
                  <CusotmBtn>Objednat</CusotmBtn>
                </Link>
              ) : (
                <CusotmBtn>Objednat</CusotmBtn>
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
