import { State, useHookstate } from '@hookstate/core';
import { Button, Typography } from '@mui/material';
import Alert from '@mui/material/Alert';
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
import { useAuthContext } from '../auth-context-provider';
import { MyCompTextField } from '../text-field';

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

type ErrSetterProperties = {
  errWeight: string;
  errCost: string;
  errpLength: string;
  errHeight: string;
  errWidth: string;
  errLabel: string;
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
  return `Balík byl upraven s parametry: hmotnost: ${data.weight}, délka: ${data.Plength}, šířka: ${data.width}, výška: ${data.height}`;
};

const MessageUpdateHistory = (message: string) => {
  return `Status úpravy historie : ${message}`;
};

const MyAlert = (
  messages: {
    succesUpade: string;
    errUpdate: string;
    msgHisotry: string;
  },
  sId: string,
) => {
  let alert = <div></div>;

  if (messages.errUpdate !== '') {
    alert = (
      <div>
        <Alert severity="error">{messages.errUpdate}</Alert>
        <Button onClick={() => Back(sId)}>Back</Button>
      </div>
    );
  }

  if (messages.succesUpade !== '' && messages.msgHisotry !== '') {
    alert = (
      <div>
        <Alert severity="success">{messages.succesUpade}</Alert>
        <Alert severity="success">{messages.msgHisotry}</Alert>
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
  pLengtharg: string,
  heightarg: string,
  widtharg: string,
  errSetter: State<ErrSetterProperties>,
) => {
  const messageInt = 'Očekává se číslo větší nebo rovné nule';
  if (!isInt(weightarg, 0)) {
    errSetter.errWeight.set(messageInt);
    return new Error(messageInt);
  }

  if (!isInt(costarg, 0)) {
    errSetter.errCost.set(messageInt);
    return new Error(messageInt);
  }

  if (!isInt(pLengtharg, 0)) {
    errSetter.errpLength.set(messageInt);
    return new Error(messageInt);
  }

  if (!isInt(heightarg, 0)) {
    errSetter.errHeight.set(messageInt);
    return new Error(messageInt);
  }

  if (!isInt(widtharg, 0)) {
    errSetter.errWidth.set(messageInt);
    return new Error(messageInt);
  }

  return undefined;
};

export const FormPackageUpdate: React.FC<Props> = ({ id }) => {
  // const BackButtn = React.useCallback(() => Back(id), [id]);
  const { userApp } = useAuthContext();
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
    errUpdate: '',
    succesUpdate: '',
    msgHistory: '',
  });

  const setterErrors = useHookstate({
    errWeight: '',
    errCost: '',
    errpLength: '',
    errHeight: '',
    errWidth: '',
    errLabel: '',
  });

  const idComp = 'outlined-required';

  const labelHeight = { err: 'Chyba', withoutErr: 'Výška' };
  const labelWeigth = { err: 'Chyba', withoutErr: 'Hmotnost' };
  const labelLength = { err: 'Chyba', withoutErr: 'Délka' };
  const labelWidth = { err: 'Chyba', withoutErr: 'Šířka' };
  const labelCost = { err: 'Chyba', withoutErr: 'Cena' };
  const labelName = { err: 'Chyba', withoutErr: 'Označení' };

  // const setd = React.useCallback((nwValue) => console.log(nwValue), [2]);

  const user = useHookstate({ Admin: false, LoggedIn: false });

  const [UpdatePackage] = useUpdatePackageMutation();
  const [UpdateHistory] = useUpdateHistoryMutation();
  const SuppPackages = useSuppDataQuery();
  const [oldPackName, SetOldPackName] = React.useState('');
  const [suppId, SetSuppId] = React.useState('');

  useEffect(() => {
    const Admin = process.env.NEXT_PUBLIC_AdminEm;
    if (userApp) {
      user.LoggedIn.set(true);
    }
    if (userApp?.email === Admin) {
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
      setterErrors,
    )?.message;
    if (valid) {
      console.error(valid);
    } else {
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
      }).catch((error: string) => console.error(error));

      const appErr: string | undefined = result?.data?.updatePack?.message;
      const data: UpdatedPack | undefined = result?.data?.updatePack?.data;

      if (appErr && /Label is already in use/.test(appErr) === false) {
        setterForAlertMesssage.errUpdate.set(appErr);
      }

      if (appErr && /Label is already in use/.test(appErr)) {
        setterErrors.errLabel.set(appErr);
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
        }).catch((error: string) => console.error(error));
      }

      if (updateHistory?.data?.updateHistory?.message) {
        setterForAlertMesssage.msgHistory.set(
          MessageUpdateHistory(updateHistory?.data?.updateHistory?.message),
        );
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
          margin: 'auto',
        }}
      >
        Nejsi admin!!
      </div>
    );
  }
  return (
    <Typography component={'div'}>
      {MyAlert(
        {
          succesUpade: setterForAlertMesssage.succesUpdate.value,
          errUpdate: setterForAlertMesssage.errUpdate.value,
          msgHisotry: setterForAlertMesssage.msgHistory.value,
        },
        suppId,
      )}

      <form
        onSubmit={handleForm}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
        onChange={() => {
          setterForAlertMesssage.set({
            errUpdate: '',
            succesUpdate: '',
            msgHistory: '',
          });
          setterErrors.set({
            errCost: '',
            errHeight: '',
            errpLength: '',
            errWeight: '',
            errWidth: '',
            errLabel: '',
          });
        }}
      >
        <fieldset
          style={{
            border: '5px solid #F565AD',
            borderRadius: '10px',
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            padding: '1rem',
          }}
        >
          <legend
            style={{
              textAlign: 'center',
              fontSize: '30px',
              fontWeight: 'bold',
            }}
          >
            Package
          </legend>
          <MyCompTextField
            typeComp="text"
            idComp={idComp}
            labelComp={labelName}
            errorComp={setterErrors.errLabel.get()}
            funcComp={(e) => settersForDataPack.PackName.set(e)}
            helpTexterComp="Zadejte označení balíku"
            valueComp={settersForDataPack.PackName.get()}
          />

          <MyCompTextField
            typeComp="number"
            idComp={idComp}
            labelComp={labelCost}
            errorComp={setterErrors.errCost.get()}
            funcComp={(e) => settersForDataPack.Cost.set(e)}
            helpTexterComp="Zadejte cenu balíku"
            placeholderComp="Kč"
            valueComp={settersForDataPack.Cost.get()}
          />
        </fieldset>

        <fieldset
          style={{
            border: '5px solid #F565AD',
            borderRadius: '10px',
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            padding: '1rem',
          }}
        >
          <legend
            style={{
              textAlign: 'center',
              fontSize: '30px',
              fontWeight: 'bold',
            }}
          >
            Parametry balíku
          </legend>
          <MyCompTextField
            typeComp="number"
            idComp={idComp}
            labelComp={labelWidth}
            errorComp={setterErrors.errWidth.get()}
            funcComp={(e) => settersForDataPack.Width.set(e)}
            helpTexterComp="Zadejte šířku balíku"
            placeholderComp="Cm"
            valueComp={settersForDataPack.Width.get()}
          />

          <MyCompTextField
            typeComp="number"
            idComp={idComp}
            labelComp={labelWeigth}
            errorComp={setterErrors.errWeight.get()}
            funcComp={(e) => settersForDataPack.Weight.set(e)}
            helpTexterComp="Zadejte hmotnost balíku"
            placeholderComp="Cm"
            valueComp={settersForDataPack.Weight.get()}
          />

          <MyCompTextField
            typeComp="number"
            idComp={idComp}
            labelComp={labelLength}
            errorComp={setterErrors.errpLength.get()}
            funcComp={(e) => settersForDataPack.Plength.set(e)}
            helpTexterComp="Zadejte délu balíku"
            placeholderComp="Cm"
            valueComp={settersForDataPack.Plength.get()}
          />

          <MyCompTextField
            typeComp="number"
            idComp={idComp}
            labelComp={labelHeight}
            errorComp={setterErrors.errHeight.get()}
            funcComp={(e) => settersForDataPack.Height.set(e)}
            helpTexterComp="Zadejte výšku balíku"
            placeholderComp="Cm"
            valueComp={settersForDataPack.Height.get()}
          />
        </fieldset>

        <Button className={styles.crudbtn} type="submit">
          Upravit
        </Button>
      </form>
    </Typography>
  );
};
