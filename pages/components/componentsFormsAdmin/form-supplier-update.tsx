import { State, useHookstate } from '@hookstate/core';
import {
  Alert,
  Button,
  InputAdornment,
  MenuItem,
  TextField,
} from '@mui/material';
import {
  DatePicker,
  DateValidationError,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { getAuth } from 'firebase/auth';
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
  packInBox: string;
  suppName: string;
  pickUp: string;
  delivery: string;
  insurance: number;
  shippingLabel: string;
  foil: string;
  supplierId: string;
};

type ErrSettersProperties = {
  errInsurance: string;
  errSendCashDelivery: string;
  errFoil: string;
  errShippingLabel: string;
  errpackInBox: string;
  errDepoCost: string;
  errPersonalCost: string;
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
  const message = 'Value not in valid format (Yes/No)';
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
    msgValidation: string;
  },
  sId: string,
) => {
  console.log('messages', messages);
  let alert = <div></div>;

  if (messages.errUpdate !== 'Any') {
    alert = (
      <div>
        <Alert severity="error">{messages.errUpdate}</Alert>
        <Button onClick={() => Back(sId)}>Back</Button>
      </div>
    );
  }

  if (messages.succesUpade !== 'Any' && messages.msgHisotry !== 'Any') {
    alert = (
      <div>
        <Alert severity="success">{messages.succesUpade}</Alert>
        <Alert severity="success">{messages.msgHisotry}</Alert>
        <Button onClick={() => Back(sId)}>Back</Button>
      </div>
    );
  }

  if (messages.msgValidation !== 'Any') {
    alert = (
      <div>
        <Alert severity="error">{messages.msgValidation}</Alert>
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
  const messageForInt =
    'Invalid argument, expect number bigger or equal to zero';

  if (!isInt(insurancearg, 0)) {
    setterErr.errInsurance.set(messageForInt);
    return new Error(messageForInt);
  }

  setterErr.errInsurance.set('Any');

  if (!isInt(depoCostarg, 0)) {
    setterErr.errDepoCost.set(messageForInt);
    return new Error(messageForInt);
  }

  setterErr.errDepoCost.set('Any');

  if (!isInt(personalCostarg, 0)) {
    setterErr.errPersonalCost.set(messageForInt);
    return new Error(messageForInt);
  }

  setterErr.errPersonalCost.set('Any');

  const yesRoNo = IsYesOrNo(
    sendCashDeliveryarg,
    foilarg,
    shippingLabelarg,
    packInBoxarg,
  );

  if (yesRoNo) {
    switch (yesRoNo.from) {
      case 'packInBox': {
        setterErr.errpackInBox.set(yesRoNo.msg);
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
        setterErr.errSendCashDelivery.set('Any');
        setterErr.errFoil.set('Any');
        setterErr.errShippingLabel.set('Any');
        setterErr.errpackInBox.set('Any');
        return undefined;
      }
    }
  }

  if (deliveryarg !== 'Any') {
    return new Error('Delivery date is not valid');
  }

  if (pickUparg !== 'Any') {
    return new Error('Pickup date is not valid');
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

export const FormSupplierUpdate: React.FC<Props> = ({ id }) => {
  const options = [
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' },
  ];

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
    errPickUp: 'Any',
    errDelivery: 'Any',
  });

  const setterErrors = useHookstate({
    errInsurance: 'Any',
    errSendCashDelivery: 'Any',
    errFoil: 'Any',
    errShippingLabel: 'Any',
    errpackInBox: 'Any',
    errDepoCost: 'Any',
    errPersonalCost: 'Any',
  });

  const setterForAlertMesssage = useHookstate({
    errUpdate: 'Any',
    succesUpdate: 'Any',
    msgHistory: 'Any',
    msgValidation: 'Any',
  });

  const user = useHookstate({ Admin: false, LoggedIn: false });

  const supData = useSuppDataQuery();
  const [UpdateHistory] = useUpdateHistoryMutation();
  const [UpdateSupp] = useUpdateSupplierMutation();
  const [suppId, SetSuppId] = React.useState('');

  useEffect(() => {
    const Admin = process.env.NEXT_PUBLIC_AdminEm;
    const auth = getAuth();
    console.log('ada', auth.currentUser?.email);
    if (auth.currentUser) {
      user.LoggedIn.set(true);
    }
    if (auth.currentUser?.email === Admin) {
      user.Admin.set(true);
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

  const MyComponent = (state: State<string>, paragraph: string) => {
    return (
      <TextField
        id="outlined-select"
        select
        label={paragraph}
        placeholder={'Yes/No'}
        required
        // error
        helperText={`Please select option Yes/No`}
        onChange={(selectedOption) =>
          state.set(selectedOption ? selectedOption.target.value : '')
        }
        value={state.get()}
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
      setterForAlertMesssage.msgValidation.set(valid);
    } else {
      setterForAlertMesssage.msgValidation.set('Any');
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

      const appErr: string | undefined = result?.data?.updateSup?.message;
      const data: DataUpdateSupp | undefined = result?.data?.updateSup?.data;

      if (appErr) {
        setterForAlertMesssage.errUpdate.set(appErr);
      } else {
        setterForAlertMesssage.errUpdate.set('Any');
      }

      let updateHistory;
      if (data) {
        setterForAlertMesssage.succesUpdate.set(MessageUpdateSupp(data));
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
      } else {
        setterForAlertMesssage.succesUpdate.set('Any');
      }

      if (updateHistory?.data?.updateHistory?.message) {
        setterForAlertMesssage.msgHistory.set(
          MessageUpdateHistory(updateHistory?.data?.updateHistory?.message),
        );
      } else {
        setterForAlertMesssage.msgHistory.set('Any');
      }
    }
  };

  if (!user.Admin.get() || !user.LoggedIn.get()) {
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
    <div>
      {MyAlert(
        {
          succesUpade: setterForAlertMesssage.succesUpdate.value,
          errUpdate: setterForAlertMesssage.errUpdate.value,
          msgHisotry: setterForAlertMesssage.msgHistory.value,
          msgValidation: setterForAlertMesssage.msgValidation.value,
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
        onChange={() =>
          setterForAlertMesssage.set({
            errUpdate: 'Any',
            succesUpdate: 'Any',
            msgHistory: 'Any',
            msgValidation: 'Any',
          })
        }
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
            Supplier information
          </legend>
          <TextField
            type="text"
            label="Supplier name"
            required
            id="outlined-required"
            sx={{ m: 1, width: '25ch' }}
            onChange={(e) => settersOfDataSupp.SupplierName.set(e.target.value)}
            helperText={`Enter supplier name`}
            value={settersOfDataSupp.SupplierName.get()}
          />
          <TextField
            type="number"
            label="Insurance"
            required
            id="outlined-basic"
            sx={{ m: 1, width: '25ch' }}
            onChange={(e) => settersOfDataSupp.Insurance.set(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">Kč</InputAdornment>
              ),
            }}
            helperText={`Enter insurance on package`}
            value={settersOfDataSupp.Insurance.get()}
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
            Dates for package
          </legend>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Delivery"
              disablePast
              minDate={dayjs()}
              onError={(e: DateValidationError) =>
                setterDateErr.errDelivery.set(e ? e.toString() : 'Any')
              }
              onChange={(e: dayjs.Dayjs | null) =>
                settersOfDataSupp.Delivery.set(
                  e ? e.toDate().toDateString() : '',
                )
              }
              value={dayjs(settersOfDataSupp.Delivery.get())}
              slotProps={{
                textField: {
                  helperText:
                    'Enter the date of package delivery in format (MM/DD/YYYY)',
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
                setterDateErr.errPickUp.set(e ? e.toString() : 'Any')
              }
              onChange={(e: dayjs.Dayjs | null) =>
                settersOfDataSupp.PickUp.set(e ? e.toDate().toDateString() : '')
              }
              value={dayjs(settersOfDataSupp.PickUp.get())}
              slotProps={{
                textField: {
                  helperText:
                    'Enter the date of package pickup in format (MM/DD/YYYY)',
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
            Details
          </legend>
          {MyComponent(settersOfDataSupp.SendCashDelivery, 'Cash on delivery')}
          {MyComponent(
            settersOfDataSupp.ShippingLabel,
            'Shipping delivered by courier',
          )}
          {MyComponent(settersOfDataSupp.Foil, 'Packed in foil')}
          {MyComponent(settersOfDataSupp.PackInBox, 'Packed in a box')}
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
            Shipping/transfer method prices
          </legend>
          <TextField
            type="number"
            label="Depo cost"
            required
            id="outlined-basic"
            sx={{ m: 1, width: '25ch' }}
            onChange={(e) => settersOfDataSupp.DepoCost.set(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">Kč</InputAdornment>
              ),
            }}
            helperText={`Enter cost for deliver/pick up to depo`}
            value={settersOfDataSupp.DepoCost.get()}
          />
          <TextField
            type="number"
            label="Personal cost"
            required
            id="outlined-basic"
            sx={{ m: 1, width: '25ch' }}
            onChange={(e) => settersOfDataSupp.PersonalCost.set(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">Kč</InputAdornment>
              ),
            }}
            helperText={`Enter cost for deliver/pick up to you personaly`}
            value={settersOfDataSupp.PersonalCost.get()}
          />
        </fieldset>

        <button className={styles.crudbtn} type="submit">
          Update
        </button>
      </form>
    </div>
  );
};
