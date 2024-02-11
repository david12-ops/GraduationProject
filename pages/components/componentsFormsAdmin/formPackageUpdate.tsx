import { State, useHookstate } from '@hookstate/core';
import { getAuth } from 'firebase/auth';
import router from 'next/router';
import * as React from 'react';
import { useEffect } from 'react';

import {
  HistoryDataDocument,
  SuppDataDocument,
  SuppDataQuery,
  useSuppDataQuery,
  useUpdateHistoryMutation,
  useUpdatePackageMutation,
} from '@/generated/graphql';

import styles from '../../../styles/stylesForm/styleForms.module.css';

type Props = {
  id: string;
};

type Item = SuppDataQuery['suplierData'];

const parseIntReliable = (numArg: string) => {
  if (numArg.length > 0) {
    const parsed = Number.parseInt(numArg, 10);
    if (parsed < 0) {
      // if (numArg.replaceAll('0', '') === '') {
      //   return 0;
      // }
      return parsed;
    }
    if (Number.isSafeInteger(parsed) && parsed) {
      return parsed;
    }
  }
  return false;
};

const getOldCostFromPack = (pId: string, data: Item): number => {
  let cost = 0;
  data.forEach((item) => {
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
          const itm = pack[pId];
          if (itm) {
            cost = itm.cost;
          }
        },
      );
    }
  });

  return cost;
};

const setDataDatabase = (
  pId: string,
  data: Item,
  stateSeter: State<{
    Weight: string;
    Cost: string;
    Plength: string;
    Height: string;
    Width: string;
    PackName: string;
    SuppId: string;
  }>,
) => {
  // eslint-disable-next-line no-unreachable-loop
  data.forEach((item) => {
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
          const itm = pack[pId];
          if (itm) {
            stateSeter.set({
              SuppId: item.supplierId.toString(),
              PackName: itm.name_package.toString(),
              Cost: itm.cost.toString(),
              Plength: itm.Plength.toString(),
              Weight: itm.weight.toString(),
              Width: itm.width.toString(),
              Height: itm.height.toString(),
            });
          }
        },
      );
    }
  });
};

export const FormPackageUpdate: React.FC<Props> = ({ id }) => {
  const statesOfDataPack = useHookstate({
    Weight: '',
    Cost: '',
    Plength: ' ',
    Height: '',
    Width: '',
    PackName: '',
    SuppId: '',
  });

  const [oldCost, SetOldCost] = React.useState(0);

  // const setd = React.useCallback((nwValue) => console.log(nwValue), [2]);

  const user = useHookstate({ Admin: false, LoggedIn: false });

  const [UpdatePackage] = useUpdatePackageMutation();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const [UpdateHistory] = useUpdateHistoryMutation();
  const SuppPackages = useSuppDataQuery();

  useEffect(() => {
    const Admin = process.env.NEXT_PUBLIC_AdminEm;
    const auth = getAuth();
    if (auth.currentUser) {
      user.LoggedIn.set(true);
    }
    if (auth.currentUser?.email === Admin) {
      user.Admin.set(true);
    }
    if (id && SuppPackages.data && SuppPackages) {
      setDataDatabase(id, SuppPackages.data.suplierData, statesOfDataPack);

      // setnout cenu
      const costP = getOldCostFromPack(id, SuppPackages.data.suplierData);
      if (costP) {
        SetOldCost(costP);
      }
    }
  }, [id, SuppPackages]);

  const Valid = (
    weightarg: string,
    costarg: string,
    pLemgtharg: string,
    heightarg: string,
    widtharg: string,
    // eslint-disable-next-line unicorn/consistent-function-scoping, consistent-return
  ) => {
    if (
      !parseIntReliable(weightarg) ||
      !parseIntReliable(costarg) ||
      !parseIntReliable(pLemgtharg) ||
      !parseIntReliable(heightarg) ||
      !parseIntReliable(widtharg)
    ) {
      return new Error('Invalid argument');
    }
  };

  const handleForm = async (event?: React.FormEvent) => {
    event?.preventDefault();
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
      const result = await UpdatePackage({
        variables: {
          Hmotnost: Number(statesOfDataPack.Weight.get()),
          Cost: Number(statesOfDataPack.Cost.get()),
          Delka: Number(statesOfDataPack.Plength.get()),
          Vyska: Number(statesOfDataPack.Height.get()),
          Sirka: Number(statesOfDataPack.Width.get()),
          Pack_name: statesOfDataPack.PackName.get(),
          PackKey: id,
          SuppId: statesOfDataPack.SuppId.get(),
        },
        refetchQueries: [{ query: SuppDataDocument }],
        awaitRefetchQueries: true,
      });

      const err = result.data?.updatePack?.message;
      const data = result.data?.updatePack?.data;

      if (err) {
        alert(err);
      }

      if (data) {
        console.log('stara cena', oldCost);
        // zatim neni funkcni
        const message = await UpdateHistory({
          variables: {
            PackageName: statesOfDataPack.PackName.get(),
            newPricePack: Number(statesOfDataPack.Cost.get()),
            oldPricePack: oldCost,
            SuppId: statesOfDataPack.SuppId.get(),
          },
          refetchQueries: [{ query: HistoryDataDocument }],
          awaitRefetchQueries: true,
        });
        alert(`Balíček byl upraven s parametry: Váha: ${data.weight},
              Délka: ${data.Plength},
              Šířka: ${data.width},
              Výška: ${data.height},
              Označení: ${data.name_package}
              status of history: ${message.data?.updateHistory?.message}`);
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
          Update package
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
                value={statesOfDataPack.PackName.get()}
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
                value={statesOfDataPack.Cost.get()}
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
                value={statesOfDataPack.Width.get()}
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
                value={statesOfDataPack.Weight.get()}
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
                value={statesOfDataPack.Plength.get()}
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
                value={statesOfDataPack.Height.get()}
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
