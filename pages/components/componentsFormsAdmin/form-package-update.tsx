import { useHookstate } from '@hookstate/core';
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

type DataFrServer = {
  SuppId: string;
  PackName: string;
  Cost: string;
  Plength: string;
  Weight: string;
  Width: string;
  Height: string;
};

type UpdatedPack = {
  weight: number;
  cost: number;
  Plength: number;
  height: number;
  width: number;
  name_package: string;
  supplier_id: string;
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

const setDataDatabase = (pId: string, data: Item): DataFrServer | undefined => {
  type Package = {
    [name: string]: {
      weight: number;
      height: number;
      width: number;
      Plength: number;
      name_package: string;
      cost: number;
    };
  };

  for (const item of data) {
    const packs: Array<Package> = item.package as Array<Package>;
    for (const pack of packs) {
      const itm = pack[pId];
      // eslint-disable-next-line max-depth
      if (itm) {
        return {
          SuppId: item.supplierId,
          PackName: itm.name_package,
          Cost: itm.cost.toString(),
          Plength: itm.Plength.toString(),
          Weight: itm.weight.toString(),
          Width: itm.width.toString(),
          Height: itm.height.toString(),
        };
      }
    }
  }
  return undefined;
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

  // const setd = React.useCallback((nwValue) => console.log(nwValue), [2]);

  const user = useHookstate({ Admin: false, LoggedIn: false });

  const [UpdatePackage] = useUpdatePackageMutation();

  const [UpdateHistory] = useUpdateHistoryMutation();
  const SuppPackages = useSuppDataQuery();
  const [oldPackName, SetOldPackName] = React.useState('');

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
      const data = setDataDatabase(id, SuppPackages.data.suplierData);
      if (data) {
        SetOldPackName(data.PackName);
        statesOfDataPack.set({
          SuppId: data.SuppId,
          PackName: data.PackName,
          Cost: data.Cost,
          Plength: data.Plength,
          Weight: data.Weight,
          Width: data.Width,
          Height: data.Height,
        });
      }
    }
  }, [id, SuppPackages]);

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

    return undefined;
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
          Weight: Number(statesOfDataPack.Weight.get()),
          Cost: Number(statesOfDataPack.Cost.get()),
          Length: Number(statesOfDataPack.Plength.get()),
          Height: Number(statesOfDataPack.Height.get()),
          Width: Number(statesOfDataPack.Width.get()),
          Pack_name: statesOfDataPack.PackName.get(),
          PackKey: id,
          SuppId: statesOfDataPack.SuppId.get(),
        },
        refetchQueries: [{ query: SuppDataDocument }],
        awaitRefetchQueries: true,
      }).catch((error: string) => alert(error));

      const err = result?.data?.updatePack?.message;
      const data: UpdatedPack = result?.data?.updatePack?.data;

      if (err) {
        alert(err);
      }

      if (data) {
        const message = await UpdateHistory({
          variables: {
            PackageName: data.name_package,
            OldPackName: oldPackName,
            NewPricePack: data.cost,
            SuppId: data.supplier_id,
          },
          refetchQueries: [{ query: HistoryDataDocument }],
          awaitRefetchQueries: true,
        }).catch((error: string) => alert(error));
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
