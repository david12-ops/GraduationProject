import router from 'next/router';
import * as React from 'react';
import { useEffect } from 'react';

import {
  useSuppDataQuery,
  useUpdatePackageMutation,
} from '@/generated/graphql';

import styles from '../../../styles/stylesForm/styleForms.module.css';

type Props = {
  id: string;
};

export const FormPackageUpdate: React.FC<Props> = ({ id }) => {
  // pouziti loadingu u mutation
  const [kg, SetKg] = React.useState(' ');
  const [cost, SetCost] = React.useState(' ');
  const [delka, SetDelka] = React.useState(' ');
  const [vyska, SetVyska] = React.useState(' ');
  const [sirka, SetSirka] = React.useState(' ');
  const [packName, SetPackName] = React.useState(' ');
  const [suppId, SetSuppId] = React.useState(' ');

  const [UpdatePackage] = useUpdatePackageMutation();
  const SuppPackages = useSuppDataQuery();

  useEffect(() => {
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
  }, [id, SuppPackages.data]);

  // eslint-disable-next-line consistent-return
  const handleForm = async (event?: React.FormEvent) => {
    event?.preventDefault();
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
    })
      .then((res) => {
        return res;
      })
      .catch((error: string) => {
        return { err: error };
      });

    const err = result.data.updatePack?.message;
    const data = result.data.updatePack?.data;
    console.log(err);
    if (result.err) {
      return alert(result.err);
    }
    // eslint-disable-next-line no-lonely-if, max-depth
    if (data) {
      alert(`Balíček byl upraven s parametry: Váha: ${data.weight},
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
                placeholder={packName}
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
