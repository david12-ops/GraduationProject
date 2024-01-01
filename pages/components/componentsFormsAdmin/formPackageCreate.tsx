// eslint-disable-next-line unicorn/filename-case
import router from 'next/router';
import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';

import { useNewPackageToFirestoreMutation } from '@/generated/graphql';

import styles from '../../../styles/stylesForm/styleForms.module.css';

// není validace cisel na frontendu

type Props = {
  id: string;
};

export const FormPackage: React.FC<Props> = ({ id }) => {
  const [kg, SetKg] = React.useState(' ');
  const [cost, SetCost] = React.useState(' ');
  const [delka, SetDelka] = React.useState(' ');
  const [vyska, SetVyska] = React.useState(' ');
  const [sirka, SetSirka] = React.useState(' ');
  const [packName, SetPackName] = React.useState(' ');
  const [newPackage] = useNewPackageToFirestoreMutation();

  // eslint-disable-next-line consistent-return
  const handleForm = async (event?: React.FormEvent) => {
    const pID = uuidv4();

    event?.preventDefault();
    const result: any = await newPackage({
      variables: {
        Hmotnost: Number(kg),
        Cost: Number(cost),
        Delka: Number(delka),
        Vyska: Number(vyska),
        Sirka: Number(sirka),
        Pack_name: packName,
        SuppID: id,
        PackId: pID,
      },
    })
      .then((res) => {
        return res;
      })
      .catch((error: string) => {
        return { err: error };
      });

    const err = result.data?.PackageToFirestore?.message;
    const data = result.data?.PackageToFirestore?.data;

    if (result.err) {
      return alert(result.err);
    }
    // eslint-disable-next-line no-lonely-if, max-depth
    if (data) {
      alert(`Balíček byl vytvořen s parametry: Váha: ${data.weight},
            Délka: ${data.Plength},
            Šířka: ${data.width},
            Výška: ${data.height},
            Označení: ${data.name_package}`);
      return router.push(`/../../admpage/${data.supplier_id}`);
      // eslint-disable-next-line no-else-return
    } else {
      // eslint-disable-next-line max-depth, no-lonely-if
      if (err === 'Duplicate id') {
        await handleForm();
      } else {
        return alert(err);
      }
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
