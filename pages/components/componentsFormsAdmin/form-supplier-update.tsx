import { State, useHookstate } from '@hookstate/core';
import { Alert, Button, MenuItem, TextField, Typography } from '@mui/material';
import {
  DatePicker,
  DateValidationError,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import router from 'next/router';
import * as React from 'react';
import { useEffect } from 'react';

import {
  HistoryDataDocument,
  SuppDataDocument,
  useSuppDataQuery,
  useUpdateHistoryMutation,
  useUpdateSupplierMutation,
} from '@/generated/graphql';

import styles from '../../../styles/stylesForm/styleForms.module.css';
import { useAuthContext } from '../auth-context-provider';
import { MyCompTextField } from '../text-field';

type Props = {
  id: string;
};

type Item = {
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
  package?: any;
  location?: any;
};

type DataUpdateSupp = {
  sendCashDelivery: string;
  supplierId: string;
  packInBox: string;
  suppName: string;
  pickUp: string;
  delivery: string;
  insurance: number;
  shippingLabel: string;
  foil: string;
};

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

type DataFromDB = {
  SuppId: string;
  SupplierName: string;
  OldSupplierName: string;
  Delivery: string;
  PickUp: string;
  Insurance: string;
  SendCashDelivery: string;
  PackInBox: string;
  ShippingLabel: string;
  Foil: string;
  DepoCost: string;
  PersonalCost: string;
};

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

const Back = async (ids: string) => {
  await router.push(`/../../admpage/${ids}`);
};

const MessageUpdateSupp = (data: DataUpdateSupp) => {
  return `Courier was modified with parameters: Delivery: ${data.delivery},
  Cant be in packaged folie: ${data.foil} \n
  Insurance: ${data.insurance > 0 ? data.insurance : 'bez pojištění'} \n
  Shipment must be packed in a box: ${data.packInBox} \n
  Pick up: ${data.pickUp} \n
  On cash on delivery: ${data.sendCashDelivery} \n
  The label will be delivered by courier: ${data.shippingLabel} \n
  Courier name: ${data.suppName}`;
};

const MessageUpdateHistory = (message: string) => {
  return `Status of update History : ${message}`;
};

// nepouzivat alerty errr u button

const MyAlert = (
  messages: {
    succesUpade: string;
    errUpdate: string;
    msgHisotry: string;
  },
  sId: string,
) => {
  console.log('messages', messages);
  let alert = <div></div>;

  if (messages.errUpdate !== '') {
    alert = (
      <div>
        <Alert severity="error">{messages.errUpdate}</Alert>
        <Button onClick={() => Back(sId)}>Back</Button>
      </div>
    );
  }

  if (messages.succesUpade !== '' && messages.msgHisotry !== '') {
    alert = (
      <div>
        <Alert severity="success">{messages.succesUpade}</Alert>
        <Alert severity="success">{messages.msgHisotry}</Alert>
        <Button onClick={() => Back(sId)}>Back</Button>
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

const setDataDatabase = (data: Item, stateSeter: State<DataFromDB>) => {
  stateSeter.set({
    SuppId: data.supplierId,
    SupplierName: data.suppName,
    Delivery: data.delivery,
    PickUp: data.pickUp,
    Insurance: data.insurance.toString(),
    SendCashDelivery: data.sendCashDelivery,
    PackInBox: data.packInBox,
    ShippingLabel: data.shippingLabel,
    OldSupplierName: data.suppName,
    Foil: data.foil,
    DepoCost: String(data.location?.depoDelivery.cost),
    PersonalCost: String(data.location?.personalDelivery.cost),
  });
};

const Response = (
  response:
    | {
        __typename?: 'Supp' | undefined;
        data: {
          __typename?: 'SupplierData' | undefined;
          sendCashDelivery: string;
          supplierId: string;
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
    data: DataUpdateSupp | undefined;
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

export const FormSupplierUpdate: React.FC<Props> = ({ id }) => {
  const options = [
    { value: 'Yes', label: 'Ano' },
    { value: 'No', label: 'Ne' },
  ];
  const { user } = useAuthContext();

  const settersOfDataSupp = useHookstate({
    SuppId: '',
    SupplierName: '',
    OldSupplierName: '',
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

  const setterForAlertMesssage = useHookstate({
    errUpdate: '',
    succesUpdate: '',
    msgHistory: '',
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

  const userApp = useHookstate({ Admin: false, LoggedIn: false });

  const supData = useSuppDataQuery();
  const [UpdateHistory] = useUpdateHistoryMutation();
  const [UpdateSupp] = useUpdateSupplierMutation();
  const [suppId, SetSuppId] = React.useState('');

  useEffect(() => {
    const adminEm = process.env.NEXT_PUBLIC_AdminEm;
    if (user) {
      userApp.LoggedIn.set(true);
    }
    if (user?.email === adminEm) {
      userApp.Admin.set(true);
    }

    if (id && supData.data && supData) {
      const actualSupp = supData.data?.suplierData.find(
        (actSupp) => actSupp.supplierId === id,
      );

      if (actualSupp) {
        SetSuppId(actualSupp.supplierId);
        setDataDatabase(actualSupp, settersOfDataSupp);
      }
    }
  }, [id, supData]);

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
        value={state.get()}
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
        label={'Chyba'}
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
      const result = await UpdateSupp({
        variables: {
          SupName: settersOfDataSupp.SupplierName.get(),
          Delivery: settersOfDataSupp.Delivery.get(),
          PickUp: settersOfDataSupp.PickUp.get(),
          ShippingLabel: settersOfDataSupp.ShippingLabel.get(),
          Foil: settersOfDataSupp.Foil.get(),
          Insurance: Number(settersOfDataSupp.Insurance.get()),
          SendCashDelivery: settersOfDataSupp.SendCashDelivery.get(),
          PackInBox: settersOfDataSupp.PackInBox.get(),
          SuppId: settersOfDataSupp.SuppId.get(),
          OldSupplierName: settersOfDataSupp.OldSupplierName.get(),
          DepoCost: Number(settersOfDataSupp.DepoCost.get()),
          PersonalCost: Number(settersOfDataSupp.PersonalCost.get()),
        },
        refetchQueries: [{ query: SuppDataDocument }],
        awaitRefetchQueries: true,
      }).catch((error: string) => console.error(error));

      const response = Response(result?.data?.updateSup);

      if (
        response.error &&
        /Supplier name is already in use/.test(response.error) === false
      ) {
        setterForAlertMesssage.errUpdate.set(response.error);
      }

      if (
        response.error &&
        /Supplier name is already in use/.test(response.error)
      ) {
        setterErrors.errName.set(response.error);
      }
      let updateHistory;
      if (response.data) {
        setterForAlertMesssage.succesUpdate.set(
          MessageUpdateSupp(response.data),
        );
        updateHistory = await UpdateHistory({
          variables: {
            SuppData: {
              delivery: settersOfDataSupp.Delivery.get(),
              foil: settersOfDataSupp.Foil.get(),
              insurance: Number(settersOfDataSupp.Insurance.get()),
              packInBox: settersOfDataSupp.PackInBox.get(),
              pickUp: settersOfDataSupp.PickUp.get(),
              sendCashDelivery: settersOfDataSupp.SendCashDelivery.get(),
              shippingLabel: settersOfDataSupp.ShippingLabel.get(),
              suppName: settersOfDataSupp.SupplierName.get(),
            },
            NewPriceDepo: Number(settersOfDataSupp.DepoCost.get()),
            NewPricePersonal: Number(settersOfDataSupp.PersonalCost.get()),
            SuppId: settersOfDataSupp.SuppId.get(),
          },
          refetchQueries: [{ query: HistoryDataDocument }],
          awaitRefetchQueries: true,
        }).catch((error) => console.error(error));
      }

      if (updateHistory?.data?.updateHistory?.message) {
        setterForAlertMesssage.msgHistory.set(
          MessageUpdateHistory(updateHistory?.data?.updateHistory?.message),
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
        }}
      >
        Only admin has acces to this page
      </div>
    );
  }
  return (
    <Typography component={'div'}>
      {MyAlert(
        {
          succesUpade: setterForAlertMesssage.succesUpdate.value,
          errUpdate: setterForAlertMesssage.errUpdate.value,
          msgHisotry: setterForAlertMesssage.msgHistory.value,
        },
        suppId,
      )}

      <form
        onSubmit={handleForm}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
        onChange={() => {
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
          setterForAlertMesssage.set({
            errUpdate: '',
            succesUpdate: '',
            msgHistory: '',
          });
        }}
      >
        <fieldset
          style={{
            border: '5px solid #F565AD',
            borderRadius: '10px',
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            padding: '1rem',
          }}
        >
          <legend
            style={{
              textAlign: 'center',
              fontSize: '30px',
              fontWeight: 'bold',
            }}
          >
            Informace o dodavateli
          </legend>
          <MyCompTextField
            typeComp="text"
            idComp={idComp}
            labelComp={labelName}
            errorComp={setterErrors.errName.get()}
            funcComp={(e) => settersOfDataSupp.SupplierName.set(e)}
            helpTexterComp={'Zadejte jméno'}
            valueComp={settersOfDataSupp.SupplierName.get()}
          />

          <MyCompTextField
            typeComp="number"
            idComp={idComp}
            labelComp={labelInsurance}
            errorComp={setterErrors.errInsurance.get()}
            funcComp={(e) => settersOfDataSupp.Insurance.set(e)}
            helpTexterComp={'Zadejte pojištění na balík'}
            placeholderComp="Kč"
            valueComp={settersOfDataSupp.Insurance.get()}
          />
        </fieldset>
        <fieldset
          style={{
            border: '5px solid #F565AD',
            borderRadius: '10px',
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            padding: '1rem',
          }}
        >
          <legend
            style={{
              textAlign: 'center',
              fontSize: '30px',
              fontWeight: 'bold',
            }}
          >
            Datumy
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
              value={dayjs(settersOfDataSupp.Delivery.get())}
              slotProps={{
                textField: {
                  helperText: 'Zadejte datum dodání ve formatu (MM/DD/YYYY)',
                },
              }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Pick up"
              disablePast
              minDate={dayjs()}
              onError={(e: DateValidationError) =>
                setterDateErr.errPickUp.set(e ? e.toString() : '')
              }
              onChange={(e: dayjs.Dayjs | null) =>
                settersOfDataSupp.PickUp.set(e ? e.toDate().toDateString() : '')
              }
              value={dayjs(settersOfDataSupp.PickUp.get())}
              slotProps={{
                textField: {
                  helperText:
                    'Zadejte datum vyzvednutí ve formatu (MM/DD/YYYY)',
                },
              }}
            />
          </LocalizationProvider>
        </fieldset>

        <fieldset
          style={{
            border: '5px solid #F565AD',
            borderRadius: '10px',
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            padding: '1rem',
          }}
        >
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
        </fieldset>
        <fieldset
          style={{
            border: '5px solid #F565AD',
            borderRadius: '10px',
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            padding: '1rem',
          }}
        >
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
            valueComp={settersOfDataSupp.DepoCost.get()}
          />

          <MyCompTextField
            typeComp="number"
            idComp={idComp}
            labelComp={labelPersonalCost}
            errorComp={setterErrors.errPersonalCost.get()}
            funcComp={(e) => settersOfDataSupp.PersonalCost.set(e)}
            helpTexterComp={'Cena za osobní vyzvednutí/dodání'}
            placeholderComp="Kč"
            valueComp={settersOfDataSupp.PersonalCost.get()}
          />
        </fieldset>

        <Button className={styles.crudbtn} type="submit">
          Upravit
        </Button>
      </form>
    </Typography>
  );
};
