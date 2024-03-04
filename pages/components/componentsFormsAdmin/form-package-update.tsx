import { State, useHookstate } from '@hookstate/core';
import { Button, InputAdornment, TextField } from '@mui/material';
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

type ErrSetterProperties = {
  errWeight: string;
  errCost: string;
  errpLength: string;
  errHeight: string;
  errWidth: string;
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
  return `Package was modified with parameters: Weight: ${data.weight}, Length: ${data.Plength}, Width: ${data.width}, Height: ${data.height}`;
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
  pLengtharg: string,
  heightarg: string,
  widtharg: string,
  errSetter: State<ErrSetterProperties>,
) => {
  const messageInt = 'Expect number bigger or equal to zero';
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

  const setterErrors = useHookstate({
    errWeight: 'Any',
    errCost: 'Any',
    errpLength: 'Any',
    errHeight: 'Any',
    errWidth: 'Any',
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
      setterErrors,
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
        Only admin has acces to this page
      </div>
    );
  }
  return (
    <div>
      {MyAlert(
        {
          succesUpade: setterForAlertMesssage.succesUpdate.value,
          errUpdate: setterForAlertMesssage.errUpdate.value,
          msgHisotry: setterForAlertMesssage.msgHistory.value,
          msgValidation: setterForAlertMesssage.msgValidation.value,
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
        onChange={() =>
          setterErrors.set({
            errCost: 'Any',
            errHeight: 'Any',
            errpLength: 'Any',
            errWeight: 'Any',
            errWidth: 'Any',
          })
        }
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
          <TextField
            type="text"
            label="Package name"
            required
            id="outlined-required"
            sx={{ m: 1, width: '25ch' }}
            onChange={(e) => settersForDataPack.PackName.set(e.target.value)}
            helperText={`Enter package label`}
            value={settersForDataPack.PackName.get()}
          />
          <TextField
            type="number"
            label="Cost"
            required
            id="outlined-basic"
            sx={{ m: 1, width: '25ch' }}
            onChange={(e) => settersForDataPack.Cost.set(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">Kč</InputAdornment>
              ),
            }}
            helperText={`Enter cost of package`}
            value={settersForDataPack.Cost.get()}
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
            Parameters of package
          </legend>
          <TextField
            type="number"
            label="Width"
            required
            id="outlined-basic"
            sx={{ m: 1, width: '25ch' }}
            onChange={(e) => settersForDataPack.Width.set(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">Cm</InputAdornment>
              ),
            }}
            helperText={`Enter width of package`}
            value={settersForDataPack.Width.get()}
          />
          <TextField
            type="number"
            label="Weight"
            required
            id="outlined-basic"
            sx={{ m: 1, width: '25ch' }}
            onChange={(e) => settersForDataPack.Weight.set(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">Cm</InputAdornment>
              ),
            }}
            helperText={`Enter weight of package`}
            value={settersForDataPack.Weight.get()}
          />
          <TextField
            type="number"
            label="Length"
            required
            id="outlined-basic"
            sx={{ m: 1, width: '25ch' }}
            onChange={(e) => settersForDataPack.Plength.set(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">Cm</InputAdornment>
              ),
            }}
            helperText={`Enter length of package`}
            value={settersForDataPack.Plength.get()}
          />
          <TextField
            type="number"
            label="Height"
            required
            id="outlined-basic"
            sx={{ m: 1, width: '25ch' }}
            onChange={(e) => settersForDataPack.Height.set(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">Cm</InputAdornment>
              ),
            }}
            helperText={`Enter height of package`}
            value={settersForDataPack.Height.get()}
          />
        </fieldset>

        <button className={styles.crudbtn} type="submit">
          Upadte
        </button>
      </form>
    </div>
  );
};
