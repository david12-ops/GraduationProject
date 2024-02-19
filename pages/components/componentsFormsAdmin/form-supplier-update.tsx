import { State, useHookstate } from '@hookstate/core';
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

  if (!['Ano', 'Ne'].includes(stringnU1)) {
    // eslint-disable-next-line sonarjs/no-duplicate-string
    console.log('co kontroliujeme?', stringnU1);
    return true;
  }
  if (!['Ano', 'Ne'].includes(stringnU2)) {
    console.log('co kontroliujeme?', stringnU2);
    return true;
  }
  if (!['Ano', 'Ne'].includes(stringnU3)) {
    console.log('co kontroliujeme?', stringnU3);
    return true;
  }
  if (!['Ano', 'Ne'].includes(stringnU4)) {
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
    console.log('costs1', parseIntReliable(Insurancearg));
    console.log('costs2', parseIntReliable(depoCostarg));
    console.log('costs3', parseIntReliable(personalCostarg));

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
    ActualSupplierName: string;
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
    ActualSupplierName: data.suppName,
    Foil: data.foil,
    DepoCost: String(data.location?.depoDelivery.cost),
    PersonalCost: String(data.location?.personalDelivery.cost),
  });
};

export const FormSupplierUpdate: React.FC<Props> = ({ id }) => {
  const options = [
    { value: 'Ano', label: 'Ano' },
    { value: 'Ne', label: 'Ne' },
  ];

  // ukladat jako utc, pouziti timestamp
  const statesOfDataSupp = useHookstate({
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

  // const setd = React.useCallback((nwValue) => console.log(nwValue), [2]);

  const user = useHookstate({ Admin: false, LoggedIn: false });

  const supData = useSuppDataQuery();
  const [UpdateHistory] = useUpdateHistoryMutation();
  const [UpdateSupp] = useUpdateSupplierMutation();

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
          placeholder={'Ano/Ne'}
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
      alert(valid);
    } else {
      const result = await UpdateSupp({
        variables: {
          SupName: statesOfDataSupp.SupplierName.get(),
          Delivery: statesOfDataSupp.Delivery.get(),
          pickUp: statesOfDataSupp.PickUp.get(),
          ShippingLabel: statesOfDataSupp.ShippingLabel.get(),
          Foil: statesOfDataSupp.Foil.get(),
          Insurance: Number(statesOfDataSupp.Insurance.get()),
          SendCashDelivery: statesOfDataSupp.SendCashDelivery.get(),
          packInBox: statesOfDataSupp.PackInBox.get(),
          SuppId: statesOfDataSupp.SuppId.get(),
          ActNameSupp: statesOfDataSupp.ActualSupplierName.get(),
          DepoCost: Number(statesOfDataSupp.DepoCost.get()),
          PersonalCost: Number(statesOfDataSupp.PersonalCost.get()),
        },
        refetchQueries: [{ query: SuppDataDocument }],
        awaitRefetchQueries: true,
      });

      const err = result.data?.updateSup?.message;
      const data = result.data?.updateSup?.data;

      if (err) {
        alert(err);
      }

      if (data) {
        const message = await UpdateHistory({
          variables: {
            newPriceDepo: Number(statesOfDataSupp.DepoCost.get()),
            newPricePersonal: Number(statesOfDataSupp.PersonalCost.get()),
            SuppId: statesOfDataSupp.SuppId.get(),
          },
          refetchQueries: [{ query: HistoryDataDocument }],
          awaitRefetchQueries: true,
        });
        alert(`Dodavatel byl upraven s parametry: Doručení: ${data.delivery},
            Zabalení do folie: ${data.foil},
            Pojištění: ${data.insurance > 0 ?? 'bez pojištění'},
            Balíček do krabice: ${data.packInBox},
            Vyzvednutí: ${data.pickUp},
            Na dobírku: ${data.sendCashDelivery},
            Štítek přiveze kurýr: ${data.shippingLabel},
            Jméno dopravce: ${data.suppName}
            status of history: ${message.data?.updateHistory?.message}`);
        return router.push(`/../../admpage/${data.supplierId}`);
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
        Nejsi admin!!!!
      </div>
    );
  }
  return (
    <div>
      <div className={styles.container}>
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
              <p className={styles.Odstavce}>Doručení</p>
              <input
                className={styles.inputDate}
                onChange={(e) => statesOfDataSupp.Delivery.set(e.target.value)}
                required
                type="date"
                value={statesOfDataSupp.Delivery.get()}
              />
            </label>
            <label>
              <p className={styles.Odstavce}>Vyzvednutí</p>
              <input
                className={styles.inputDate}
                onChange={(e) => statesOfDataSupp.PickUp.set(e.target.value)}
                required
                type="date"
                value={statesOfDataSupp.PickUp.get()}
              />
            </label>
          </div>
          <h3 className={styles.Nadpisy}>Info dopravce</h3>
          <div className={styles.divinput}>
            <label>
              <p className={styles.Odstavce}>Pojištění</p>
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
            {MyComponent(statesOfDataSupp.SendCashDelivery, 'Na dobírku')}
            {/* <label>
              <p className={styles.Odstavce}>Na dobírku</p>
              {MyComponentSendCash()}
            </label> */}
            {MyComponent(statesOfDataSupp.ShippingLabel, 'Přepravní štítek')}
            {/* <label>
              <p className={styles.Odstavce}>Přepravní štítek</p>
              {MyComponentShippingL()}
            </label> */}
          </div>
          <div className={styles.divinput}>
            {MyComponent(statesOfDataSupp.Foil, 'Folie')}

            {/* <label>
              <p className={styles.Odstavce}>Folie</p>
              {MyComponentFoil()}
            </label> */}
            {MyComponent(statesOfDataSupp.PackInBox, 'Do krabice')}

            {/* <label>
              <p className={styles.Odstavce}>Do krabice</p>
              {MyComponentPackInB()}
            </label> */}
          </div>
          <h3 className={styles.Nadpisy}>Ceny způsobu dopravení/předání</h3>
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
