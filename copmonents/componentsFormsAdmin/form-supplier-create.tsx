import { State, useHookstate } from '@hookstate/core';
import {
  Alert,
  Button,
  MenuItem,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import { DateValidationError, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import router from 'next/router';
import * as React from 'react';
import { useEffect } from 'react';

import {
  SuppDataDocument,
  useNewSupplierToFirestoreMutation,
} from '@/generated/graphql';

import { useAuthContext } from '../auth-context-provider';
import { MyCompTextField } from '../text-field';

const Back = async () => {
  await router.push(`/../admin-page`);
};

const CreateButton = styled(Button)({
  backgroundColor: 'green',
  color: 'white',
  width: '30%',
  alignSelf: 'center',
});

const BackButtn = styled(Button)({
  backgroundColor: '#5193DE',
  color: 'white',
  width: '30%',
});

type ErrSettersProperties = {
  errInsurance: string;
  errSendCashDelivery: string;
  errFoil: string;
  errShippingLabel: string;
  errPackInBox: string;
  errDepoCost: string;
  errPersonalCost: string;
  errName: string;
};

type DataCreatedSupp = {
  sendCashDelivery: string;
  packInBox: string;
  suppName: string;
  pickUp: string;
  delivery: string;
  insurance: number;
  shippingLabel: string;
  foil: string;
};

const CustomFieldset = styled('fieldset')({
  border: '5px solid #5193DE',
  borderRadius: '10px',
  display: 'flex',
  gap: '1rem',
  flexWrap: 'wrap',
  justifyContent: 'space-around',
  padding: '1rem',
});

const IsYesOrNo = (
  stringnU1: string,
  stringnU2: string,
  stringnU3: string,
  stringnU4: string,
) => {
  const message = 'Očekává se hodnota (Yes/No)';
  if (!['Yes', 'No'].includes(stringnU1)) {
    return { msg: message, from: 'sendCashDelivery' };
  }

  if (!['Yes', 'No'].includes(stringnU2)) {
    return { msg: message, from: 'foil' };
  }

  if (!['Yes', 'No'].includes(stringnU3)) {
    return { msg: message, from: 'shippingLabel' };
  }

  if (!['Yes', 'No'].includes(stringnU4)) {
    return { msg: message, from: 'packInBox' };
  }

  return undefined;
};

const parseIntReliable = (numArg: string) => {
  if (numArg.length > 0) {
    const parsed = Number.parseInt(numArg, 10);
    if (parsed === 0) {
      // eslint-disable-next-line max-depth
      if (numArg.replaceAll('0', '') === '') {
        return 0;
      }
    } else if (Number.isSafeInteger(parsed)) {
      return parsed;
    }
  }
  return false;
};

const isInt = (numArg: string, min: number) => {
  const parsed = parseIntReliable(numArg);

  return parsed !== false && parsed >= min;
};

const MyAlert = (messages: { succesCreate: string; errCreate: string }) => {
  let alert = <div></div>;

  if (messages.errCreate !== '') {
    alert = (
      <div>
        <Alert severity="error">{messages.errCreate}</Alert>
        <Button onClick={() => Back()}>Back</Button>
      </div>
    );
  }

  if (messages.succesCreate !== '') {
    alert = (
      <div>
        <Alert severity="success">{messages.succesCreate}</Alert>
        <Button onClick={() => Back()}>Back</Button>
      </div>
    );
  }

  return alert;
};

const Valid = (
  pickUparg: string,
  deliveryarg: string,
  insurancearg: string,
  sendCashDeliveryarg: string,
  foilarg: string,
  shippingLabelarg: string,
  packInBoxarg: string,
  depoCostarg: string,
  personalCostarg: string,
  setterErr: State<ErrSettersProperties>,
) => {
  const messageForInt = 'Očekává se číslo větší nebo rovné nule';

  if (!isInt(insurancearg, 0)) {
    setterErr.errInsurance.set(messageForInt);
    return new Error(messageForInt);
  }

  if (!isInt(depoCostarg, 0)) {
    setterErr.errDepoCost.set(messageForInt);
    return new Error(messageForInt);
  }

  if (!isInt(personalCostarg, 0)) {
    setterErr.errPersonalCost.set(messageForInt);
    return new Error(messageForInt);
  }

  const yesRoNo = IsYesOrNo(
    sendCashDeliveryarg,
    foilarg,
    shippingLabelarg,
    packInBoxarg,
  );

  if (yesRoNo) {
    switch (yesRoNo.from) {
      case 'packInBox': {
        setterErr.errPackInBox.set(yesRoNo.msg);
        return new Error(yesRoNo.msg);
      }
      case 'shippingLabel': {
        setterErr.errShippingLabel.set(yesRoNo.msg);
        return new Error(yesRoNo.msg);
      }
      case 'foil': {
        setterErr.errFoil.set(yesRoNo.msg);
        return new Error(yesRoNo.msg);
      }
      case 'sendCashDelivery': {
        setterErr.errSendCashDelivery.set(yesRoNo.msg);
        return new Error(yesRoNo.msg);
      }
      default: {
        return undefined;
      }
    }
  }

  if (deliveryarg !== '') {
    return new Error('Datum dodání není ve správném formátu');
  }

  if (pickUparg !== '') {
    return new Error('Datum vyzvednutí není ve správném formátu');
  }
  return undefined;
};

const MessageCreateSupp = (data: DataCreatedSupp) => {
  return `Zásliková služba byla vytvořena s parametry: Dodání: ${
    data.delivery
  } \n
  Zabalení do folie: ${data.foil === 'Yes' ? 'Ano' : 'Ne'} \n
  Pojištění: ${data.insurance > 0 ? data.insurance : 'bez pojištění'} \n
  Zabalení do krabice: ${data.packInBox === 'Yes' ? 'Ano' : 'Ne'} \n
  Vyzvednutí: ${data.pickUp === 'Yes' ? 'Ano' : 'Ne'} \n
  Na dobírku: ${data.sendCashDelivery === 'Yes' ? 'Ano' : 'Ne'} \n
  Štítek přiveze kurýr: ${data.shippingLabel === 'Yes' ? 'Ano' : 'Ne'} \n
  Jméno: ${data.suppName}`;
};

const Response = (
  response:
    | {
        __typename?: 'Supp' | undefined;
        data: {
          __typename?: 'SupplierData' | undefined;
          sendCashDelivery: string;
          packInBox: string;
          suppName: string;
          pickUp: string;
          delivery: string;
          insurance: number;
          shippingLabel: string;
          foil: string;
        };
      }
    | {
        __typename?: 'SupplierError' | undefined;
        message: string;
      }
    | null
    | undefined,
) => {
  const responseFromQuery: {
    data: DataCreatedSupp | undefined;
    error: string | undefined;
  } = {
    data: undefined,
    error: undefined,
  };
  // eslint-disable-next-line no-underscore-dangle
  if (response?.__typename === 'Supp') {
    responseFromQuery.data = response.data ?? undefined;
  }
  // eslint-disable-next-line no-underscore-dangle
  if (response?.__typename === 'SupplierError') {
    responseFromQuery.error = response.message ?? undefined;
  }
  return responseFromQuery;
};

export const FormSupplier = () => {
  const { user } = useAuthContext();
  const options = [
    { value: 'Yes', label: 'Ano' },
    { value: 'No', label: 'Ne' },
  ];

  const settersOfDataSupp = useHookstate({
    SuppId: '',
    SupplierName: '',
    ActualSupplierName: '',
    Delivery: ' ',
    PickUp: '',
    Insurance: '',
    SendCashDelivery: '',
    PackInBox: '',
    ShippingLabel: '',
    Foil: '',
    DepoCost: '',
    PersonalCost: '',
  });

  const setterForAlertMesssage = useHookstate({
    errCreate: '',
    succesCreate: '',
  });

  const setterDateErr = useHookstate({
    errPickUp: '',
    errDelivery: '',
  });

  const setterErrors = useHookstate({
    errInsurance: '',
    errSendCashDelivery: '',
    errFoil: '',
    errShippingLabel: '',
    errPackInBox: '',
    errDepoCost: '',
    errPersonalCost: '',
    errName: '',
  });

  const idComp = 'outlined-required';

  const labelPersonalCost = {
    err: 'Chyba',
    withoutErr: 'Cena za osobní vyzvednutí/dodání',
  };
  const labelDepoCost = {
    err: 'Chyba',
    withoutErr: 'Cena vyzvednutí/dodání na depo',
  };
  const labelInsurance = { err: 'Chyba', withoutErr: 'Pojištění' };
  const labelName = { err: 'Chyba', withoutErr: 'Jméno' };

  // const setd = React.useCallback((nwValue) => console.log(nwValue), [2]);

  const userApp = useHookstate({ Admin: false, LoggedIn: false });
  const [newSupp] = useNewSupplierToFirestoreMutation();

  useEffect(() => {
    const adminEm = process.env.NEXT_PUBLIC_AdminEm;
    if (user) {
      userApp.LoggedIn.set(true);
    }
    if (user?.email === adminEm) {
      userApp.Admin.set(true);
    }
  });

  const MyComponent = (
    state: State<string>,
    paragraph: string,
    error: string,
  ) => {
    return error === '' ? (
      <TextField
        id="outlined-select"
        select
        label={paragraph}
        placeholder={'Ano/Ne'}
        required
        helperText={`Vyberte prosím z možností Ano/Ne`}
        onChange={(selectedOption) =>
          state.set(selectedOption ? selectedOption.target.value : '')
        }
      >
        {options.map((option: { value: string; label: string }) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    ) : (
      <TextField
        id="outlined-select"
        select
        error
        label={'Error'}
        placeholder={'Ano/Ne'}
        required
        helperText={`Vyberte prosím z možností Ano/Ne`}
        onChange={(selectedOption) =>
          state.set(selectedOption ? selectedOption.target.value : '')
        }
      >
        {options.map((option: { value: string; label: string }) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    );
  };

  const handleForm = async (event: React.FormEvent) => {
    event.preventDefault();
    const valid = Valid(
      setterDateErr.errPickUp.get(),
      setterDateErr.errDelivery.get(),
      settersOfDataSupp.Insurance.get(),
      settersOfDataSupp.SendCashDelivery.get(),
      settersOfDataSupp.Foil.get(),
      settersOfDataSupp.ShippingLabel.get(),
      settersOfDataSupp.PackInBox.get(),
      settersOfDataSupp.DepoCost.get(),
      settersOfDataSupp.PersonalCost.get(),
      setterErrors,
    )?.message;
    if (valid) {
      console.error(valid);
    } else {
      const result = await newSupp({
        variables: {
          SupName: settersOfDataSupp.SupplierName.get(),
          PickUp: settersOfDataSupp.PickUp.get(),
          Delivery: settersOfDataSupp.Delivery.get(),
          Insurance: Number(settersOfDataSupp.Insurance.get()),
          SendCashDelivery: settersOfDataSupp.SendCashDelivery.get(),
          Foil: settersOfDataSupp.Foil.get(),
          ShippingLabel: settersOfDataSupp.ShippingLabel.get(),
          PackInBox: settersOfDataSupp.PackInBox.get(),
          DepoCost: Number(settersOfDataSupp.DepoCost.get()),
          PersonalCost: Number(settersOfDataSupp.PersonalCost.get()),
        },
        refetchQueries: [{ query: SuppDataDocument }],
        awaitRefetchQueries: true,
      }).catch((error: string) => console.error(error));

      const response = Response(result?.data?.SupplierToFirestore);

      if (
        response.error &&
        /Toto jméno používá jiná zásilková služba/.test(response.error) ===
          false
      ) {
        setterForAlertMesssage.errCreate.set(response.error);
      }

      if (
        response.error &&
        /Toto jméno používá jiná zásilková služba/.test(response.error)
      ) {
        setterErrors.errName.set(response.error);
      }

      if (response.data) {
        setterForAlertMesssage.succesCreate.set(
          MessageCreateSupp(response.data),
        );
      }
    }
  };

  if (!userApp.Admin.get() || !userApp.LoggedIn.get()) {
    return (
      <div
        style={{
          textAlign: 'center',
          color: 'red',
          fontSize: '30px',
          fontWeight: 'bold',
          margin: 'auto',
        }}
      >
        Nejsi admin
      </div>
    );
  }
  return (
    <Typography component={'div'}>
      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
        onSubmit={handleForm}
        onChange={() => {
          setterForAlertMesssage.set({
            errCreate: '',
            succesCreate: '',
          });
          setterErrors.set({
            errInsurance: '',
            errSendCashDelivery: '',
            errFoil: '',
            errShippingLabel: '',
            errPackInBox: '',
            errDepoCost: '',
            errPersonalCost: '',
            errName: '',
          });
        }}
      >
        {
          <div style={{ alignSelf: 'center' }}>
            {MyAlert({
              succesCreate: setterForAlertMesssage.succesCreate.value,
              errCreate: setterForAlertMesssage.errCreate.value,
            })}
          </div>
        }
        <CustomFieldset>
          <legend
            style={{
              textAlign: 'center',
              fontSize: '30px',
              fontWeight: 'bold',
            }}
          >
            Informace o zásilkové služby
          </legend>

          <MyCompTextField
            typeComp="text"
            idComp={idComp}
            labelComp={labelName}
            errorComp={setterErrors.errName.get()}
            funcComp={(e) => settersOfDataSupp.SupplierName.set(e)}
            helpTexterComp={'Zadej jméno zásilkové služby'}
          />

          <MyCompTextField
            typeComp="number"
            idComp={idComp}
            labelComp={labelInsurance}
            errorComp={setterErrors.errInsurance.get()}
            funcComp={(e) => settersOfDataSupp.Insurance.set(e)}
            helpTexterComp={'Zadej pojištění na balík'}
            placeholderComp="Kč"
          />
        </CustomFieldset>

        <CustomFieldset>
          <legend
            style={{
              textAlign: 'center',
              fontSize: '30px',
              fontWeight: 'bold',
            }}
          >
            Datum
          </legend>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Dodání"
              disablePast
              minDate={dayjs()}
              onError={(e: DateValidationError) =>
                setterDateErr.errDelivery.set(e ? e.toString() : '')
              }
              onChange={(e: dayjs.Dayjs | null) =>
                settersOfDataSupp.Delivery.set(
                  e ? e.toDate().toDateString() : '',
                )
              }
              slotProps={{
                textField: {
                  helperText: 'Zadej datum dodaní ve formátu (MM/DD/YYYY)',
                },
              }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Vyzvednutí"
              disablePast
              minDate={dayjs()}
              onError={(e: DateValidationError) =>
                setterDateErr.errPickUp.set(e ? e.toString() : '')
              }
              onChange={(e: dayjs.Dayjs | null) =>
                settersOfDataSupp.PickUp.set(e ? e.toDate().toDateString() : '')
              }
              slotProps={{
                textField: {
                  helperText: 'Zadej datum vyzvednutí ve formátu (MM/DD/YYYY)',
                },
              }}
            />
          </LocalizationProvider>
        </CustomFieldset>

        <CustomFieldset>
          <legend
            style={{
              textAlign: 'center',
              fontSize: '30px',
              fontWeight: 'bold',
            }}
          >
            Detaily
          </legend>
          {MyComponent(
            settersOfDataSupp.SendCashDelivery,
            'Na dobírku',
            setterErrors.errSendCashDelivery.get(),
          )}
          {MyComponent(
            settersOfDataSupp.ShippingLabel,
            'Štítek přiveze kurýr',
            setterErrors.errShippingLabel.get(),
          )}
          {MyComponent(
            settersOfDataSupp.Foil,
            'Zabalení do fólie (nepovinné)',
            setterErrors.errFoil.get(),
          )}
          {MyComponent(
            settersOfDataSupp.PackInBox,
            'Zabalení do krabice',
            setterErrors.errPackInBox.get(),
          )}
        </CustomFieldset>

        <CustomFieldset>
          <legend
            style={{
              textAlign: 'center',
              fontSize: '30px',
              fontWeight: 'bold',
            }}
          >
            Ceny způsobu dopravy
          </legend>
          <MyCompTextField
            typeComp="number"
            idComp={idComp}
            labelComp={labelDepoCost}
            errorComp={setterErrors.errDepoCost.get()}
            funcComp={(e) => settersOfDataSupp.DepoCost.set(e)}
            helpTexterComp={'Cena vyzvednutí/dodání do depa'}
            placeholderComp="Kč"
          />

          <MyCompTextField
            typeComp="number"
            idComp={idComp}
            labelComp={labelPersonalCost}
            errorComp={setterErrors.errPersonalCost.get()}
            funcComp={(e) => settersOfDataSupp.PersonalCost.set(e)}
            helpTexterComp={'Cena za osobní vyzvednutí/dodání'}
            placeholderComp="Kč"
          />
        </CustomFieldset>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
          }}
        >
          <CreateButton type="submit">Vytvořit</CreateButton>
          <BackButtn onClick={() => Back()}>Zpět</BackButtn>
        </div>
      </form>
    </Typography>
  );
};
