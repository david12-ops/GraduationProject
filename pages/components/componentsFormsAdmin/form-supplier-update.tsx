import { State, useHookstate } from '@hookstate/core';
import { Alert, Button } from '@mui/material';
import { getAuth } from 'firebase/auth';
import router from 'next/router';
import * as React from 'react';
import { useEffect } from 'react';
import Select from 'react-select';

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

const IsYesOrNo = (
  stringnU1: string,
  stringnU2: string,
  stringnU3: string,
  stringnU4: string,
) => {
  console.log(stringnU1);
  console.log(stringnU2);
  console.log(stringnU3);
  console.log(stringnU4);

  if (!['Yes', 'No'].includes(stringnU1)) {
    // eslint-disable-next-line sonarjs/no-duplicate-string
    console.log('co kontroliujeme?', stringnU1);
    return true;
  }
  if (!['Yes', 'No'].includes(stringnU2)) {
    console.log('co kontroliujeme?', stringnU2);
    return true;
  }
  if (!['Yes', 'No'].includes(stringnU3)) {
    console.log('co kontroliujeme?', stringnU3);
    return true;
  }
  if (!['Yes', 'No'].includes(stringnU4)) {
    console.log('co kontroliujeme?', stringnU4);
    return true;
  }
  return false;
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

const ValidDateForm = (dateU1: string) => {
  const option = /^\d{4}(?:-\d{1,2}){2}$/;
  return !!option.test(dateU1);
};

const Valid = (
  pickUparg: string,
  Deliveryarg: string,
  Insurancearg: string,
  SendCashDeliveryarg: string,
  Foilarg: string,
  ShippingLabelarg: string,
  packInBoxarg: string,
  depoCostarg: string,
  personalCostarg: string,
) => {
  if (
    !isInt(Insurancearg, 0) ||
    !isInt(depoCostarg, 0) ||
    !isInt(personalCostarg, 0)
  ) {
    return new Error('Invalid argument');
  }

  if (IsYesOrNo(SendCashDeliveryarg, Foilarg, ShippingLabelarg, packInBoxarg)) {
    return new Error('Provided data is not in valid format (Ano/Ne)');
  }

  if (!ValidDateForm(Deliveryarg) || !ValidDateForm(pickUparg)) {
    return new Error('Date is not valid');
  }
  return undefined;
};

const setDataDatabase = (
  data: Item,
  stateSeter: State<{
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
  }>,
) => {
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

  // ukladat jako utc, pouziti timestamp
  const statesOfDataSupp = useHookstate({
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
        setDataDatabase(actualSupp, statesOfDataSupp);
      }
    }
  }, [id, supData]);

  const MyComponent = (state: State<string>, paragraph: string) => {
    return (
      <label>
        <p className={styles.Odstavce}>{paragraph}</p>
        <Select
          className={styles.selectInput}
          onChange={(selectedOption) => state.set(selectedOption?.value ?? '')}
          options={options}
          value={options.find((opt) => opt.value === state.get())}
          placeholder={'Yes/No'}
          required
        />
      </label>
    );
  };

  const handleForm = async (event: React.FormEvent) => {
    event.preventDefault();
    const valid = Valid(
      statesOfDataSupp.PickUp.get(),
      statesOfDataSupp.Delivery.get(),
      statesOfDataSupp.Insurance.get(),
      statesOfDataSupp.SendCashDelivery.get(),
      statesOfDataSupp.Foil.get(),
      statesOfDataSupp.ShippingLabel.get(),
      statesOfDataSupp.PackInBox.get(),
      statesOfDataSupp.DepoCost.get(),
      statesOfDataSupp.PersonalCost.get(),
    )?.message;
    if (valid) {
      setterForAlertMesssage.msgValidation.set(valid);
    } else {
      setterForAlertMesssage.msgValidation.set('Any');
      const result = await UpdateSupp({
        variables: {
          SupName: statesOfDataSupp.SupplierName.get(),
          Delivery: statesOfDataSupp.Delivery.get(),
          PickUp: statesOfDataSupp.PickUp.get(),
          ShippingLabel: statesOfDataSupp.ShippingLabel.get(),
          Foil: statesOfDataSupp.Foil.get(),
          Insurance: Number(statesOfDataSupp.Insurance.get()),
          SendCashDelivery: statesOfDataSupp.SendCashDelivery.get(),
          PackInBox: statesOfDataSupp.PackInBox.get(),
          SuppId: statesOfDataSupp.SuppId.get(),
          OldSupplierName: statesOfDataSupp.OldSupplierName.get(),
          DepoCost: Number(statesOfDataSupp.DepoCost.get()),
          PersonalCost: Number(statesOfDataSupp.PersonalCost.get()),
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
              delivery: statesOfDataSupp.Delivery.get(),
              foil: statesOfDataSupp.Foil.get(),
              insurance: Number(statesOfDataSupp.Insurance.get()),
              packInBox: statesOfDataSupp.PackInBox.get(),
              pickUp: statesOfDataSupp.PickUp.get(),
              sendCashDelivery: statesOfDataSupp.SendCashDelivery.get(),
              shippingLabel: statesOfDataSupp.ShippingLabel.get(),
              suppName: statesOfDataSupp.SupplierName.get(),
            },
            NewPriceDepo: Number(statesOfDataSupp.DepoCost.get()),
            NewPricePersonal: Number(statesOfDataSupp.PersonalCost.get()),
            SuppId: statesOfDataSupp.SuppId.get(),
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
      <div className={styles.container}>
        {MyAlert(
          {
            succesUpade: setterForAlertMesssage.succesUpdate.value,
            errUpdate: setterForAlertMesssage.errUpdate.value,
            msgHisotry: setterForAlertMesssage.msgHistory.value,
            msgValidation: setterForAlertMesssage.msgValidation.value,
          },
          suppId,
        )}
        <h1
          style={{
            textAlign: 'center',
            paddingBottom: '20px',
            fontWeight: 'bold',
            fontFamily: 'serif',
            color: 'orangered',
          }}
        >
          Update supplier
        </h1>
        <form onSubmit={handleForm} className={styles.form}>
          <div className={styles.divinput}>
            <label>
              <p className={styles.Odstavce}>Supplier name</p>
              <input
                className={styles.inputForSupp}
                onChange={(e) =>
                  statesOfDataSupp.SupplierName.set(e.target.value)
                }
                required
                type="text"
                value={statesOfDataSupp.SupplierName.get()}
              />
            </label>
          </div>
          <div className={styles.divinput}>
            <label>
              <p className={styles.Odstavce}>Delivery</p>
              <input
                className={styles.inputDate}
                onChange={(e) => statesOfDataSupp.Delivery.set(e.target.value)}
                required
                type="date"
                value={statesOfDataSupp.Delivery.get()}
              />
            </label>
            <label>
              <p className={styles.Odstavce}>Pick up</p>
              <input
                className={styles.inputDate}
                onChange={(e) => statesOfDataSupp.PickUp.set(e.target.value)}
                required
                type="date"
                value={statesOfDataSupp.PickUp.get()}
              />
            </label>
          </div>
          <h3 className={styles.Nadpisy}>Info about courier</h3>
          <div className={styles.divinput}>
            <label>
              <p className={styles.Odstavce}>Insurance</p>
              <input
                className={styles.inputForSupp}
                onChange={(e) => statesOfDataSupp.Insurance.set(e.target.value)}
                required
                type="number"
                value={statesOfDataSupp.Insurance.get()}
                placeholder="Kč"
              />
            </label>
          </div>
          <div className={styles.divinput}>
            {MyComponent(statesOfDataSupp.SendCashDelivery, 'Cash on delivery')}
            {MyComponent(
              statesOfDataSupp.ShippingLabel,
              'Shipping label will be delivered by courier',
            )}
          </div>
          <div className={styles.divinput}>
            {MyComponent(statesOfDataSupp.Foil, 'Must not be packed in foil')}
            {MyComponent(statesOfDataSupp.PackInBox, 'Must be packed in a box')}
          </div>
          <h3 className={styles.Nadpisy}>Shipping/transfer method prices</h3>
          <div className={styles.divinput}>
            <div className={styles.divinput}>
              <label>
                <p className={styles.Odstavce}>Depo</p>
                <input
                  className={styles.inputForSupp}
                  onChange={(e) =>
                    statesOfDataSupp.DepoCost.set(e.target.value)
                  }
                  required
                  type="number"
                  value={statesOfDataSupp.DepoCost.get()}
                  placeholder="Kč"
                />
              </label>
            </div>
            <div className={styles.divinput}>
              <label>
                <p className={styles.Odstavce}>Personal</p>
                <input
                  className={styles.inputForSupp}
                  onChange={(e) =>
                    statesOfDataSupp.PersonalCost.set(e.target.value)
                  }
                  required
                  type="number"
                  value={statesOfDataSupp.PersonalCost.get()}
                  placeholder="Kč"
                />
              </label>
            </div>
          </div>
          <div className={styles.divinput}>
            <button className={styles.crudbtn} type="submit">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
