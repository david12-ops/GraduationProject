import { useHookstate } from '@hookstate/core';
import { Button } from '@mui/material';
import Alert from '@mui/material/Alert';
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

const Back = async (ids: string) => {
  await router.push(`/../../admpage/${ids}`);
};

const MessageUpdatePack = (data: UpdatedPack) => {
  return `Balíček byl upraven s parametry: Váha: ${data.weight}, Délka: ${data.Plength}, Šířka: ${data.width}, Výška: ${data.height}`;
};

const MessageUpdateHistory = (message: string) => {
  return `Status of update History : ${message}`;
};

const MyAlert = (
  messages: {
    succesUpade: string;
    errUpdate: string;
    msgHisotry: string;
    msgValidation: string;
  },
  sId: string,
) => {
  console.log('messages', messages);
  let alert = <div></div>;

  if (messages.errUpdate !== 'Any') {
    alert = (
      <div>
        <Alert severity="error">{messages.errUpdate}</Alert>
        <Button onClick={() => Back(sId)}>Back</Button>
      </div>
    );
  }

  if (messages.succesUpade !== 'Any' && messages.msgHisotry !== 'Any') {
    alert = (
      <div>
        <Alert severity="success">{messages.succesUpade}</Alert>
        <Alert severity="success">{messages.msgHisotry}</Alert>
        <Button onClick={() => Back(sId)}>Back</Button>
      </div>
    );
  }

  if (messages.msgValidation !== 'Any') {
    alert = (
      <div>
        <Alert severity="error">{messages.msgValidation}</Alert>
        <Button onClick={() => Back(sId)}>Back</Button>
      </div>
    );
  }

  return alert;
};

const isInt = (numArg: string, min: number) => {
  const parsed = parseIntReliable(numArg);

  return parsed !== false && parsed > min;
};

const setDataDatabase = (pId: string, data: Item): DataFrServer | undefined => {
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

export const FormPackageUpdate: React.FC<Props> = ({ id }) => {
  // const BackButtn = React.useCallback(() => Back(id), [id]);
  const settersForDataPack = useHookstate({
    Weight: '',
    Cost: '',
    Plength: ' ',
    Height: '',
    Width: '',
    PackName: '',
    SuppId: '',
  });

  const setterForAlertMesssage = useHookstate({
    errUpdate: 'Any',
    succesUpdate: 'Any',
    msgHistory: 'Any',
    msgValidation: 'Any',
  });

  // const setd = React.useCallback((nwValue) => console.log(nwValue), [2]);

  const user = useHookstate({ Admin: false, LoggedIn: false });

  const [UpdatePackage] = useUpdatePackageMutation();
  const [UpdateHistory] = useUpdateHistoryMutation();
  const SuppPackages = useSuppDataQuery();
  const [oldPackName, SetOldPackName] = React.useState('');
  const [suppId, SetSuppId] = React.useState('');

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
        SetSuppId(data.SuppId);
        SetOldPackName(data.PackName);
        settersForDataPack.set({
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

  const handleForm = async (event?: React.FormEvent) => {
    event?.preventDefault();
    const valid: string | undefined = Valid(
      settersForDataPack.Weight.get(),
      settersForDataPack.Cost.get(),
      settersForDataPack.Plength.get(),
      settersForDataPack.Height.get(),
      settersForDataPack.Width.get(),
    )?.message;
    if (valid) {
      setterForAlertMesssage.msgValidation.set(valid);
    } else {
      setterForAlertMesssage.msgValidation.set('Any');
      const result = await UpdatePackage({
        variables: {
          Weight: Number(settersForDataPack.Weight.get()),
          Cost: Number(settersForDataPack.Cost.get()),
          Length: Number(settersForDataPack.Plength.get()),
          Height: Number(settersForDataPack.Height.get()),
          Width: Number(settersForDataPack.Width.get()),
          Pack_name: settersForDataPack.PackName.get(),
          PackKey: id,
          SuppId: settersForDataPack.SuppId.get(),
        },
        refetchQueries: [{ query: SuppDataDocument }],
        awaitRefetchQueries: true,
      }).catch((error: string) => console.log(error));

      const appErr: string | undefined = result?.data?.updatePack?.message;
      const data: UpdatedPack | undefined = result?.data?.updatePack?.data;

      if (appErr) {
        setterForAlertMesssage.errUpdate.set(appErr);
      } else {
        setterForAlertMesssage.errUpdate.set('Any');
      }

      let updateHistory;
      if (data) {
        SetSuppId(data.supplier_id);
        setterForAlertMesssage.succesUpdate.set(MessageUpdatePack(data));
        updateHistory = await UpdateHistory({
          variables: {
            PackageName: data.name_package,
            OldPackName: oldPackName,
            NewPricePack: data.cost,
            SuppId: data.supplier_id,
          },
          refetchQueries: [{ query: HistoryDataDocument }],
          awaitRefetchQueries: true,
        }).catch((error: string) => console.log(error));
      } else {
        setterForAlertMesssage.succesUpdate.set('Any');
      }

      if (updateHistory?.data?.updateHistory?.message) {
        setterForAlertMesssage.msgHistory.set(
          MessageUpdateHistory(updateHistory?.data?.updateHistory?.message),
        );
      } else {
        setterForAlertMesssage.msgHistory.set('Any');
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
        {MyAlert(
          {
            succesUpade: setterForAlertMesssage.succesUpdate.value,
            errUpdate: setterForAlertMesssage.errUpdate.value,
            msgHisotry: setterForAlertMesssage.msgHistory.value,
            msgValidation: setterForAlertMesssage.msgValidation.value,
          },
          suppId,
        )}
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
                onChange={(e) =>
                  settersForDataPack.PackName.set(e.target.value)
                }
                required
                type="text"
                value={settersForDataPack.PackName.get()}
              />
            </label>
            <label>
              <p className={styles.Odstavce}>Cena</p>
              <input
                className={styles.input}
                onChange={(e) => settersForDataPack.Cost.set(e.target.value)}
                required
                type="number"
                placeholder="Kč"
                value={settersForDataPack.Cost.get()}
              />
            </label>
          </div>
          <h3 className={styles.Nadpisy}>Parametry baliku</h3>
          <div className={styles.divinput}>
            <label>
              <p className={styles.Odstavce}>Sirka</p>
              <input
                className={styles.input}
                onChange={(e) => settersForDataPack.Width.set(e.target.value)}
                required
                type="number"
                placeholder="Cm"
                value={settersForDataPack.Width.get()}
              />
            </label>
            <label>
              <p className={styles.Odstavce}>Hmotnost</p>
              <input
                className={styles.input}
                onChange={(e) => settersForDataPack.Weight.set(e.target.value)}
                required
                type="number"
                placeholder="Kg"
                value={settersForDataPack.Weight.get()}
              />
            </label>
          </div>
          <div className={styles.divinput}>
            <label>
              <p className={styles.Odstavce}>Delka</p>
              <input
                className={styles.input}
                onChange={(e) => settersForDataPack.Plength.set(e.target.value)}
                required
                type="number"
                placeholder="Cm"
                value={settersForDataPack.Plength.get()}
              />
            </label>
            <label>
              <p className={styles.Odstavce}>Vyska</p>
              <input
                className={styles.input}
                onChange={(e) => settersForDataPack.Height.set(e.target.value)}
                required
                type="number"
                placeholder="Cm"
                value={settersForDataPack.Height.get()}
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
