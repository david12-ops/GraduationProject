import { ApolloError } from '@apollo/client';
import { State, useHookstate } from '@hookstate/core';
import { Alert, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import Head from 'next/head';
import React, { useState } from 'react';

import {
  SuppDataQuery,
  useMutSuitableSuppMutation,
  useSuppDataQuery,
} from '@/generated/graphql';

import styles from '../styles/Home.module.css';
import { ResSuppCard } from './components/Cards/res-supp';
import { FormChooseSup } from './components/form-choose-supp';
import { Navbar } from './components/navbar2';

const Submit = styled(Button)(({ theme }) => ({
  color: theme.palette.submitButton.dark,
  backgroundColor: theme.palette.submitButton.light,
}));

type DataFromForm = {
  width: string;
  height: string;
  weight: string;
  plength: string;
  placeFrom: string;
  placeTo: string;
};

type SuppData = {
  data: SuppDataQuery | undefined;
  loading: boolean;
  error: ApolloError | undefined;
};

type DataS = {
  suppId: string;
  cost: number;
  name: string;
};

type Data = {
  __typename?: 'QuerySuppD' | undefined;
  sendCashDelivery: string;
  packInBox: string;
  supplierId: string;
  suppName: string;
  pickUp: string;
  delivery: string;
  insurance: number;
  shippingLabel: string;
  foil: string;
  package?: any | undefined;
  location?: any | undefined;
};

type SuitableSupps = {
  dataS: Data | undefined;
  cost: number;
  packName: string;
};

type ErrSettersProperties = {
  errWidth: string;
  errHeight: string;
  errWeight: string;
  errLength: string;
  errCost: string;
  errPlaceTo: string;
  errFrom: string;
};

type SetterDataProperties = {
  Width: string;
  Height: string;
  Weight: string;
  Plength: string;
  PlaceFrom: string;
  PlaceTo: string;
  Cost: string;
};

const SetAndReturnDataForm = (stateSetter: State<SetterDataProperties>) => {
  const dataForm: DataFromForm = {
    width: '',
    height: '',
    weight: '',
    plength: '',
    placeFrom: '',
    placeTo: '',
  };
  dataForm.width = stateSetter.Width.get();
  dataForm.height = stateSetter.Height.get();
  dataForm.weight = stateSetter.Weight.get();
  dataForm.plength = stateSetter.Plength.get();
  dataForm.placeFrom = stateSetter.PlaceFrom.get();
  dataForm.placeTo = stateSetter.PlaceTo.get();
  return dataForm;
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

const Res = (dataSui: Array<DataS>, allSupp: SuppData) => {
  const SuitableSupps: Array<SuitableSupps> = [];

  dataSui.forEach((itm) => {
    SuitableSupps.push({
      dataS: allSupp.data?.suplierData.find((item) => {
        return item.supplierId === itm.suppId;
      }),
      cost: itm.cost,
      packName: itm.name,
    });
    console.log('sorted val', itm.suppId);
    console.log('supplier', allSupp.data?.suplierData);
  });
  console.log('ssuitabel', SuitableSupps);

  return SuitableSupps ?? [];
};

const RenderSupp = (
  dataFromResolver: Array<DataS>,
  QueryData: SuppData,
  dataFromForm: DataFromForm,
) => {
  const res = Res(dataFromResolver, QueryData);
  if (!QueryData.loading && !QueryData.error && QueryData.data && res) {
    return res.map((itm) =>
      itm.dataS && itm ? (
        <div key={itm.dataS.supplierId}>
          <ResSuppCard
            packName={itm.packName}
            price={itm.cost}
            delivery={itm.dataS.delivery}
            folie={itm.dataS.foil}
            insurance={itm.dataS.insurance}
            packInBox={itm.dataS.packInBox}
            pickUp={itm.dataS.pickUp}
            sendCash={itm.dataS.sendCashDelivery}
            shippingLabel={itm.dataS.shippingLabel}
            name={itm.dataS.suppName}
            sId={itm.dataS.supplierId}
            dataFrPage={dataFromForm}
          />
        </div>
      ) : (
        <div key=""></div>
      ),
    );
  }
  return <div></div>;
};

const Valid = (
  weightarg: string,
  costarg: string,
  pLengtharg: string,
  heightarg: string,
  widtharg: string,
  placeToarg: string,
  placeFromarg: string,
  errorsSetters: State<ErrSettersProperties>,
) => {
  const messageForInt = 'Invalid argument, expect number bigger then zero';
  const messageLoc = 'Invalid argument, expect value depo/personal';
  if (!isInt(weightarg, 0)) {
    errorsSetters.errWeight.set(messageForInt);
    return new Error(messageForInt);
  }

  errorsSetters.errWeight.set('');

  if (!isInt(costarg, 0)) {
    errorsSetters.errCost.set(messageForInt);
    return new Error(messageForInt);
  }

  errorsSetters.errCost.set('');

  if (!isInt(pLengtharg, 0)) {
    errorsSetters.errLength.set(messageForInt);
    return new Error(messageForInt);
  }

  errorsSetters.errLength.set('');

  if (!isInt(heightarg, 0)) {
    errorsSetters.errHeight.set(messageForInt);
    return new Error(messageForInt);
  }

  errorsSetters.errHeight.set('');

  if (!isInt(widtharg, 0)) {
    errorsSetters.errWidth.set(messageForInt);
    return new Error(messageForInt);
  }

  errorsSetters.errWidth.set('');

  if (!['depo', 'personal'].includes(placeToarg)) {
    errorsSetters.errPlaceTo.set(messageLoc);
    return new Error(messageLoc);
  }

  errorsSetters.errPlaceTo.set('');

  if (!['depo', 'personal'].includes(placeFromarg)) {
    errorsSetters.errFrom.set(messageLoc);
    return new Error(messageLoc);
  }

  errorsSetters.errFrom.set('');

  return undefined;
};

const onChangeForm = (
  setters: State<ErrSettersProperties>,
  stateAlert: React.Dispatch<React.SetStateAction<JSX.Element>>,
) => {
  setters.set({
    errWidth: '',
    errHeight: '',
    errWeight: '',
    errLength: '',
    errCost: '',
    errPlaceTo: '',
    errFrom: '',
  });
  stateAlert(<div></div>);
};

const MyInfoAlert = (message: string) => {
  return <Alert severity="info">{message}</Alert>;
};

export default function SuitableSupp() {
  const statesOfFormPack = useHookstate({
    Width: '',
    Height: '',
    Weight: '',
    Plength: '',
    PlaceFrom: '',
    PlaceTo: '',
    Cost: '',
  });

  const errors = useHookstate({
    errWidth: '',
    errHeight: '',
    errWeight: '',
    errLength: '',
    errCost: '',
    errPlaceTo: '',
    errFrom: '',
  });

  // pouzit callBack
  // const setd = React.useCallback((nwValue) => console.log(nwValue), [2]);
  const [dataS, SetData] = useState(Array<DataS>);
  const [myAlert, SetAlert] = useState(<div></div>);

  const [suitableSupp] = useMutSuitableSuppMutation();
  const suppData = useSuppDataQuery();

  const HandleForm = async () => {
    const valid = Valid(
      statesOfFormPack.Weight.get(),
      statesOfFormPack.Cost.get(),
      statesOfFormPack.Plength.get(),
      statesOfFormPack.Height.get(),
      statesOfFormPack.Width.get(),
      statesOfFormPack.PlaceTo.get(),
      statesOfFormPack.PlaceFrom.get(),
      errors,
    )?.message;
    if (valid) {
      console.error(valid);
    } else {
      const result = await suitableSupp({
        variables: {
          Width: Number(statesOfFormPack.Width.get()),
          Weight: Number(statesOfFormPack.Weight.get()),
          Height: Number(statesOfFormPack.Height.get()),
          Length: Number(statesOfFormPack.Plength.get()),
          Where: statesOfFormPack.PlaceFrom.get(),
          FromWhere: statesOfFormPack.PlaceTo.get(),
          Cost: Number(statesOfFormPack.Cost.get()),
        },
      }).catch((error: string) => console.error(error));

      if (result?.data?.BingoSupPac?.suitable) {
        const data: Array<DataS> = JSON.parse(
          result.data?.BingoSupPac?.suitable,
        );
        SetData(data);
      }

      if (result?.data?.BingoSupPac?.message) {
        SetAlert(MyInfoAlert(String(result?.data?.BingoSupPac?.message)));
      }
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Suitable supplierd</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className={styles.main}>
        {myAlert}
        <FormChooseSup
          onChangeForm={() => onChangeForm(errors, SetAlert)}
          onChangeWidth={(e) => statesOfFormPack.Width.set(e)}
          onChangeHeight={(e) => statesOfFormPack.Height.set(e)}
          onChangeWeight={(e) => statesOfFormPack.Weight.set(e)}
          onChangeLength={(e) => statesOfFormPack.Plength.set(e)}
          onChangeCost={(e) => statesOfFormPack.Cost.set(e)}
          onChangeWhere={(e) => statesOfFormPack.PlaceTo.set(e)}
          onChangeFromWhere={(e) => statesOfFormPack.PlaceFrom.set(e)}
          buttonEl={<Submit onClick={HandleForm}>Odeslat</Submit>}
          errors={errors.get()}
        />
        {RenderSupp(
          dataS,
          {
            data: suppData.data,
            loading: suppData.loading,
            error: suppData.error,
          },
          SetAndReturnDataForm(statesOfFormPack),
        )}
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
}
