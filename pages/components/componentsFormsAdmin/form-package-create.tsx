import { useHookstate } from '@hookstate/core';
import { getAuth } from 'firebase/auth';
import router from 'next/router';
import * as React from 'react';
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import {
  SuppDataDocument,
  useNewPackageToFirestoreMutation,
} from '@/generated/graphql';

import styles from '../../../styles/stylesForm/styleForms.module.css';

type Props = {
  id: string;
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

  return parsed !== false && parsed > min;
};

const Valid = (
  weightarg: string,
  costarg: string,
  pLemgtharg: string,
  heightarg: string,
  widtharg: string,
) => {
  if (
    !isInt(weightarg, 0) ||
    !isInt(costarg, 0) ||
    !isInt(pLemgtharg, 0) ||
    !isInt(heightarg, 0) ||
    !isInt(widtharg, 0)
  ) {
    return new Error('Invalid argument');
  }
};

export const FormPackage: React.FC<Props> = ({ id }) => {
  const statesOfDataPack = useHookstate({
    Weight: '',
    Cost: '',
    Plength: ' ',
    Height: '',
    Width: '',
    PackName: '',
  });

  // const setd = React.useCallback((nwValue) => console.log(nwValue), [2]);

  const user = useHookstate({ Admin: false, LoggedIn: false });

  const [newPackage] = useNewPackageToFirestoreMutation();

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

  const handleForm = async (event?: React.FormEvent) => {
    event?.preventDefault();
    const pID = uuidv4();
    const valid = Valid(
      statesOfDataPack.Weight.get(),
      statesOfDataPack.Cost.get(),
      statesOfDataPack.Plength.get(),
      statesOfDataPack.Height.get(),
      statesOfDataPack.Width.get(),
    )?.message;
    if (valid) {
      alert(valid);
    } else {
      const result = await newPackage({
        variables: {
          Weight: Number(statesOfDataPack.Weight.get()),
          Cost: Number(statesOfDataPack.Cost.get()),
          Length: Number(statesOfDataPack.Plength.get()),
          Height: Number(statesOfDataPack.Height.get()),
          Width: Number(statesOfDataPack.Width.get()),
          Pack_name: statesOfDataPack.PackName.get(),
          SuppID: id,
          PackId: pID,
        },
        refetchQueries: [{ query: SuppDataDocument }],
        awaitRefetchQueries: true,
      });

      const err = result.data?.PackageToFirestore?.message;
      const data = result.data?.PackageToFirestore?.data;

      if (err) {
        alert(err);
      }

      if (data) {
        alert(`Balíček byl vytvořen s parametry: Váha: ${data.weight},
            Délka: ${data.Plength},
            Šířka: ${data.width},
            Výška: ${data.height},
            Označení: ${data.name_package}`);
        return router.push(`/../../admpage/${data.supplier_id}`);
      }
    }
  };

  if (!user.LoggedIn.get() || !user.Admin.get()) {
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
          Create package
        </h1>
        <form onSubmit={handleForm} className={styles.form}>
          <div className={styles.divinput}>
            <label>
              <p className={styles.Odstavce}>Name</p>
              <input
                className={styles.input}
                onChange={(e) => statesOfDataPack.PackName.set(e.target.value)}
                required
                type="text"
                placeholder="Name"
              />
            </label>
            <label>
              <p className={styles.Odstavce}>Cena</p>
              <input
                className={styles.input}
                onChange={(e) => statesOfDataPack.Cost.set(e.target.value)}
                required
                type="number"
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
                onChange={(e) => statesOfDataPack.Width.set(e.target.value)}
                required
                type="number"
                placeholder="Cm"
              />
            </label>
            <label>
              <p className={styles.Odstavce}>Hmotnost</p>
              <input
                className={styles.input}
                onChange={(e) => statesOfDataPack.Weight.set(e.target.value)}
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
                onChange={(e) => statesOfDataPack.Plength.set(e.target.value)}
                required
                type="number"
                placeholder="Cm"
              />
            </label>
            <label>
              <p className={styles.Odstavce}>Vyska</p>
              <input
                className={styles.input}
                onChange={(e) => statesOfDataPack.Height.set(e.target.value)}
                required
                type="number"
                placeholder="Cm"
              />
            </label>
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
