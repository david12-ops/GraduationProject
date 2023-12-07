// eslint-disable-next-line unicorn/filename-case
import router from 'next/router';
import * as React from 'react';
import { useEffect } from 'react';

import {
  usePackageDataQuery,
  useUpdatePackageMutation,
} from '@/generated/graphql';

import styles from '../../../styles/stylesForm/styleForms.module.css';

type Props = {
  id: string;
};

export const FormPackageUpdate: React.FC<Props> = ({ id }) => {
  // upravit ! kod z create form
  // vice se v jednom!
  // fetchnout data
  const [kg, SetKg] = React.useState(' ');
  const [cost, SetCost] = React.useState(' ');
  const [delka, SetDelka] = React.useState(' ');
  const [vyska, SetVyska] = React.useState(' ');
  const [sirka, SetSirka] = React.useState(' ');
  // const [odkud, Setodkud] = React.useState(' ');

  // const [psc_odkud, SetPSC_odkud] = React.useState(' ');
  // const [kam, Setkam] = React.useState(' ');

  // const [psc_kam, SetPSC_kam] = React.useState(' ');
  const [packName, SetPackName] = React.useState(' ');
  const [ActpackName, SetActPackName] = React.useState(' ');

  const [UpdatePackage] = useUpdatePackageMutation();
  const [suppId, SetSuppId] = React.useState(' ');
  // const [suppIdLast, SetLastSuppId] = React.useState(' ');
  const Pack = usePackageDataQuery();
  // const Supp = useSuppDataQuery();
  // validace dat
  // eslint-disable-next-line unicorn/consistent-function-scoping
  // u create a update se chovat k package id u supplier jako array
  // odstraneni baliku ze Supplier jako page s kartami dodavatelu a dropdown menu s baliky kde bude necio jako -
  // validace dat - je
  // validace psc - neni
  // validace adresy - neni
  // string v resolveru
  // const PSCVal = (psc: string) => {
  //   // eslint-disable-next-line unicorn/better-regex
  //   const option = /^[0-9]{3} ?[0-9]{2}/;
  //   if (!option.test(psc)) {
  //     alert('Invalid psc argument');
  //   }
  //   return psc;
  // };

  // Nefunkcni
  // const addressVal = (address: string) => {
  //   // nepodporuje diakritiku!!
  //   // eslint-disable-next-line unicorn/better-regex
  //   const option = /^[A-Z][a-z]+ [0-9]{1,3}, [A-Z][a-z]+$/;
  //   if (!option.test(address)) {
  //     alert('Invalid adress argument');
  //   }
  //   return address;
  // };

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const Convert = (stringToNum: string) => {
    const numberFrString = 0;
    if (!Number.parseInt(stringToNum, numberFrString)) {
      throw new Error('Invalid argument');
    }
    return Number.parseInt(stringToNum, numberFrString);
  };

  // const Options = () => {
  //   const option: Array<{ value: string; label: string }> = [];
  //   Supp?.data?.suplierData.forEach(function (supval) {
  //     option.push({ value: supval.supplierId, label: supval.suppName });
  //   });
  //   return option;
  // };

  // const MyComponent = () => (
  //   <Select
  //     className={styles.selectInput}
  //     onChange={(selectedOption: any) =>
  //       // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call
  //       SetSuppId(selectedOption.value)
  //     }
  //     options={Options()}
  //     required
  //     placeholder={
  //       Supp.data?.suplierData.find((item) => item.supplierId === suppId)
  //         ?.suppName
  //     }
  //   />
  // );

  useEffect(() => {
    if (id && Pack.data && Pack) {
      const actualPack = Pack.data.packageData.find(
        (actPack) => actPack.packgeId === id,
      );

      // predavame stejne jmena
      if (actualPack) {
        SetKg(actualPack.hmotnost?.toString());
        SetCost(actualPack.costPackage?.toString());
        SetDelka(actualPack.delka?.toString());
        SetVyska(actualPack.vyska?.toString());
        SetSirka(actualPack.sirka?.toString());
        // Setodkud(actualPack.odkud);
        // SetPSC_odkud(actualPack.Podkud);
        // Setkam(actualPack.kam);
        // SetPSC_kam(actualPack.Pkam);
        SetActPackName(actualPack.packName);
        SetPackName(actualPack.packName);
        // SetLastSuppId(actualPack.supplierId);
        SetSuppId(actualPack.supplierId);
      }
    }
  }, [id, Pack.data]);

  const GetData = () => {
    const i = Pack.data?.packageData.find(
      (pack) => pack.packgeId === id,
    )?.packgeId;
    alert(i);
  };

  const handleForm = async (event: React.FormEvent) => {
    // lepsi informovani o chybe
    // route push po formu
    // kontrola zda oznaci nez klikne
    event.preventDefault();
    // Mutation
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const updateVal = await UpdatePackage({
      variables: {
        Hmotnost: Convert(kg),
        Cost: Convert(cost),
        Delka: Convert(delka),
        Vyska: Convert(vyska),
        Sirka: Convert(sirka),
        // Odkud: addressVal(odkud),
        // PSC_odkud: PSCVal(psc_odkud),
        // Kam: addressVal(kam),
        // PSC_kam: PSCVal(psc_kam),
        Pack_name: packName,
        ActPackName: ActpackName,
        PackId: id,
        // SuppId: suppId,
        // lastSuppId: suppIdLast,
      },
    });
    // vracet s resolveru suppid
    // zpetne zjisteni supp id
    if (updateVal.errors) {
      alert(`Balíček nebyl změněn, ${updateVal.errors}`);
    } else {
      return router.push(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        `/../../admpage/${suppId}`,
      );
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
          Update package
        </h1>
        <form onSubmit={handleForm} className={styles.form}>
          {/* <hr> */}
          <div className={styles.divinput}>
            <label>
              <p className={styles.Odstavce}>Package name</p>
              <input
                className={styles.input}
                onChange={(e) => SetPackName(e.target.value)}
                required
                type="text"
                placeholder={ActpackName}
              />
            </label>
            {/* <label>
              <p className={styles.Odstavce}>Dodavatel</p>
              {MyComponent()}
            </label> */}
            <label>
              <p className={styles.Odstavce}>Cena</p>
              <input
                className={styles.input}
                onChange={(e) => SetCost(e.target.value)}
                required
                type="number"
                placeholder="Kč"
                value={cost}
              />
            </label>
          </div>
          <h3 className={styles.Nadpisy}>Parametry baliku</h3>
          <div className={styles.divinput}>
            <label>
              <p className={styles.Odstavce}>Sirka</p>
              <input
                className={styles.input}
                onChange={(e) => SetSirka(e.target.value)}
                required
                type="number"
                placeholder="Cm"
                value={sirka}
              />
            </label>
            <label>
              <p className={styles.Odstavce}>Hmotnost</p>
              <input
                className={styles.input}
                onChange={(e) => SetKg(e.target.value)}
                required
                type="number"
                placeholder="Kg"
                value={kg}
              />
            </label>
          </div>
          <div className={styles.divinput}>
            <label>
              <p className={styles.Odstavce}>Delka</p>
              <input
                className={styles.input}
                onChange={(e) => SetDelka(e.target.value)}
                required
                type="number"
                placeholder="Cm"
                value={delka}
              />
            </label>
            <label>
              <p className={styles.Odstavce}>Vyska</p>
              <input
                className={styles.input}
                onChange={(e) => SetVyska(e.target.value)}
                required
                type="number"
                placeholder="Cm"
                value={vyska}
              />
            </label>
          </div>
          {/* <h3 className={styles.Nadpisy}>Adresa dovozci</h3>
          <div className={styles.divinput}>
            <label>
              <p className={styles.Odstavce}>Kam</p>
              <input
                className={styles.input}
                onChange={(e) => Setkam(e.target.value)}
                required
                type="text"
                placeholder="Ulice popis. číslo, Město" // format adresy
                value={kam}
              />
            </label>
            <label>
              <p className={styles.Odstavce}>PSČ</p>
              <input
                className={styles.input}
                onChange={(e) => SetPSC_kam(e.target.value)}
                required
                type="text"
                placeholder="92732/927 32" // format psc
                value={psc_kam}
              />
            </label>
            <label>
              <p className={styles.Odstavce}>Odkud</p>
              <input
                className={styles.input}
                onChange={(e) => Setodkud(e.target.value)}
                required
                type="text"
                placeholder="Ulice popis. číslo, Město"
                value={odkud}
              />
            </label>
            <label>
              <p className={styles.Odstavce}>PSČ</p>
              <input
                className={styles.input}
                onChange={(e) => SetPSC_odkud(e.target.value)}
                required
                type="text"
                placeholder="92732/927 32" // format psc
                value={psc_odkud}
              />
            </label>
          </div> */}
          <div className={styles.divinput}>
            {' '}
            <button
              onClick={handleForm}
              className={styles.crudbtn}
              type="submit"
            >
              Upadte
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
