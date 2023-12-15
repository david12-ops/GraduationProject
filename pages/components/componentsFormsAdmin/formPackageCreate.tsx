// eslint-disable-next-line unicorn/filename-case
import router from 'next/router';
import * as React from 'react';

import { useNewPackageToFirestoreMutation } from '@/generated/graphql';

import styles from '../../../styles/stylesForm/styleForms.module.css';

type Props = {
  id: string;
};
// Validovat jako u updat supplier
const Convert = (stringToNum: string) => {
  const numberFrString = 0;
  if (!Number.parseInt(stringToNum, numberFrString)) {
    alert('Invalid number argument');
  }
  return Number.parseInt(stringToNum, numberFrString);
};

export const FormPackage: React.FC<Props> = ({ id }) => {
  // vice se v jednom!
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
  // const [suppId, SetSuppId] = React.useState(' ');
  const [newPackage, error] = useNewPackageToFirestoreMutation();
  // const Supp = useSuppDataQuery();

  // validace dat - je

  // validace psc - neni
  // validace adresy - neni
  // string v resolveru
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const PSCVal = (psc: string) => {
    // eslint-disable-next-line unicorn/better-regex
    const option = /^[0-9]{3} ?[0-9]{2}/;
    if (!option.test(psc)) {
      alert('Invalid psc argument');
    }
    return psc;
  };

  // Nefunkcni
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const addressVal = (address: string) => {
    // nepodporuje diakritiku!!
    // eslint-disable-next-line unicorn/better-regex
    const option = /^[A-Z][a-z]+ [0-9]{1,3}, [A-Z][a-z]+$/;
    if (!option.test(address)) {
      alert('Invalid adress argument');
    }
    return address;
  };

  const handleForm = async (event: React.FormEvent) => {
    event.preventDefault();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const packd = await newPackage({
      variables: {
        Hmotnost: Convert(kg),
        Cost: Convert(cost),
        Delka: Convert(delka),
        Vyska: Convert(vyska),
        Sirka: Convert(sirka),
        Pack_name: packName,
        SuppID: id,
      },
    });
    if (packd.data?.PackageToFirestore?.error) {
      // pri vytvareni supp pridelovat id supp = id document
      // prace s errory
      const message = packd.data?.PackageToFirestore?.error.toString();
      alert(`${message} `);
    } else {
      const message = 'Balíček byl vytvořen';
      alert(`${message}`);
      return router.push(`/../admpage/${id}`);
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
          Create package
        </h1>
        <form onSubmit={handleForm} className={styles.form}>
          <div className={styles.divinput}>
            <label>
              <p className={styles.Odstavce}>Name</p>
              <input
                className={styles.input}
                onChange={(e) => SetPackName(e.target.value)}
                required
                type="text"
                placeholder="Name"
              />
            </label>
            <label>
              <p className={styles.Odstavce}>Cena</p>
              <input
                className={styles.input}
                onChange={(e) => SetCost(e.target.value)}
                required
                type="text"
                placeholder="Kč"
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
              />
            </label>
          </div>
          <div className={styles.divinput}>
            <button
              onClick={handleForm}
              className={styles.crudbtn}
              type="submit"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
