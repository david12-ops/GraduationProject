/* eslint-disable max-depth */
import { getAuth } from 'firebase/auth';
import router from 'next/router';
import * as React from 'react';
import { useEffect, useState } from 'react';
import Select from 'react-select';

import {
  useNewSupplierToFirestoreMutation,
  useSuppDataQuery,
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
  const min = 1;
  if (numArg.length > 0) {
    const parsed = Number.parseInt(numArg, 10);
    if (parsed === 0) {
      if (numArg.replaceAll('0', '') === '') {
        return 0;
      }
    } else if (Number.isSafeInteger(parsed) && Number(parsed) > min) {
      return parsed;
    }
  }
  return false;
};

const ValidDateForm = (dateU1: any) => {
  // eslint-disable-next-line no-constant-condition, @typescript-eslint/no-unsafe-argument
  const option = /^\d{4}(?:-\d{1,2}){2}$/;
  // eslint-disable-next-line sonarjs/prefer-single-boolean-return
  if (!option.test(dateU1)) {
    return false;
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return true;
};

const Refetch = (data: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  data.refetch();
};

export const FormSupplier = () => {
  const options = [
    { value: 'Ano', label: 'Ano' },
    { value: 'Ne', label: 'Ne' },
  ];

  const [SDelivery, SetDelivery] = React.useState(' ');
  const [SSendCashDelivery, SetsendCashDelivery] = React.useState(' ');
  const [SPackInBox, SetPackInBox] = React.useState('');
  const [PickUp, SetPickUp] = React.useState('');
  const [SInsurance, SetInsurance] = React.useState('');
  const [SShippingLabel, SetShippingLabel] = React.useState('');
  const [SFoil, SetFoil] = React.useState('');
  const [SupplierName, SetSupplierName] = React.useState(' ');
  const [newSupp] = useNewSupplierToFirestoreMutation();
  const supData = useSuppDataQuery();
  const [admin, SetAdmin] = useState(false);
  const [logged, SetLogin] = useState(false);
  const [depoCost, SetDepoCost] = React.useState('');
  const [personalCost, SetPersonalCost] = React.useState('');

  useEffect(() => {
    const Admin = process.env.NEXT_PUBLIC_AdminEm;
    const auth = getAuth();
    if (auth.currentUser) {
      SetLogin(true);
    }
    if (auth.currentUser?.email === Admin) {
      SetAdmin(true);
    }
  }, [logged, admin]);

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
    // eslint-disable-next-line unicorn/consistent-function-scoping, consistent-return
  ) => {
    if (!parseIntReliable(Insurancearg)) {
      return new Error('Invalid argument, expext number bigger than 0');
    }

    if (!parseIntReliable(depoCostarg)) {
      return new Error('Invalid argument, expext number bigger than 0');
    }

    if (!parseIntReliable(personalCostarg)) {
      return new Error('Invalid argument, expext number bigger than 0');
    }

    // eslint-disable-next-line sonarjs/prefer-single-boolean-return
    if (
      IsYesOrNo(SendCashDeliveryarg, Foilarg, ShippingLabelarg, packInBoxarg)
    ) {
      return new Error('Provided data is not in valid format (Ano/Ne)');
    }

    // eslint-disable-next-line sonarjs/prefer-single-boolean-return
    if (!ValidDateForm(Deliveryarg) || !ValidDateForm(pickUparg)) {
      return new Error('Date is not valid');
    }
  };

  // const MyComponent = (onChangeS: any) => (
  //   <Select
  //     className={styles.selectInput}
  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  //     onChange={(e: any) => onChangeS(e.target.value)}
  //     options={options}
  //     required
  //   />
  // );

  // match-sorter

  const MyComponentFoil = () => (
    <Select
      className={styles.selectInput}
      onChange={(selectedOption: any) => SetFoil(selectedOption.value)}
      options={options}
      placeholder={'Ano/Ne'}
      required
    />
  );

  const MyComponentSendCash = () => (
    <Select
      className={styles.selectInput}
      onChange={(selectedOption: any) =>
        SetsendCashDelivery(selectedOption.value)
      }
      options={options}
      placeholder={'Ano/Ne'}
      required
    />
  );

  const MyComponentPackInB = () => (
    <Select
      className={styles.selectInput}
      onChange={(selectedOption: any) => SetPackInBox(selectedOption.value)}
      options={options}
      placeholder={'Ano/Ne'}
      required
    />
  );

  const MyComponentShippingL = () => (
    <Select
      className={styles.selectInput}
      onChange={(selectedOption: any) => SetShippingLabel(selectedOption.value)}
      options={options}
      placeholder={'Ano/Ne'}
      required
    />
  );

  const handleForm = async (event: React.FormEvent) => {
    event.preventDefault();
    const valid = Valid(
      PickUp,
      SDelivery,
      SInsurance.toString(),
      SSendCashDelivery,
      SFoil,
      SShippingLabel,
      SPackInBox,
      depoCost,
      personalCost,
    )?.message;
    if (valid) {
      alert(valid);
    } else {
      const result = await newSupp({
        variables: {
          SupName: SupplierName,
          pickUp: PickUp,
          Delivery: SDelivery,
          Insurance: Number(SInsurance),
          SendCashDelivery: SSendCashDelivery,
          Foil: SFoil,
          ShippingLabel: SShippingLabel,
          packInBox: SPackInBox,
          DepoCost: Number(depoCost),
          PersonalCost: Number(personalCost),
        },
      });

      const err = result.data?.SupplierToFirestore?.message;
      const data = result.data?.SupplierToFirestore?.data;

      if (err) {
        alert(err);
      }

      if (data) {
        Refetch(supData);
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

  if (!logged || !admin) {
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
                onChange={(e) => SetSupplierName(e.target.value)}
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
                onChange={(e) => SetDelivery(e.target.value)}
                required
                type="date"
              />
            </label>
            <label>
              <p className={styles.Odstavce}>Vyzvednutí</p>
              <input
                className={styles.inputDate}
                onChange={(e) => SetPickUp(e.target.value)}
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
                onChange={(e) => SetInsurance(e.target.value)}
                required
                type="number"
                placeholder="Kč"
              />
            </label>
          </div>
          <div className={styles.divinput}>
            <label>
              <p className={styles.Odstavce}>Na dobírku</p>
              {MyComponentSendCash()}
            </label>
            <label>
              <p className={styles.Odstavce}>Přepravní štítek</p>
              {MyComponentShippingL()}
            </label>
          </div>
          <div className={styles.divinput}>
            <label>
              <p className={styles.Odstavce}>Folie</p>
              {MyComponentFoil()}
            </label>
            <label>
              <p className={styles.Odstavce}>Do krabice</p>
              {MyComponentPackInB()}
            </label>
          </div>
          <h3 className={styles.Nadpisy}>Ceny způsobu dopravení/předání</h3>
          <div className={styles.divinput}>
            <div className={styles.divinput}>
              <label>
                <p className={styles.Odstavce}>Depo</p>
                <input
                  className={styles.inputForSupp}
                  onChange={(e) => SetDepoCost(e.target.value)}
                  required
                  type="number"
                  value={depoCost}
                  placeholder="Kč"
                />
              </label>
            </div>
            <div className={styles.divinput}>
              <label>
                <p className={styles.Odstavce}>Personal</p>
                <input
                  className={styles.inputForSupp}
                  onChange={(e) => SetPersonalCost(e.target.value)}
                  required
                  type="number"
                  value={personalCost}
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
