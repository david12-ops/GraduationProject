import { State, useHookstate } from '@hookstate/core';
import { getAuth } from 'firebase/auth';
import router from 'next/router';
import * as React from 'react';
import { useEffect } from 'react';
import Select from 'react-select';

import {
  SuppDataDocument,
  useNewSupplierToFirestoreMutation,
} from '@/generated/graphql';

import styles from '../../../styles/stylesForm/styleForms.module.css';

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
    return true;
  }
  if (!['Ano', 'Ne'].includes(stringnU2)) {
    return true;
  }
  if (!['Ano', 'Ne'].includes(stringnU3)) {
    return true;
  }
  return !['Ano', 'Ne'].includes(stringnU4);
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
    console.log('costs', parseIntReliable(depoCostarg));
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

export const FormSupplier = () => {
  const options = [
    { value: 'Ano', label: 'Ano' },
    { value: 'Ne', label: 'Ne' },
  ];

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
  const [newSupp] = useNewSupplierToFirestoreMutation();

  useEffect(() => {
    const Admin = process.env.NEXT_PUBLIC_AdminEm;
    const auth = getAuth();
    if (auth.currentUser) {
      user.LoggedIn.set(true);
    }
    if (auth.currentUser?.email === Admin) {
      user.Admin.set(true);
    }
  });

  const MyComponent = (state: State<string>, paragraph: string) => {
    return (
      <label>
        <p className={styles.Odstavce}>{paragraph}</p>
        <Select
          className={styles.selectInput}
          onChange={(selectedOption) =>
            state.set(selectedOption ? selectedOption.value : '')
          }
          options={options}
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
      const result = await newSupp({
        variables: {
          SupName: statesOfDataSupp.SupplierName.get(),
          PickUp: statesOfDataSupp.PickUp.get(),
          Delivery: statesOfDataSupp.Delivery.get(),
          Insurance: Number(statesOfDataSupp.Insurance.get()),
          SendCashDelivery: statesOfDataSupp.SendCashDelivery.get(),
          Foil: statesOfDataSupp.Foil.get(),
          ShippingLabel: statesOfDataSupp.ShippingLabel.get(),
          PackInBox: statesOfDataSupp.PackInBox.get(),
          DepoCost: Number(statesOfDataSupp.DepoCost.get()),
          PersonalCost: Number(statesOfDataSupp.PersonalCost.get()),
        },
        refetchQueries: [{ query: SuppDataDocument }],
        awaitRefetchQueries: true,
      }).catch((error: string) => alert(error));

      const err = result?.data?.SupplierToFirestore?.message;
      const data = result?.data?.SupplierToFirestore?.data;

      if (err) {
        alert(err);
      }

      if (data) {
        alert(`Dodavatel byl vytvořen s parametry: Doručení: ${data.delivery},
              Zabalení do folie: ${data.foil},
              Pojištění: ${
                data.insurance > 0 ? data.insurance : 'bez pojištění'
              },
              Balíček do krabice: ${data.packInBox},
              Vyzvednutí: ${data.pickUp},
              Na dobírku: ${data.sendCashDelivery},
              Štítek přiveze kurýr: ${data.shippingLabel},
              Jméno dopravce: ${data.suppName}`);
        return router.push(`/../../admin-page`);
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
          Create supplier
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
                placeholder="Name"
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
              />
            </label>
            <label>
              <p className={styles.Odstavce}>Vyzvednutí</p>
              <input
                className={styles.inputDate}
                onChange={(e) => statesOfDataSupp.PickUp.set(e.target.value)}
                required
                type="date"
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
                placeholder="Kč"
              />
            </label>
          </div>
          <div className={styles.divinput}>
            {MyComponent(statesOfDataSupp.SendCashDelivery, 'Na dobírku')}
            {MyComponent(statesOfDataSupp.ShippingLabel, 'Přepravní štítek')}
          </div>
          <div className={styles.divinput}>
            {MyComponent(statesOfDataSupp.Foil, 'Folie')}
            {MyComponent(statesOfDataSupp.PackInBox, 'Do krabice')}
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
                  placeholder="Kč"
                />
              </label>
            </div>
          </div>
          <div className={styles.divinput}>
            <button className={styles.crudbtn} type="submit">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
