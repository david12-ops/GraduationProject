/* eslint-disable prettier/prettier */
// eslint-disable-next-line unicorn/filename-case
import router from 'next/router';
import * as React from 'react';
import { useEffect } from 'react';
import Select from 'react-select';

import {
  useSuppDataQuery,
  useUpdateSupplierMutation,
} from '@/generated/graphql';

import styles from '../../../styles/stylesForm/styleForms.module.css';

type Props = {
  id: string;
};

// Upravit update ohledne jmena
// kontrola na ano, ne funguje
// datum - funkcní
// insurance - funkcní
// nefunguje kontrola na regex u jmena
// udelat kontroly i na frontend - pozivani graphql erroru
// refetche query!!!

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

const IsNumber = (
  // kontrola na zaporne hodnoty - je
  stringToNum: string,
) => {
  // eslint-disable-next-line sonarjs/prefer-single-boolean-return
  if(Number.isSafeInteger(stringToNum) || Number(stringToNum) >= 0 && Number(stringToNum) <= Number.MAX_SAFE_INTEGER) {return true}
  return false
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

export const FormSupplierUpdate: React.FC<Props> = ({ id }) => {
  const options = [
    { value: 'Ano', label: 'Ano' },
    { value: 'Ne', label: 'Ne' },
  ];

  const [SDelivery, SetDelivery] = React.useState(' ');
  const [SSendCashDelivery, SetsendCashDelivery] = React.useState('');
  const [SPackInBox, SetPackInBox] = React.useState('');
  const [PickUp, SetPickUp] = React.useState('');
  const [SInsurance, SetInsurance] = React.useState("");
  const [SShippingLabel, SetShippingLabel] = React.useState('');
  const [SFoil, SetFoil] = React.useState('');
  const [SsuppId, SetSsuppId] = React.useState('');
  const [SupplierName, SetSupplierName] = React.useState('');
  const [ActualSupplierName, SetASupplierName] = React.useState('');

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const supData = useSuppDataQuery();
  const [UpdateSupp] = useUpdateSupplierMutation();
  // validace dat
  // eslint-disable-next-line unicorn/consistent-function-scoping
  useEffect(() => {
    if (id && supData.data && supData) {
      const actualSupp = supData.data?.suplierData.find(
        (actSupp) => actSupp.supplierId === id,
      );

      // const dateString = actualSupp?.pickUp;
      // const parts = dateString.split('.');
      // const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

      if (actualSupp) {
        SetSsuppId(actualSupp.supplierId.toString());
        SetDelivery(actualSupp.delivery.toString());
        SetsendCashDelivery(actualSupp.sendCashDelivery.toString());
        // potize s formatem datumu
        SetPackInBox(actualSupp.packInBox.toString());
        SetPickUp(actualSupp.pickUp.toString());
        SetInsurance(actualSupp.insurance.toString());
        SetShippingLabel(actualSupp.shippingLabel.toString());
        SetSupplierName(actualSupp.suppName.toString());
        SetASupplierName(actualSupp.suppName.toString());
      }
    }
  }, [id, supData.data]);

  const Valid = (
    pickUparg: string,
    Deliveryarg: string,
    Insurancearg: string,
    SendCashDeliveryarg: string,
    Foilarg: string,
    ShippingLabelarg: string,
    packInBoxarg: string,
    // eslint-disable-next-line unicorn/consistent-function-scoping, consistent-return
  ) => {
    if (!IsNumber(Insurancearg)) {
      return new Error('Invalid argument, expext number');
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

  const MyComponentFoil = () => (
    <Select
      className={styles.selectInput}
      onChange={(selectedOption: any) => SetFoil(selectedOption.value)}
      options={options}
      required
      placeholder={SFoil === 'Ano' ? 'Ano' : 'Ne'}
    />
  );

  const MyComponentSendCash = () => (
    <Select
      className={styles.selectInput}
      onChange={(selectedOption: any) =>
        SetsendCashDelivery(selectedOption.value)
      }
      options={options}
      placeholder={SSendCashDelivery === 'Ano' ? 'Ano' : 'Ne'}
      required
    />
  );

  const MyComponentPackInB = () => (
    <Select
      className={styles.selectInput}
      onChange={(selectedOption: any) => SetPackInBox(selectedOption.value)}
      options={options}
      placeholder={SPackInBox === 'Ano' ? 'Ano' : 'Ne'}
      required
    />
  );

  const MyComponentShippingL = () => (
    <Select
      className={styles.selectInput}
      onChange={(selectedOption: any) => SetShippingLabel(selectedOption.value)}
      options={options}
      placeholder={SShippingLabel === 'Ano' ? 'Ano' : 'Ne'}
      required
    />
  );

  const handleForm = async (event: React.FormEvent) => {
    // Apolo exepciton/error - bad return of vlaue from field
    event.preventDefault();

    const valid = Valid(
      PickUp,
      SDelivery,
      SInsurance.toString(),
      SSendCashDelivery,
      SFoil,
      SShippingLabel,
      SPackInBox,
    )?.message;
    if (valid) {
      alert(valid);
    } else {
      await UpdateSupp({
        variables: {
          SupName: SupplierName,
          Delivery: SDelivery,
          pickUp: PickUp,
          ShippingLabel: SShippingLabel,
          Foil: SFoil,
          Insurance: Number(SInsurance),
          SendCashDelivery: SSendCashDelivery,
          packInBox: SPackInBox,
          SuppId: SsuppId,
          ActNameSupp: ActualSupplierName,
        },
      })
        // eslint-disable-next-line consistent-return
        .then((result) => {
          const err = result.data?.updateSup?.message;
          const data = result.data?.updateSup?.data;

          console.log(data);
          // eslint-disable-next-line promise/always-return
          if (data) {
            alert(`Dodavatel byl vytvořen s parametry: Doručení: ${
              data.delivery
            },
              Zabalení do folie: ${data.foil},
              Pojištění: ${data.insurance > 0 ?? 'bez pojištění'},
              Balíček do krabice: ${data.packInBox},
              Vyzvednutí: ${data.pickUp},
              Na dobírku: ${data.sendCashDelivery},
              Štítek přiveze kurýr: ${data.shippingLabel},
              Jméno dopravce: ${data.suppName}`);
            return router.push(`/../../admpage/${data.supplierId}`);
          }
          alert(err);
        })
        .catch((error) => {
          alert(error);
        });
    }
  };

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
                onChange={(e) => SetSupplierName(e.target.value)}
                required
                type="text"
                placeholder={SupplierName}
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
                // neupravuje se
                placeholder={PickUp}
              />
            </label>
            <label>
              <p className={styles.Odstavce}>Vyzvednutí</p>
              <input
                className={styles.inputDate}
                onChange={(e) => SetPickUp(e.target.value)}
                required
                type="date"
                placeholder={SDelivery}
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
                value={SInsurance}
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
