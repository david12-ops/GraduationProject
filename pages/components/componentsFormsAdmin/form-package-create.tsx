import { State, useHookstate } from '@hookstate/core';
import { Alert, Button, InputAdornment, TextField } from '@mui/material';
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

type CreatedPackage = {
  weight: number;
  cost: number;
  Plength: number;
  height: number;
  width: number;
  name_package: string;
  supplier_id: string;
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

const isInt = (numArg: string, min: number) => {
  const parsed = parseIntReliable(numArg);

  return parsed !== false && parsed > min;
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

const Back = async (ids: string) => {
  await router.push(`/../../admpage/${ids}`);
};

const MessageCreatePack = (data: CreatedPackage) => {
  return `Package was created with parameters: Weight: ${data.weight}, Length: ${data.Plength}, Width: ${data.width}, Height: ${data.height}`;
};

const MyAlert = (
  messages: {
    succesCreate: string;
    errCreate: string;
    msgValidation: string;
  },
  sId: string,
) => {
  console.log('messages', messages);
  let alert = <div></div>;

  if (messages.errCreate !== 'Any') {
    alert = (
      <div>
        <Alert severity="error">{messages.errCreate}</Alert>
        <Button onClick={() => Back(sId)}>Back</Button>
      </div>
    );
  }

  if (messages.succesCreate !== 'Any') {
    alert = (
      <div>
        <Alert severity="success">{messages.succesCreate}</Alert>
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

export const FormPackage: React.FC<Props> = ({ id }) => {
  const settersForDataPack = useHookstate({
    Weight: '',
    Cost: '',
    Plength: ' ',
    Height: '',
    Width: '',
    PackName: '',
  });

  const setterForAlertMesssage = useHookstate({
    errCreate: 'Any',
    succesCreate: 'Any',
    msgValidation: 'Any',
  });

  const setterErrors = useHookstate({
    errWeight: 'Any',
    errCost: 'Any',
    errpLength: 'Any',
    errHeight: 'Any',
    errWidth: 'Any',
  });

  const user = useHookstate({ Admin: false, LoggedIn: false });

  const [newPackage] = useNewPackageToFirestoreMutation();
  const [suppId, SetSuppId] = React.useState('');

  useEffect(() => {
    SetSuppId(id);

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
      const result = await newPackage({
        variables: {
          Weight: Number(settersForDataPack.Weight.get()),
          Cost: Number(settersForDataPack.Cost.get()),
          Length: Number(settersForDataPack.Plength.get()),
          Height: Number(settersForDataPack.Height.get()),
          Width: Number(settersForDataPack.Width.get()),
          Pack_name: settersForDataPack.PackName.get(),
          SuppID: id,
          PackId: pID,
        },
        refetchQueries: [{ query: SuppDataDocument }],
        awaitRefetchQueries: true,
      }).catch((error: string) => console.error(error));

      const appErr: string | undefined =
        result?.data?.PackageToFirestore?.message;
      const data: CreatedPackage | undefined =
        result?.data?.PackageToFirestore?.data;

      if (appErr) {
        setterForAlertMesssage.errCreate.set(appErr);
      } else {
        setterForAlertMesssage.errCreate.set('Any');
      }

      if (data) {
        setterForAlertMesssage.succesCreate.set(MessageCreatePack(data));
      } else {
        setterForAlertMesssage.succesCreate.set('Any');
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
          succesCreate: setterForAlertMesssage.succesCreate.value,
          errCreate: setterForAlertMesssage.errCreate.value,
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
