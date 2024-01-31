import { getAuth } from 'firebase/auth';
import router from 'next/router';
import * as React from 'react';
import { useEffect, useState } from 'react';

import {
  useSuppDataQuery,
  useUpdateHistoryMutation,
  useUpdatePackageMutation,
} from '@/generated/graphql';

import styles from '../../../styles/stylesForm/styleForms.module.css';

type Props = {
  id: string;
};

const Refetch = (data: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  data.refetch();
};

const parseIntReliable = (numArg: string) => {
  const min = 0;
  if (numArg.length > 0) {
    const parsed = Number.parseInt(numArg, 10);
    if (parsed === 0) {
      // eslint-disable-next-line max-depth
      if (numArg.replaceAll('0', '') === '') {
        return 0;
      }
    } else if (Number.isSafeInteger(parsed) && Number(parsed) > min) {
      return parsed;
    }
  }
  return false;
};

export const FormPackageUpdate: React.FC<Props> = ({ id }) => {
  // pouziti loadingu u mutation
  const [kg, SetKg] = React.useState(' ');
  const [cost, SetCost] = React.useState(' ');
  const [oldCost, SetoldCost] = React.useState(' ');
  const [delka, SetDelka] = React.useState(' ');
  const [vyska, SetVyska] = React.useState(' ');
  const [sirka, SetSirka] = React.useState(' ');
  const [packName, SetPackName] = React.useState(' ');
  const [suppId, SetSuppId] = React.useState(' ');

  const [UpdatePackage] = useUpdatePackageMutation();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const [UpdateHistory] = useUpdateHistoryMutation();
  const SuppPackages = useSuppDataQuery();
  const [admin, SetAdmin] = useState(false);
  const [logged, SetLogin] = useState(false);

  useEffect(() => {
    const Admin = process.env.NEXT_PUBLIC_AdminEm;
    const auth = getAuth();
    if (auth.currentUser) {
      SetLogin(true);
    }
    if (auth.currentUser?.email === Admin) {
      SetAdmin(true);
    }
    if (id && SuppPackages.data && SuppPackages) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      SuppPackages.data.suplierData.forEach((item) => {
        // eslint-disable-next-line unicorn/no-negated-condition
        if (item.package) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          item.package.forEach(
            (pack: {
              [name: string]: {
                weight: number;
                height: number;
                width: number;
                Plength: number;
                name_package: string;
                cost: number;
              };
            }) => {
              // jmeno balicku
              const itm = pack[id];
              console.log('itm', itm);
              // eslint-disable-next-line @typescript-eslint/no-for-in-array, guard-for-in
              if (itm) {
                SetKg(itm.weight.toString());
                SetCost(itm.cost.toString());
                SetoldCost(itm.cost.toString());
                SetDelka(itm.Plength.toString());
                SetVyska(itm.height.toString());
                SetSirka(itm.width.toString());
                SetPackName(itm.name_package.toString());
                SetSuppId(item.supplierId.toString());
              }
            },
          );
        }
      });
    }
  }, [id, SuppPackages.data, SuppPackages, logged, admin]);

  const Valid = (
    hmotnostarg: string,
    costarg: string,
    delkaarg: string,
    vyskaarg: string,
    sirkaarg: string,
    // eslint-disable-next-line unicorn/consistent-function-scoping, consistent-return
  ) => {
    if (!parseIntReliable(hmotnostarg)) {
      return new Error('Invalid argument, expext number bigger than 0');
    }

    if (!parseIntReliable(costarg)) {
      return new Error('Invalid argument, expext number bigger than 0');
    }

    if (!parseIntReliable(delkaarg)) {
      return new Error('Invalid argument, expext number bigger than 0');
    }

    if (!parseIntReliable(vyskaarg)) {
      return new Error('Invalid argument, expext number bigger than 0');
    }

    if (!parseIntReliable(sirkaarg)) {
      return new Error('Invalid argument, expext number bigger than 0');
    }
  };

  const handleForm = async (event?: React.FormEvent) => {
    event?.preventDefault();
    const valid = Valid(kg, cost, delka, vyska, sirka)?.message;
    if (valid) {
      alert(valid);
    } else {
      const result = await UpdatePackage({
        variables: {
          Hmotnost: Number(kg),
          Cost: Number(cost),
          Delka: Number(delka),
          Vyska: Number(vyska),
          Sirka: Number(sirka),
          Pack_name: packName,
          PackKey: id,
          SuppId: suppId,
        },
      });

      const err = result.data?.updatePack?.message;
      const data = result.data?.updatePack?.data;

      if (err) {
        alert(err);
      }

      if (data) {
        await UpdateHistory({
          variables: {
            PackageName: packName,
            newPricePack: Number(cost),
            oldPricePack: Number(oldCost),
            SuppId: suppId,
          },
        });
        Refetch(SuppPackages);
        alert(`Balíček byl upraven s parametry: Váha: ${data.weight},
                Délka: ${data.Plength},
                Šířka: ${data.width},
                Výška: ${data.height},
                Označení: ${data.name_package}`);
        return router.push(`/../../admpage/${data.supplier_id}`);
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
          Update package
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
                value={packName}
              />
            </label>
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
          <div className={styles.divinput}>
            <button className={styles.crudbtn} type="submit">
              Upadte
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
