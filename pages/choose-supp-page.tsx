import { ApolloError } from '@apollo/client';
import { State, useHookstate } from '@hookstate/core';
import Head from 'next/head';
import React, { useState } from 'react';

import {
  SuppDataQuery,
  useMutSuitableSuppMutation,
  useSuppDataQuery,
} from '@/generated/graphql';

import styles from '../styles/Home.module.css';
import stylesF from '../styles/stylesForm/styleForms.module.css';
import { ResSuppCard } from './components/Cards/res-supp';
import { FormChooseSup } from './components/formChooseSupp';
import { Navbar } from './components/navbar2';

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

const SetAndReturnDataForm = (
  stateSetter: State<{
    Width: string;
    Height: string;
    Weight: string;
    Plength: string;
    PlaceFrom: string;
    PlaceTo: string;
    Cost: string;
  }>,
) => {
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

  // packName: statesOfFormPack.PackName.get(),

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
) => {
  if (
    !isInt(weightarg, 0) ||
    !isInt(costarg, 0) ||
    !isInt(pLengtharg, 0) ||
    !isInt(heightarg, 0) ||
    !isInt(widtharg, 0)
  ) {
    return new Error('Invalid argument');
  }

  return undefined;
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

  // const setd = React.useCallback((nwValue) => console.log(nwValue), [2]);
  const [dataS, SetData] = useState(Array<DataS>);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const [suitableSupp] = useMutSuitableSuppMutation();
  const suppData = useSuppDataQuery();

  const HandleForm = async () => {
    const valid = Valid(
      statesOfFormPack.Weight.get(),
      statesOfFormPack.Cost.get(),
      statesOfFormPack.Plength.get(),
      statesOfFormPack.Height.get(),
      statesOfFormPack.Width.get(),
    )?.message;
    if (valid) {
      alert(valid);
    } else {
      const result = await suitableSupp({
        variables: {
          Width: Number(statesOfFormPack.Width.get()),
          Weight: Number(statesOfFormPack.Weight.get()),
          Height: Number(statesOfFormPack.Height.get()),
          Length: Number(statesOfFormPack.Plength.get()),
          Mz: statesOfFormPack.PlaceFrom.get(),
          Mdo: statesOfFormPack.PlaceTo.get(),
          Cost: Number(statesOfFormPack.Cost.get()),
        },
      });

      console.log('datatataat');

      if (result.data?.BingoSupPac?.suitable) {
        const data: Array<DataS> = JSON.parse(
          result.data?.BingoSupPac?.suitable,
        );
        console.log('datatataat', data);
        SetData(data);
      } else {
        // eslint-disable-next-line no-alert
        alert(result.data?.BingoSupPac?.message);
      }
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className={styles.main}>
        <FormChooseSup
          onChangeSirka={(e) => statesOfFormPack.Width.set(e)}
          onChangeVyska={(e) => statesOfFormPack.Height.set(e)}
          onChangeHmotnost={(e) => statesOfFormPack.Weight.set(e)}
          onChangeDelka={(e) => statesOfFormPack.Plength.set(e)}
          onChangeCena={(e) => statesOfFormPack.Cost.set(e)}
          onChangeDo={(e) => statesOfFormPack.PlaceTo.set(e)}
          onChangeZ={(e) => statesOfFormPack.PlaceFrom.set(e)}
          buttonEl={
            <button className={stylesF.crudbtn} onClick={HandleForm}>
              odeslat
            </button>
          }
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
